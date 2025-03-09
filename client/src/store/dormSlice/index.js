// features/dorm/dormSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const registerDorm = createAsyncThunk(
  'dorm/registerDorm',
  async ( formData, { rejectWithValue }) => {
    try {
      const { blockId, floorNumber, dormNumber, capacity } = formData;
      const response = await axios.patch(
        `http://localhost:5000/api/dorm/${blockId}/floors/${floorNumber}/dorms`,
        { dormNumber, capacity },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (err) {
      if (!err.response) {
        return rejectWithValue("Network Error - Server unavailable");
      }
      return rejectWithValue(err.response.data.error);
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