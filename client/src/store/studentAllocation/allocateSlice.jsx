import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

initialState={
    AllocatedStudent:[]
}


export const InsertAllocatedStudent=createAsyncThunk('student/allocation',async(data)=>{
    
    
    try {
        const respons=await axios.post('http://localhost:5000/api/student/insert',data)

        return respons.data
    } catch (error) {
        return rejectWithValue(error.response.data);
    }

})









 const AllocateSlice=createSlice({
    name:'Allocation',
    initialState,
    reducers:()=>{

    }
})


export default AllocateSlice.reducer