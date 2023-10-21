import { useSelector } from "react-redux";

import { COLORS } from "@/constants/colors";

import styles from "./index.module.css";
import { MENU_ITEMS } from "@/constants/menu-items";

const Toolbox = () => {
  const activeMenuItem = useSelector((state) => state.menu.activeMenuItem);
  const showStrokeColor = activeMenuItem === MENU_ITEMS.PENCIL;
  const showBrush =
    activeMenuItem === MENU_ITEMS.PENCIL ||
    activeMenuItem === MENU_ITEMS.ERASER;

  const updateBrushSize = () => {
    console.log("updateBrushSize");
  };

  return (
    <div className={styles.toolboxContainer}>
      {showStrokeColor && (
        <div className={styles.toolContainer}>
          <h4 className={styles.toolLabel}>Stroke</h4>
          <div className={styles.tool}>
            <div
              className={styles.colorBox}
              style={{ backgroundColor: COLORS.BLACK }}
            />
            <div
              className={styles.colorBox}
              style={{ backgroundColor: COLORS.RED }}
            />
            <div
              className={styles.colorBox}
              style={{ backgroundColor: COLORS.GREEN }}
            />
            <div
              className={styles.colorBox}
              style={{ backgroundColor: COLORS.BLUE }}
            />
            <div
              className={styles.colorBox}
              style={{ backgroundColor: COLORS.ORANGE }}
            />
            <div
              className={styles.colorBox}
              style={{ backgroundColor: COLORS.YELLOW }}
            />
            <div
              className={styles.colorBox}
              style={{ backgroundColor: COLORS.WHITE }}
            />
            <div
              className={styles.colorBox}
              style={{ backgroundColor: COLORS.PURPLE }}
            />
          </div>
        </div>
      )}
      {showBrush && (
        <div className={styles.toolContainer}>
          <h4 className={styles.toolLabel}>Brush Size {activeMenuItem}</h4>
          <div className={styles.tool}>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              onChange={updateBrushSize}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbox;
