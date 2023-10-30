import { useDispatch, useSelector } from "react-redux";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import rough from "roughjs";

import { socket } from "@/socket";

import { MENU_ITEMS } from "@/constants/menu-items";
import { actionItemClick } from "@/slice/menuSlice";

const roughGenerator = rough.generator();

const Board = () => {
  const dispatch = useDispatch();
  const { activeMenuItem, actionMenuItem } = useSelector((state) => state.menu);
  const { color, size } = useSelector((state) => state.toolbox[activeMenuItem]);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [history, setHistory] = useState([]);
  const [elements, setElements] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleResetCanvas = (emitEvent) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setElements([]);

    if (emitEvent) {
      socket.emit("reset");
    }
  };

  const handleUndo = () => {
    if (elements.length) {
      let updatedElements = [];
      const updatedHistory = [...history, elements[elements.length - 1]];
      setHistory(updatedHistory);

      if (elements.length === 1) {
        handleResetCanvas(false);
        setElements([]);
      } else {
        updatedElements = elements.slice(0, elements.length - 1);
        setElements(updatedElements);
      }

      socket.emit("addPath", { elements: updatedElements, history: updatedHistory });
    }
  };

  const handleRedo = () => {
    if (history.length) {
      const updatedElements = [...elements, history[history.length - 1]];
      const updatedHistory = history.slice(0, history.length - 1);
      setElements(updatedElements);
      setHistory(updatedHistory);
      socket.emit("addPath", { elements: updatedElements, history: updatedHistory });
    }
  };

  useEffect(() => {
    // to handle action items
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;

    if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
      const URL = canvas.toDataURL();
      const anchor = document.createElement("a");
      anchor.href = URL;
      anchor.download = "sketch-from-drawpad.png";
      anchor.click();
    } else if (actionMenuItem === MENU_ITEMS.UNDO) {
      handleUndo();
    } else if (actionMenuItem === MENU_ITEMS.REDO) {
      handleRedo();
    } else if (actionMenuItem === MENU_ITEMS.RESET) {
      handleResetCanvas(true);
    }

    dispatch(actionItemClick(null));
  }, [actionMenuItem]);

  useEffect(() => {
    // to handle config - stroke color and width
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const changeConfig = (color, size) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
    };

    const handleChangeConfig = (config) => {
      changeConfig(config.color, config.size);
    };

    changeConfig(color, size);

    socket.on("changeConfig", handleChangeConfig);

    return () => {
      socket.off("changeConfig", handleChangeConfig);
    };
  }, [color, size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");

    ctxRef.current = ctx;

    const handleAddPath = (paths) => {
      setHistory(paths.history);
      setElements(paths.elements);
    };

    socket.on("addPath", handleAddPath);
    socket.on("reset", handleResetCanvas);

    return () => {
      socket.off("addPath", handleAddPath);
      socket.off("reset", handleResetCanvas);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!elements.length) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [elements]);

  const drawPath = (elements) => {
    const roughCanvas = rough.canvas(canvasRef.current);

    elements.forEach(({ path, type, offsetX, offsetY, width, height, stroke, strokeWidth }) => {
      if (type === MENU_ITEMS.PENCIL) {
        roughCanvas.linearPath(path, {
          stroke,
          strokeWidth,
          roughness: 0,
        });
      } else if (type === MENU_ITEMS.LINE) {
        roughCanvas.draw(roughGenerator.line(offsetX, offsetY, width, height, { stroke, roughness: 0, strokeWidth }));
      } else if (type === MENU_ITEMS.RECTANGLE) {
        roughCanvas.draw(roughGenerator.rectangle(offsetX, offsetY, width, height, { stroke, roughness: 0, strokeWidth }));
      }
    });
  };

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const roughCanvas = rough.canvas(canvas);

    if (elements.length && canvasRef.current) {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (elements.length) {
      drawPath(elements);
    }
  }, [elements]);

  const clearHistory = () => {
    setHistory([]);
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    clearHistory();
    const { offsetX, offsetY } = e.nativeEvent;

    if (activeMenuItem === MENU_ITEMS.PENCIL || activeMenuItem === MENU_ITEMS.ERASER) {
      setElements((prev) => {
        return [
          ...prev,
          {
            type: MENU_ITEMS.PENCIL,
            offsetX: offsetX,
            offsetY: offsetY,
            path: [[offsetX, offsetY]],
            stroke: ctxRef.current.strokeStyle,
            strokeWidth: ctxRef.current.lineWidth,
          },
        ];
      });
    } else if (activeMenuItem === MENU_ITEMS.LINE) {
      setElements((prev) => [
        ...prev,
        {
          type: MENU_ITEMS.LINE,
          offsetX: offsetX,
          offsetY: offsetY,
          width: offsetX,
          height: offsetY,
          stroke: ctxRef.current.strokeStyle,
          strokeWidth: ctxRef.current.lineWidth,
        },
      ]);
    } else if (activeMenuItem === MENU_ITEMS.RECTANGLE) {
      setElements((prev) => [
        ...prev,
        {
          type: MENU_ITEMS.RECTANGLE,
          offsetX: offsetX,
          offsetY: offsetY,
          width: 0,
          height: 0,
          stroke: ctxRef.current.strokeStyle,
          strokeWidth: ctxRef.current.lineWidth,
        },
      ]);
    }
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (isDrawing) {
      if (activeMenuItem === MENU_ITEMS.PENCIL || activeMenuItem === MENU_ITEMS.ERASER) {
        const { path } = elements[elements.length - 1];
        const newPath = [...path, [offsetX, offsetY]];

        setElements((prev) =>
          prev.map((element, index) => {
            if (index === elements.length - 1) {
              return { ...element, path: newPath };
            } else {
              return element;
            }
          })
        );
      } else if (activeMenuItem === MENU_ITEMS.LINE) {
        setElements((prev) => {
          return prev.map((element, index) => {
            if (index === elements.length - 1) {
              return { ...element, width: offsetX, height: offsetY };
            } else {
              return element;
            }
          });
        });
      } else if (activeMenuItem === MENU_ITEMS.RECTANGLE) {
        setElements((prev) => {
          return prev.map((element, index) => {
            if (index === elements.length - 1) {
              return {
                ...element,
                width: offsetX - element.offsetX,
                height: offsetY - element.offsetY,
              };
            } else {
              return element;
            }
          });
        });
      }
    }
  };

  const handleMouseUp = () => {
    socket.emit("addPath", { elements, history });
    setIsDrawing(false);
  };

  return <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}></canvas>;
};

export default Board;
