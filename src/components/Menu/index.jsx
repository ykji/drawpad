import { useDispatch, useSelector } from "react-redux";

import { faPencil, faGripLines, faSquare, faEraser, faRotateLeft, faRotateRight, faFileArrowDown, faRotate } from "@fortawesome/free-solid-svg-icons";

import cx from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { MENU_ITEMS } from "@/constants/menu-items";
import { menuItemClick, actionItemClick } from "@/slice/menuSlice";

import styles from "./index.module.css";

const Menu = () => {
  const disptach = useDispatch();
  const activeMenuItem = useSelector((state) => state.menu.activeMenuItem);

  const handleMenuItemClick = (itemName) => {
    disptach(menuItemClick(itemName));
  };

  const handleActionItemClick = (itemName) => {
    disptach(actionItemClick(itemName));
  };

  return (
    <div className={styles.menuContainer}>
      <div
        title="Pencil"
        className={cx(styles.iconWrapper, {
          [styles.active]: activeMenuItem === MENU_ITEMS.PENCIL,
        })}
        onClick={() => handleMenuItemClick(MENU_ITEMS.PENCIL)}
      >
        <FontAwesomeIcon icon={faPencil} className={styles.icon} />
      </div>
      <div
        title="Line"
        className={cx(styles.iconWrapper, {
          [styles.active]: activeMenuItem === MENU_ITEMS.LINE,
        })}
        onClick={() => handleMenuItemClick(MENU_ITEMS.LINE)}
      >
        <FontAwesomeIcon icon={faGripLines} className={styles.icon} />
      </div>
      <div
        title="Rectangle"
        className={cx(styles.iconWrapper, {
          [styles.active]: activeMenuItem === MENU_ITEMS.RECTANGLE,
        })}
        onClick={() => handleMenuItemClick(MENU_ITEMS.RECTANGLE)}
      >
        <FontAwesomeIcon icon={faSquare} className={styles.icon} />
      </div>
      <div
        title="Eraser"
        className={cx(styles.iconWrapper, {
          [styles.active]: activeMenuItem === MENU_ITEMS.ERASER,
        })}
        onClick={() => handleMenuItemClick(MENU_ITEMS.ERASER)}
      >
        <FontAwesomeIcon icon={faEraser} className={styles.icon} />
      </div>
      <div title="Undo" className={styles.iconWrapper} onClick={() => handleActionItemClick(MENU_ITEMS.UNDO)}>
        <FontAwesomeIcon icon={faRotateLeft} className={styles.icon} />
      </div>
      <div title="Redo" className={styles.iconWrapper} onClick={() => handleActionItemClick(MENU_ITEMS.REDO)}>
        <FontAwesomeIcon icon={faRotateRight} className={styles.icon} />
      </div>
      <div title="Download" className={styles.iconWrapper} onClick={() => handleActionItemClick(MENU_ITEMS.DOWNLOAD)}>
        <FontAwesomeIcon icon={faFileArrowDown} className={styles.icon} />
      </div>
      <div title="Reset" className={styles.iconWrapper} onClick={() => handleActionItemClick(MENU_ITEMS.RESET)}>
        <FontAwesomeIcon icon={faRotate} className={styles.icon} />
      </div>
    </div>
  );
};

export default Menu;
