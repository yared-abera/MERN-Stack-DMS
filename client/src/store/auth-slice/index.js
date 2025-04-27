import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:9000/api';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/logIn', formData);
      return response.data;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue({ message: 'Network error - please check your connection' });
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const checkAuthorization = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/auth/checkauth');
      return response.data;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue({ message: 'Network error - please check your connection' });
      }
      // Don't reject on 401 - it's expected when not logged in
      if (error.response.status === 401) {
        return { success: false, message: "Not authenticated" };
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const LogOutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/auth/logOut');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to logout' });
    }
  }
);

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
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.error = null;
        } else {
          state.user = null;
          state.isAuthenticated = false;
          state.error = action.payload.message;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || 'Login failed';
      })

      // Check authorization cases
      .addCase(checkAuthorization.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuthorization.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.error = null;
        } else {
          state.user = null;
          state.isAuthenticated = false;
          // Don't set error for normal "not authenticated" state
          state.error = null;
        }
      })
      .addCase(checkAuthorization.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || 'Authentication check failed';
      })

      // Logout cases
      .addCase(LogOutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(LogOutUser.rejected, (state) => {
        // Even if logout fails on the server, we clear the local state
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;
