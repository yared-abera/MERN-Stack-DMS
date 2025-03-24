import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState={
    AllocatedStudent:[],
    isLoading:true
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


export const getSingleStudent=createAsyncThunk('student/getSingleStudent',async({id})=>{
     
    try {
        const response=await axios.get(`http://localhost:5000/api/student/getOne/${id}`, {
            withCredentials:true
        });
        console.log(response.data,"response of student get from slice");
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data);
    }

})



export const updateStudent=createAsyncThunk('student/update',async({studentId,updatedData})=>{
    try {
        const response=await axios.put(`http://localhost:5000/api/student/update/${studentId}`,updatedData,{
            withCredentials:true
        })  
        console.log(response.data,"response of student update");
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
        builder.addCase(getAllocatedStudent.pending,(state,action)=>{
          state.AllocatedStudent=[]
          state.isLoading=true
         }).addCase(getAllocatedStudent.fulfilled,(state,action)=>{
        state.AllocatedStudent=action.payload.data
        state.isLoading=false
            }).addCase(getAllocatedStudent.rejected,(state,action)=>{
                state.AllocatedStudent=[]
                state.isLoading=false
                    })
    }
})


export default AllocateSlice.reducer