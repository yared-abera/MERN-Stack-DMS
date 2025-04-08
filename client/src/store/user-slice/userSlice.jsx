import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
   
const initialState = {
  isLoading: false,
  AllUser: [],
  selectedUser: null,
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

export const updateUserStatus = createAsyncThunk("updateStatus/user", async ({id, status}) => {
  try {
    const response = await axios.put(
      `http://localhost:9000/api/user/update/${id}`,
      { status },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
});

export const deleteUser = createAsyncThunk("delete/user", async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:9000/api/user/delete/${id}`,
      { withCredentials: true }
    );
    return { id, ...response.data };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
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
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    }
  },
  extraReducers:(builder)=>{
    builder
      .addCase(getAllUser.pending,(state)=>{
        state.isLoading=true
        state.AllUser=[]
      })
      .addCase(getAllUser.fulfilled,(state,action)=>{
        state.isLoading=false
        state.AllUser=action.payload
      })
      .addCase(getSingleUser.fulfilled,(state,action)=>{
        state.selectedUser=action.payload.user
      })
      .addCase(updateUserStatus.fulfilled,(state,action)=>{
        // Update the user in the AllUser array
        if (state.AllUser && state.AllUser.success && state.AllUser.data) {
          const updatedUser = action.payload.data;
          const index = state.AllUser.data.findIndex(user => user._id === updatedUser._id);
          if (index !== -1) {
            state.AllUser.data[index] = updatedUser;
          }
        }
      })
      .addCase(deleteUser.fulfilled,(state,action)=>{
        // Remove the user from the AllUser array
        if (state.AllUser && state.AllUser.success && state.AllUser.data) {
          state.AllUser.data = state.AllUser.data.filter(user => user._id !== action.payload.id);
        }
      })
  }
});

export const { setSelectedUser, clearSelectedUser } = UserSlice.actions;
export default UserSlice.reducer;