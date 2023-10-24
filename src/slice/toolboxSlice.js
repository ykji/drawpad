import { createSlice } from "@reduxjs/toolkit";
import { COLORS } from "@/constants/colors";
import { MENU_ITEMS } from "@/constants/menu-items";

const initialState = {
  [MENU_ITEMS.PENCIL]: {
    color: COLORS.BLACK,
    size: 1,
  },
  [MENU_ITEMS.LINE]: {
    color: COLORS.BLACK,
    size: 1,
  },
  [MENU_ITEMS.RECTANGLE]: {
    color: COLORS.BLACK,
    size: 1,
  },
  [MENU_ITEMS.ERASER]: {
    color: COLORS.WHITE,
    size: 1,
  },
  [MENU_ITEMS.UNDO]: {},
  [MENU_ITEMS.REDO]: {},
  [MENU_ITEMS.DOWNLOAD]: {},
  [MENU_ITEMS.RESET]: {},
};

export const toolboxSlice = createSlice({
  name: "toolbox",
  initialState,
  reducers: {
    changeColor: (state, action) => {
      state[action.payload.item].color = action.payload.color;
    },
    changeBrushSize: (state, action) => {
      state[action.payload.item].size = action.payload.size;
    },
  },
});

export const { changeColor, changeBrushSize } = toolboxSlice.actions;

export default toolboxSlice.reducer;
