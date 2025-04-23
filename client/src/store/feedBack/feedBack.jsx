import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  isLoading: false,
  AllFeedBack: [],
};

export const InsertFeedBack = createAsyncThunk(
  "feedBack/insert",
  async ({ userName, description, sex }) => {
    console.log(userName, description ,sex, "userName description ,sex");
    try {
      console.log(userName, description, sex, "userName,description,sex");
      const response = await axios.post(
        "http://localhost:9000/api/feedBack/add",
        { userName, description, sex },
        { withCredentials: true }
      );
 
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getFeedBackForUser = createAsyncThunk(
  "feedBack/get",
  async (sex) => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/feedBack/get/${sex}`,
   
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getFeedBackForStudent = createAsyncThunk(
  "feedBack/getForStud",
  async ({id}) => {
    try {
      console.log(id,"id from fead back");
      
      const respons = await axios.get(
        `http://localhost:9000/api/feedBack/getForStud/${id}`,
         
       
      );
 
      return respons.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const feedBackSlice = createSlice({
  name: "feedBack",
  initialState,

  reducers: () => {},

  extraReducers: (builder) => {
    builder
      .addCase(getFeedBackForUser.pending, (state) => {
        (state.isLoading = true), (state.AllFeedBack = []);
      })
      .addCase(getFeedBackForUser.fulfilled, (state, action) => {
        (state.isLoading = false), (state.AllFeedBack = action.payload);
      })
      .addCase(getFeedBackForUser.rejected, (state, action) => {
        (state.isLoading = false), (state.AllFeedBack = []);
      });
  },
});

export default feedBackSlice.reducer;
