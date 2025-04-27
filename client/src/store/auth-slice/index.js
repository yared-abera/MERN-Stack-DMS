import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export const loginUser = createAsyncThunk("/auth/LogIn", async (formData) => {
  try {
    const result = await axios.post(
      "http://localhost:9000/api/auth/logIn",
      formData,
      {
        withCredentials: true,
        // headers: {
        //   "Cache-Control":
        //     "no-store, no-cache, must-revalidate, proxy-revalidate",
        // },
      }
    );

    return result.data;
  } catch (error) {
    console.log(error, "from logIn in loginUser");
    // Return the error response if available, otherwise create a generic error
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: "An error occurred during login. Please try again."
    };
  }
});

export const checkAuthorization = createAsyncThunk(
  "/auth/checkauth",
  async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/auth/checkauth",
        {
          withCredentials: true,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );

      if (response && response.data) {
        return response.data;
      } else {
        console.log("Response or success property is missing", response);
        throw new Error("Response or success property is missing");
      }
    } catch (error) {
      console.error("Error checking authorization:", error);
      throw error; // Optionally throw the error to handle it in your slice
    }
  }
);

export const LogOutUser = createAsyncThunk("/auth/LogOut", async () => {
  try {
    const result = await axios.get("http://localhost:9000/api/auth/logOut", {
      withCredentials: true,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });

    return result.data;
  } catch (error) {
    console.log(error, "from logIn");
  }
});

export const CreateAccount = createAsyncThunk(
  "/auth/createUser",
  async (formData) => {
    console.log("from CreateAccountSlice", formData);
    
    try {
      console.log("from CreateAccountSlice", formData);
      const result = await axios.post(
        "http://localhost:9000/api/auth/account",
        formData,
        {
          withCredentials: true,
        }
      );
      console.log("successfully created");
      return result.data;
    } catch (error) {
      console.log(error, "from create Account");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("logIn user from slice", action.payload);
        
        // Only update state if login was successful
        if (action.payload && action.payload.success) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuthorization.pending, (state) => {
        state.isLoading = true;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuthorization.fulfilled, (state, action) => {
        state.isLoading = false;

        console.log(" user from checkAuthSlice", action.payload);
        console.log(
          "  isAuthenticated from checkAuthSlice",
          action.payload.success
        );

        (state.user = action.payload.user),
          (state.isAuthenticated = action.payload.success);
      })
      .addCase(checkAuthorization.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(LogOutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
