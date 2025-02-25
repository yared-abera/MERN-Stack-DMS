import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  errorOccur:'', // Changed to lowercase
};

export const DataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    isErrorHappen: (state, action) => { // Changed to camelCase
      console.log(action.payload, "from slice");
      state.errorOccur=action.payload; // No need to return state
    },
  },
});

export const { isErrorHappen } = DataSlice.actions;
export default DataSlice.reducer;