import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState={
    isLoading: true,
    error: null,
    list: [],
    availableProctors: []
}


export const registerBlock=createAsyncThunk("block/register",
   async(formData)=>{
    try {
        console.log("register blockASyncThunk",formData);
    const result= await axios.post("http://localhost:5000/api/block/register",formData,{
        withCredentials:true
    });

    return result.data
    } catch (error) {
       console.log(error,'error from registerBlock');
        
    }
    
   }
);

export const fetchProctorBlocks = createAsyncThunk(
  'blocks/fetchProctorBlocks',
  async (proctorId, { rejectWithValue }) => {
    try {
      console.log("Fetching blocks for proctor:", proctorId); // Log the proctorId
      const response = await axios.get(`http://localhost:5000/api/block/proctor/my-block?proctorId=${proctorId}`, {
        withCredentials: true,
      });
      console.log("Response from fetchProctorBlocks:", response.data); // Log the response
      return response.data;
    } catch (err) {
      console.error("Error in fetchProctorBlocks:", err); // Log the error
      return rejectWithValue(err.response.data);
    }
  }
);
export const fetchAvailableProctors = createAsyncThunk(
  'blocks/fetchAvailableProctors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/block/proctors/available', {
        withCredentials: true
      });
       
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
    

const blockSlice =createSlice({
    name:"block",
    initialState,
    reducers: {
        setBlock: (state, action) => {
            
        }
    },
    
    extraReducers: (builder)=>{
        builder.addCase(registerBlock.pending, (state) => {
                  state.isLoading = true;   
                }).addCase(registerBlock.fulfilled,(state,action)=>{
             state.isLoading =false;
            console.log("from register Block slice",action.payload);
           
         }).addCase(fetchProctorBlocks.pending, (state) => {
            state.isLoading = true;
            state.error = null;
          }).addCase(fetchProctorBlocks.fulfilled, (state, action) => {
            state.isLoading = false;
            state.list = action.payload.data;
          })
          .addCase(fetchProctorBlocks.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.error || 'Failed to fetch blocks';
          }).addCase(fetchAvailableProctors.pending, (state) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(fetchAvailableProctors.fulfilled, (state, action) => {
            state.isLoading = false;
            state.availableProctors = action.payload;
          })
          .addCase(fetchAvailableProctors.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.message || 'Failed to fetch proctors';
          });
    }

})

export const { setBlock } = blockSlice.actions;
export default blockSlice.reducer;
