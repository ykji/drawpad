import { COLORS } from "@/constants/colors";
import styles from "./index.module.css";

const Toolbox = () => {
  const updateBrushSize = () => {
    console.log("updateBrushSize");
  };

  return (
    <div className={styles.toolboxContainer}>
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
      <div className={styles.toolContainer}>
        <h4 className={styles.toolLabel}>Brush Size</h4>
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
    </div>
  );
};

export default Toolbox;
