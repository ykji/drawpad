import { useDispatch, useSelector } from "react-redux";
import { useEffect, useLayoutEffect, useRef } from "react";

import { MENU_ITEMS } from "@/constants/menu-items";
import { actionItemClick } from "@/slice/menuSlice";

const Board = () => {
  const canvasRef = useRef(null);
  const shouldDraw = useRef(false);
  const dispatch = useDispatch();
  const { activeMenuItem, actionMenuItem } = useSelector((state) => state.menu);
  const { color, size } = useSelector((state) => state.toolbox[activeMenuItem]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
      const URL = canvas.toDataURL();
      const anchor = document.createElement("a");
      anchor.href = URL;
      anchor.download = "sketch-from-drawpad.png";
      anchor.click();
    }

    dispatch(actionItemClick(null));
  }, [actionMenuItem, dispatch]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const changeConfig = () => {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
    };

    changeConfig();
  }, [color, size]);

  useLayoutEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const beginPath = (x, y) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const drawLine = (x, y) => {
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const handleMouseDown = (e) => {
      shouldDraw.current = true;
      beginPath(e.clientX, e.clientY);
    };

    const handleMouseMove = (e) => {
      if (shouldDraw.current) {
        drawLine(e.clientX, e.clientY);
      }
    };

    const handleMouseUp = (e) => {
      shouldDraw.current = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default Board;
