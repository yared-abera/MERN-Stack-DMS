import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  catagorizedStudentData: {}, // Changed to lowercase
  selectOption:null,
  userCalculatedValue:{},
  selectedStudent:[],
  searchStudent:'',
  SearchUsers:'',
  AllRecentlySearchedUser:[],
};
export const getRecentlySearchedUser=createAsyncThunk("getStudentById",async({role,id})=>{
  try {
    console.log(role ,id,'role id')
    const response=await axios.get(`http://localhost:9000/api/recentuser/SearchStudent/${role}/${id}`,{
      withCredentials:true
    })
    return response.data
    
  } catch (error) {
    console.error("Error in  student by id:", error); // Log the error
      return rejectWithValue(error.response.data);
    
  }

})



export const AddRecentlySearchedUser=createAsyncThunk("AddRecentlySearchedUser",async({userName,role,id})=>{
  
  console.log(id,userName,role,  'AddRecentlySearchedUser');
  
  try {
    console.log(userName,role,'userName,role')
    const response=await axios.post('http://localhost:9000/api/recentuser/add',{userName,role,id},{
      withCredentials:true
    })
    console.log(response.data,'response.data')
    return response.data
    
  } catch (error) {
    console.error("Error in  student by id:", error); // Log the error
      return rejectWithValue(error.response.data);
    
  }

})

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
    },
   SearchStudents:(state,action)=>{
    console.log(action.payload);
    

    state.searchStudent=action.payload
   } ,
   SearchedUsers:(state,action)=>{
    console.log(action.payload);
    

    state.SearchUsers=action.payload  
   } 
  },
  extraReducers:(builder)=>{
    builder.addCase(getRecentlySearchedUser.fulfilled,(state,action)=>{
      state.AllRecentlySearchedUser=action.payload
    })    
  }
});

export const { StudetnDataDirect,SelectedStudentData,SearchStudents,SearchedUsers } = DataSlice.actions;
export default DataSlice.reducer;
