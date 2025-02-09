 import {createAsyncThunk, createSlice}  from"@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
}

export const  LogIN=createAsyncThunk('/auth/LogIn',async (formData)=>{
  try {
    const result= await axios.post("http://localhost:5000/api/auth/logIn",formData);
    return result
    
  } catch (error) {
    console.log(error,'from logIn');
    
  }
  
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            // reducer logic here
        }
    },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;