import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState={
    AllocatedStudent:[],
    isLoading:true
}


export const InsertAllocatedStudent=createAsyncThunk('student/allocation',async({updatedStudent})=>{
    
    
    try {

      
        
        const respons=await axios.post('http://localhost:9000/api/student/insert',updatedStudent,{
            withCredentials:true
        })
     console.log(respons.data,"response of student add");
  
        return respons.data
    } catch (error) {
        return rejectWithValue(error.response.data);
    }

})

export const UpdateStudent=createAsyncThunk('UpdateStudent/get',async({id,formData})=>{
    
    console.log(id,formData);
    
    try {
        const response=await axios.put(`http://localhost:9000/api/student/update/${id}`, formData, {
            withCredentials:true
        });
        
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data);
    }

})

// export const UpdateStudentByStudent=createAsyncThunk('UpdateStudent/get',async({id,formData},{ rejectWithValue })=>{
    
//     console.log(id,formData);
    
//     try {
//         const response=await axios.put(`http://localhost:9000/api/student/updateByStud/${id}`, formData, {
//             withCredentials:true
//         });
//         console.log(response.data,"response of student update by student data from slice");
//         return response.data
        
//     } catch (error) {
//         return rejectWithValue(error.response.data);
//     }

// })


export const UpdateStudentByStudent = createAsyncThunk(
    'UpdateStudent/get',
    async ({ id,  formData }, { rejectWithValue }) => {
      console.log(id, formData);
  
      try {
        const response = await axios.put(
          `http://localhost:9000/api/student/updateByStud/${id}`, 
          formData ,          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        console.log(response.data, "response of student update by student data from slice");
        return response.data;
        
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  

export const DeleteStudent=createAsyncThunk('DeleteStudent/get',async({ id,blockNum,dormId,sex})=>{
   
    
    try {
       
        const response=await axios.delete(`http://localhost:9000/api/student/delete/${id}`,{blockNum,dormId,sex}, {
            withCredentials:true
        });
        
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
            
})


export const DeleteAllStudent = createAsyncThunk(
    'DeleteAllStudent/deleteAll',
    async (StudentData, { rejectWithValue }) => {
      try {
        const response = await axios.delete(`http://localhost:9000/api/student/deleteAll`, {
          data: StudentData, // Pass the array in the data property of the config object
          withCredentials: true
        });
        
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );  

  

export const getAllocatedStudent=createAsyncThunk('student/get',async()=>{
    
    
    try {
        const response=await axios.get('http://localhost:9000/api/student/get', {
            withCredentials:true
        });
        
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data);
    }

})


export const getSingleStudent=createAsyncThunk('student/getSingleStudent',async({id})=>{
     
    try {
        const response=await axios.get(`http://localhost:9000/api/student/getOne/${id}`, {
            withCredentials:true
        });
        console.log(response.data,"response of student get from slice");
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data);
    }

})

export const CompareStudentPasswordAndUpdate=createAsyncThunk('student/changePassword',async({Password,  id })=>{
   
     
    try {
        const response=await axios.put(`http://localhost:9000/api/student/updatePassword/${id}`,Password, {
            withCredentials:true
        });
        console.log(response.data,"response of student get from slice");
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data);
    }

})



export const updateStudent=createAsyncThunk('student/update',async({studentId,updatedData})=>{
    try {
        const response=await axios.put(`http://localhost:9000/api/student/update/${studentId}`,updatedData,{
            withCredentials:true
        })  
        console.log(response.data,"response of student update");
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})


export const getStudentForProctor=createAsyncThunk('getstudent/forProctor',async(id)=>{
    try {
                const response=await axios.get(`http://localhost:9000/api/student/getForProctor/${id}` ,{
                    withCredentials:true
                })  
                console.log(response.data,"response of student update");
                return response.data
            } catch (error) {
                return rejectWithValue(error.response.data);
            }
})

 

 const AllocateSlice=createSlice({
    name:'Allocation',
    initialState,
    reducers:()=>{

    },
    extraReducers:(builder)=>{
        builder.addCase(getAllocatedStudent.pending,(state,action)=>{
          state.AllocatedStudent=[]
          state.isLoading=true
         }).addCase(getAllocatedStudent.fulfilled,(state,action)=>{
        state.AllocatedStudent=action.payload.data
        state.isLoading=false
            }).addCase(getAllocatedStudent.rejected,(state,action)=>{
                state.AllocatedStudent=[]
                state.isLoading=false
                    })
    }
})


export default AllocateSlice.reducer