import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  catagorizedStudentData: {}, // Changed to lowercase
  selectOption:null,
  userCalculatedValue:{},
  selectedStudent:[]
};

export const DataSlice = createSlice({
  name: "data",
  initialState,

  reducers: {
    StudetnDataDirect: (state, action) => {
      // Changed to camelCase
      const { categorizedStudents, selectedValue,userCalculatedValue} = action.payload;
      state.catagorizedStudentData = { ...categorizedStudents };
      
      state.selectOption = selectedValue;
      state.userCalculatedValue=userCalculatedValue
      //state.errorOccur=action.payload; // No need to return state
    },

    SelectedStudentData:(state,action)=>{
       
      
      state.selectedStudent=action.payload
    }
  },
});

export const { StudetnDataDirect,SelectedStudentData } = DataSlice.actions;
export default DataSlice.reducer;
