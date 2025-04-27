// features/dorm/dormSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const registerDorm = createAsyncThunk(
  'dorm/registerDorm',
  async (formData, { rejectWithValue }) => {
    console.log('Form Data from the slice:', formData);
    
    try {
      // Extract the required fields
      const { blockId, floorNumber, dormNumber, capacity,status ,description,registerBy } = formData;
      
      console.log('Registering dorm:', { blockId, floorNumber, dormNumber, capacity });
      
      const response = await axios.patch(
        `http://localhost:9000/api/dorm/${blockId}/floors/${floorNumber}/dorms`,
        // Send only the required fields
        { dormNumber, capacity,status,description,registerBy },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (err) {
      console.error('Error registering dorm:', err);
      if (!err.response) {
        return rejectWithValue("Network Error - Server unavailable");
      }
      return rejectWithValue(err.response.data.error);
    }
  }
);

export const updateDormStatus = createAsyncThunk(
  "dorm/updateStatus",
  async ({ blockId, floorNumber, dormNumber, status }) => {

    console.log("Updating dorm status:", { blockId, floorNumber, dormNumber, status });
    try {
      const response = await axios.patch(
        `http://localhost:9000/api/dorm/${blockId}/floors/${floorNumber}/dorms/${dormNumber}/status`,
        { status }
      );
      console.log("Dorm status updated successfully:", response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
);

export const getMaintenanceIssueDormsSubmmitedByProctor = createAsyncThunk(
  "dorm/getMaintenanceIssueDormsSubmmitedByProctor",
  async () => {
    try {
      const response = await axios.get(
        'http://localhost:9000/api/dorm/getIssueDorms/'
      );

      console.log("Response from getMaintenanceIssueDormsSubmmitedByProctor:", response.data);
      
      return response.data;

    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
);

export const getDormStatistics = createAsyncThunk(
  'dorm/getStatistics',
  async () => {
    try {
      const response = await axios.get(
        'http://localhost:9000/api/dorm/statistics'
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
);

// No other changes needed in this file

const dormSlice = createSlice({
  name: 'dorm',
  initialState: {
    loading: false,
    error: null,
    success: false,
    registeredDorm: null,
    statistics: null
  },
  reducers: {
    resetDormState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.registeredDorm = null;
      state.statistics = null;
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
      })
      .addCase(updateDormStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDormStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Update the dorm status in the list if needed
        const { blockId, floorNumber, dormNumber, status } = action.meta.arg;
        const block = state.registeredDorm.blocks.find(b => b._id === blockId);
        if (block) {
          const floor = block.floors.find(f => f.floorNumber === Number(floorNumber));
          if (floor) {
            const dorm = floor.dorms.find(d => d.dormNumber === dormNumber);
            if (dorm) {
              dorm.dormStatus = status;
            }
          }
        }
      })
      .addCase(updateDormStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getMaintenanceIssueDormsSubmmitedByProctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDormStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDormStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload.data;
      })
      .addCase(getDormStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { resetDormState } = dormSlice.actions;
export default dormSlice.reducer;