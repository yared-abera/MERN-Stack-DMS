import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
   
const initialState = {
  isLoading: false,
  AllUser: [],
};

export const getAllUser = createAsyncThunk("getAll/user", async () => {
  try {
    const respoens = await axios.get(
      "http://localhost:9000/api/user/getAll",
      {
        withCredentials: true,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );

    return respoens.data
  } catch (error) {
    console.error("Error getting all user:", error);
    throw error; // Optionally throw the error to handle it in your slice
  }
});

export const getSingleUser = createAsyncThunk("getOne/user", async (id) => {
  try {
    console.log(id);
    
    const response = await axios.get(`http://localhost:9000/api/user/getOne/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting single user:", error);
    throw error; // Optionally throw the error to handle it in your slice
  }
});




export const UpdateUser = createAsyncThunk("Update/user", async ({formData,id}) => {
  try {
    
    
    const response = await axios.put(`http://localhost:9000/api/user/update/${id}`,formData ,{
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting single user:", error);
    throw error; // Optionally throw the error to handle it in your slice
  }
});


export const ComparePasswordAndUpdate=createAsyncThunk('/comparePassword',async ({Password,id})=>{
  try {
    const result= await axios.put(`http://localhost:9000/api/user/password/${id}`,Password,{
      withCredentials: true,
     
    });
     
    
    return result.data
    
  } catch (error) {
    console.log(error,'from logIn');
    
  }
  
})



const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: () => {},
  extraReducers:(builder)=>{
    builder.addCase(getAllUser.pending,(state)=>{
        state.isLoading=true
        state.AllUser=[]
    }).addCase(getAllUser.fulfilled,(state,action)=>{
        state.isLoading=false
        state.AllUser=action.payload
    })
  }
});


export default UserSlice.reducer;