import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
}

export const loginUser=createAsyncThunk('/auth/LogIn',async (formData)=>{
  try {
    const result= await axios.post("http://localhost:5000/api/auth/logIn",formData,{
      withCredentials: true,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
     
    
    return result.data
    
  } catch (error) {
    console.log(error,'from logIn');
    
  }
  
})



export const checkAuth = createAsyncThunk(
  "/auth/checkauth",

  async () => {
    const response = await axios.get(
      "http://localhost:5000/api/auth/checkauth",
      { 
        withCredentials: true,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );

    return response.data;
  }
);


export const LogOut=createAsyncThunk('/auth/LogOut',async ()=>{
  try {
    const result= await axios.get("http://localhost:5000/api/auth/logOut",{
      withCredentials: true,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
     
    
    return result.data
    
  } catch (error) {
    console.log(error,'from logIn');
    
  }
  
})

export const CreateAccount=createAsyncThunk('/auth/createUser',async (formData)=>{
  try {
     
    
    const result= await axios.post("http://localhost:5000/api/auth/account",formData, {
      withCredentials: true,
      
    });
    return result
    
  } catch (error) {
    console.log(error,'from create Account');
    
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

    extraReducers: (builder) => {
      builder
        .addCase(CreateAccount.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(CreateAccount.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = null;
          state.isAuthenticated = false;
        })
        .addCase(CreateAccount.rejected, (state, action) => {
          state.isLoading = false;
          state.user = null;
          state.isAuthenticated = false;
        })
        .addCase(loginUser.pending, (state) => {
          state.isLoading = true;
           
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload.success ? action.payload.user : null;
          state.isAuthenticated = action.payload.success;
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.isLoading = false;
          state.user = null;
          state.isAuthenticated = false;
        }) .addCase(LogOut.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = null;
          state.isAuthenticated = false;
        }) .addCase(checkAuth.pending, (state) => {
          state.isLoading = true;
          state.user=null;
          isAuthenticated=false
        }).addCase(checkAuth.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload.success ? action.payload.user : null;
          state.isAuthenticated = action.payload.success;
        }).addCase(checkAuth.rejected, (state, action) => {
          state.isLoading = false;
          state.user = null;
          state.isAuthenticated = false;
        }) 
       
    },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;

{/** .addCase(checkAuth.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(checkAuth.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload.success ? action.payload.user : null;
          state.isAuthenticated = action.payload.success;
        })
        .addCase(checkAuth.rejected, (state, action) => {
          state.isLoading = false;
        })
        .addCase(logOutUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = null;
          state.isAuthenticated = false;
        }); */}