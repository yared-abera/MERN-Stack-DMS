import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState={
    isLoading: true,
}


const registerBlock=createAsyncThunk("block/register",
   async(formData)=>{
    try {
        console.log("register blockASyncThunk",formData);
    const result= await axios.post("http://localhost:5000/api/block/register",formData,{
        withCredentials:true
    });

    return result.data
    } catch (error) {
       console.log(error,'error from registerBlock ');
        
    }
    
   }
)

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
           
        }) 
    }

})

export const { setBlock } = blockSlice.actions;
export default blockSlice.reducer;
