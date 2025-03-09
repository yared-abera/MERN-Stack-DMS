// features/dorm/dormSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const registerDorm = createAsyncThunk(
  'dorm/registerDorm',
   async ({ blockNum, floorNumber, dormNumber, capacity }, { rejectWithValue }) => {
    try {
    
      const response = await axios.post(
        'http://localhost:5000/api/dorm/register', // Full backend URL
        {
          blockNum: Number(blockNum),
          floorNumber: Number(floorNumber),
          dormNumber,
          capacity: Number(capacity)
        },
        {
          withCredentials:true
      }
      );
      return response.data;
    } catch (err) {
      // Handle network errors (no server response)
      if (!err.response) {
        return rejectWithValue({ error: "Network Error - Server unavailable" });
      }
      // Forward server error message
      return rejectWithValue(err.response.data);
    }
  }
);

const dormSlice = createSlice({
  name: 'dorm',
  initialState: {
    loading: false,
    error: null,
    success: false,
    registeredDorm: null
  },
  reducers: {
    resetDormState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.registeredDorm = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerDorm.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerDorm.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.registeredDorm = action.payload.data;
      })
      .addCase(registerDorm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error?.message || 'Dorm registration failed';
      });
  }
});

export const { resetDormState } = dormSlice.actions;
export default dormSlice.reducer;