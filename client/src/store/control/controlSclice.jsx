import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  allIssues: [],
};

export const reportStudentIssue = createAsyncThunk(
  "student/reportStudentIssue",
  async (formData) => {
    console.log(formData, "from sclice");

    try {
      const respons = await axios.post(
        "http://localhost:9000/api/control/add",
        formData,
        {
          withCredentials: true,
        }
      );
      console.log(respons.data, "response of student add");

      return respons.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllControlIssues = createAsyncThunk(
  "get/reportStudentIssue",
  async () => {
    try {
      const respons = await axios.get(
        "http://localhost:9000/api/control/get",

        {
          withCredentials: true,
        }
      );
      console.log(respons.data, "response of student issue add");

      return respons.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const UpdateControlIssueSatus = createAsyncThunk(    
  
    "student/UpdateControlIssueSatus",
    async (formData) => {
      try {
        const respons = await axios.put(
            'http://localhost:9000/api/control/update',
          formData,
          {
            withCredentials: true,
          }
        );
        console.log(respons.data, "response of student add");
  
        return respons.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

const ControlSlice = createSlice({
  name: "control",
  initialState,

  reducers: () => {},

  extraReducers: (builder) => {
    builder
      .addCase(getAllControlIssues.pending, (state) => {
        (state.isLoading = true), (state.AllFeedBack = []);
      })
      .addCase(getAllControlIssues.fulfilled, (state, action) => {
        (state.isLoading = false), (state.allIssues = action.payload);
      })
      .addCase(getAllControlIssues.rejected, (state, action) => {
        (state.isLoading = false), (state.allIssues = []);
      });
  },
});

export default ControlSlice.reducer;
