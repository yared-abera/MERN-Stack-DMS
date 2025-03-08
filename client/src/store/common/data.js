import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  catagorizedStudentData: {}, // Changed to lowercase
  selectOption:null,
  userCalculatedValue:{}
};

export const DataSlice = createSlice({
  name: "data",
  initialState,

  reducers: {
    StudetnDataDirect: (state, action) => {
      // Changed to camelCase
      const { categorizedStudents, selectedValue,userCalculatedValue} = action.payload;
      state.catagorizedStudentData = { ...categorizedStudents };
      console.log(selectedValue,'selectedValue');
      
      state.selectOption = selectedValue;
      state.userCalculatedValue=userCalculatedValue
      //state.errorOccur=action.payload; // No need to return state
    },
  },
});

export const { StudetnDataDirect } = DataSlice.actions;
export default DataSlice.reducer;
