import { createSlice } from "@reduxjs/toolkit";

const initialState =
{ isOpen: true,
  updateAllocation:false,
};
const sidebarSlice = createSlice({
  name: "sidebar",
  initialState ,
  reducers: {
    setUpdateAllocation: (state) => {
      state.updateAllocation = !state.updateAllocation
    },
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { toggleSidebar ,setUpdateAllocation} = sidebarSlice.actions;
export default sidebarSlice.reducer;
