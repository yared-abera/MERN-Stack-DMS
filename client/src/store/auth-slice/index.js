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


export const checkAuthorization = createAsyncThunk(
  "/auth/checkauth",
  async () => {

    try {
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
    } catch (error) {
       
      console.error("Error checking authorization:", error);
      throw error; // Optionally throw the error to handle it in your slice
    }
  }
);


export const LogOutUser=createAsyncThunk('/auth/LogOut',async ()=>{
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
    console.log("from CreateAccountSlice",formData)
    const result= await axios.post("http://localhost:5000/api/auth/account",formData, {
      withCredentials: true,
      
    });
    console.log("successfully created")
    return result.data
    
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
        },
        
    },

    extraReducers: (builder) => {
      builder
        
        .addCase(loginUser.pending, (state) => {
          state.isLoading = true;
          state.isAuthenticated=false
          state.user=null
           
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          state.isLoading = false;
          console.log("logIn user from slice",action.payload);
          
          state.user = action.payload.success ? action.payload.user : null;
          state.isAuthenticated = true//action.payload.success;
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.isLoading = false;
          state.user = null;
          state.isAuthenticated = false;
        }) .addCase(checkAuthorization.pending, (state) => {
          state.isLoading = true;
          state.user=null;
          state.isAuthenticated=false
        }).addCase(checkAuthorization.fulfilled, (state, action) => {
          state.isLoading = false;

          console.log(" user from checkAuthSlice",action.payload);
          console.log("  isAuthenticated from checkAuthSlice",action.payload.success);
             
      
          state.user =  action.payload.user,
          state.isAuthenticated = action.payload.success;
        }).addCase(checkAuthorization.rejected, (state, action) => {
          state.isLoading = false;
          state.user = null;
          state.isAuthenticated = false;
        }).addCase(LogOutUser.fulfilled, (state, action) => {
          
          state.user = null;
          state.isAuthenticated = false;
        }) 
       
    },
});

export const { setUser  } = authSlice.actions;
export default authSlice.reducer;

 