import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  AllMaintainanceIssue: [],
};
export const SubmitMaintainanceIssue = createAsyncThunk(
  "insert/MaintainanceIssue",
  async (formData) => {

 
    const response = await axios.post(
      "http://localhost:5000/api/maintainanceIssue/add",
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const GetAllMaintainanceIssue = createAsyncThunk(
  "get/MaintainanceIssue",
  async () => {
    const response = await axios.get(
      "http://localhost:5000/api/maintainanceIssue/get",
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const GetMaintenanceIssueForAuser = createAsyncThunk(
    "getOne/MaintainanceIssue",
    async ({ id, Model }) => {
      const response = await axios.get(
        `http://localhost:5000/api/maintainanceIssue/getOne/${id}/${Model}`,
       
      );
      return response.data;
    }
  );
  
const MaintainanceIssueSlice = createSlice({
  name: "maintenanceIssue",
  initialState,
  reducers: () => {},

  extraReducers: (builder) => {
    builder
      .addCase(GetAllMaintainanceIssue.pending, (state) => {
        state.isLoading = true;
        state.AllMaintainanceIssue = [];
      })
      .addCase(GetAllMaintainanceIssue.fulfilled, (state, action) => {
        state.isLoading = false;
        state.AllMaintainanceIssue = action.payload;
      });
  },
});

export default MaintainanceIssueSlice.reducer;
