import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import AccountPage from './../../components/common/Account';
const initialState={
isLoading:false,
absentStudent:[]
}


 



export const addAttendance=createAsyncThunk('getstudent/forProctor',async(formData)=>{
    try {
                const response=await axios.post('http://localhost:9000/api/attendance/add/' ,formData,{
                    withCredentials:true
                })  
                console.log(response.data,"response of student update");
                return response.data
            } catch (error) {
                return rejectWithValue(error.response.data);
            }
})


export const getAttendanceNotification=createAsyncThunk('getstudent/getNotification',async()=>{
    try {
                const response=await axios.get('http://localhost:9000/api/attendance/getNotification/' ,{
                    withCredentials:true
                })  
                console.log(response.data,"response of student update");
                return response.data
            } catch (error) {
                return rejectWithValue(error.response.data);
            }
})


const attendanceSlice=createSlice({
    name:'attendance',
    initialState,
    reducers:()=>{

    },

    extraReducers:(builder)=>{
        builder.addCase(getAttendanceNotification.rejected,(state)=>{
            state.isLoading=false,
            state.absentStudent=[]
        }).addCase(getAttendanceNotification.pending,(state)=>{
            state.isLoading=true,
            state.absentStudent=[]
        }).addCase(getAttendanceNotification.fulfilled,(state,action)=>{
            state.isLoading=false,
            state.absentStudent=action.payload
        })
    }
})



 
export default attendanceSlice.reducer;
