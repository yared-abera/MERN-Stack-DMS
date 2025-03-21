import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState={
    AllocatedStudent:[]
}


export const InsertAllocatedStudent=createAsyncThunk('student/allocation',async({updatedStudent})=>{
    
    
    try {
        const respons=await axios.post('http://localhost:5000/api/student/insert',updatedStudent,{
            withCredentials:true
        })
     console.log(respons.data,"response of student add");
  
        return respons.data
    } catch (error) {
        return rejectWithValue(error.response.data);
    }

})


export const getAllocatedStudent=createAsyncThunk('student/get',async()=>{
    
    
    try {
        const response=await axios.get('http://localhost:5000/api/student/get', {
            withCredentials:true
        });
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data);
    }

})








 const AllocateSlice=createSlice({
    name:'Allocation',
    initialState,
    reducers:()=>{

    },
    extraReducers:(builder)=>{
        builder.addCase(getAllocatedStudent.fulfilled,(state,action)=>{
            //state.AllocatedStudent=action.payload
            console.log(action.payload);
            

        })
    }
})


export default AllocateSlice.reducer