import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  AllMaintainanceIssue: [],
  AllMaintenaceIssueByStatus:[]
};
export const SubmitMaintainanceIssue = createAsyncThunk(
  "insert/MaintainanceIssue",
  async (formData) => {

    console.log(formData,'formData')

 
    const response = await axios.post(
      "http://localhost:9000/api/maintainanceIssue/add",
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
  async (gender) => {
  
    
    const response = await axios.get(
      `http://localhost:9000/api/maintainanceIssue/get/${gender}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);
export const GetWholeMaintainanceIssueOfDean = createAsyncThunk(
  "get/GetAllDeanMaintainanceIssue",
  async () => {
  
    
    const response = await axios.get(
      'http://localhost:9000/api/maintainanceIssue/getAll',
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);


export const GetMainenanceIssueByStatus = createAsyncThunk(
  "get/GetMainenanceIssueByStatus",
  async ({gender,selectedStatus}) => {
    console.log(gender,"gender");
    console.log(selectedStatus,"selectedStatus");
    const response = await axios.get(
      `http://localhost:9000/api/maintainanceIssue/getByStatus/${gender}/${selectedStatus}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);




export const GetPendingStatusMaintenaceIssue = createAsyncThunk(
  "get/GetPendingStatusMaintenaceIssue",
  async ({status,id}) => {
    const response = await axios.get(
      `http://localhost:9000/api/maintainanceIssue/getPendingStatus/${status}/${id}`,
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
        `http://localhost:9000/api/maintainanceIssue/getOne/${id}/${Model}`,
       
      );
      return response.data;
    }
  );



  export const VerificationIssue = createAsyncThunk(
    "get/verificationIssue",
    async (verifyId) => {
      const response = await axios.put(
        'http://localhost:9000/api/maintainanceIssue/verify/',verifyId,
        {
          withCredentials: true,
        }
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
      })

      .addCase(GetPendingStatusMaintenaceIssue.fulfilled, (state, action) => {
        state.isLoading = false;
        state.AllMaintenaceIssueByStatus = action.payload.success?action?.payload:[];
      }).addCase(GetPendingStatusMaintenaceIssue.rejected,(state)=>{
        state.isLoading=false,
        state.AllMaintenaceIssueByStatus=[]
      })

  },
});

export default MaintainanceIssueSlice.reducer;
