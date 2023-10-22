import { useSelector, useDispatch } from "react-redux";

import cx from "classnames";

import { socket } from "@/socket";
import { COLORS } from "@/constants/colors";
import { MENU_ITEMS } from "@/constants/menu-items";
import { changeColor, changeBrushSize } from "../../slice/toolboxSlice";

import styles from "./index.module.css";

const Toolbox = () => {
  const dispatch = useDispatch();
  const activeMenuItem = useSelector((state) => state.menu.activeMenuItem);
  const { color: activeColor, size } = useSelector((state) => state.toolbox[activeMenuItem]);
  const showStrokeColor = activeMenuItem === MENU_ITEMS.PENCIL;
  const showBrush = activeMenuItem === MENU_ITEMS.PENCIL || activeMenuItem === MENU_ITEMS.ERASER;

  const updateBrushSize = (size) => {
    dispatch(changeBrushSize({ item: activeMenuItem, size }));
    socket.emit("changeConfig", { color: activeColor, size });
  };

  const updateColor = (color) => {
    dispatch(changeColor({ item: activeMenuItem, color }));
    socket.emit("changeConfig", { color, size });
  };

  return (
    <div className={styles.toolboxContainer}>
      {showStrokeColor && (
        <div className={styles.toolContainer}>
          <h4 className={styles.toolLabel}>Stroke</h4>
          <div className={styles.tool}>
            <div
              className={cx(styles.colorBox, {
                [styles.active]: activeColor === COLORS.BLACK,
              })}
              style={{ backgroundColor: COLORS.BLACK }}
              onClick={() => updateColor(COLORS.BLACK)}
            />
            <div
              className={cx(styles.colorBox, {
                [styles.active]: activeColor === COLORS.RED,
              })}
              style={{ backgroundColor: COLORS.RED }}
              onClick={() => updateColor(COLORS.RED)}
            />
            <div
              className={cx(styles.colorBox, {
                [styles.active]: activeColor === COLORS.GREEN,
              })}
              style={{ backgroundColor: COLORS.GREEN }}
              onClick={() => updateColor(COLORS.GREEN)}
            />
            <div
              className={cx(styles.colorBox, {
                [styles.active]: activeColor === COLORS.BLUE,
              })}
              style={{ backgroundColor: COLORS.BLUE }}
              onClick={() => updateColor(COLORS.BLUE)}
            />
            <div
              className={cx(styles.colorBox, {
                [styles.active]: activeColor === COLORS.ORANGE,
              })}
              style={{ backgroundColor: COLORS.ORANGE }}
              onClick={() => updateColor(COLORS.ORANGE)}
            />
            <div
              className={cx(styles.colorBox, {
                [styles.active]: activeColor === COLORS.YELLOW,
              })}
              style={{ backgroundColor: COLORS.YELLOW }}
              onClick={() => updateColor(COLORS.YELLOW)}
            />
            <div
              className={cx(styles.colorBox, {
                [styles.active]: activeColor === COLORS.WHITE,
              })}
              style={{ backgroundColor: COLORS.WHITE }}
              onClick={() => updateColor(COLORS.WHITE)}
            />
            <div
              className={cx(styles.colorBox, {
                [styles.active]: activeColor === COLORS.PURPLE,
              })}
              style={{ backgroundColor: COLORS.PURPLE }}
              onClick={() => updateColor(COLORS.PURPLE)}
            />
          </div>
        </div>
      )}
      {showBrush && (
        <div className={styles.toolContainer}>
          <h4 className={styles.toolLabel}>Brush Size {activeMenuItem}</h4>
          <div className={styles.tool}>
            <input type="range" min={1} max={10} step={1} onChange={(e) => updateBrushSize(e.target.value)} value={size} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbox;
