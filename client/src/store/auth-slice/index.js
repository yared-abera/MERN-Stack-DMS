const {createSlice} = require("@reduxjs/toolkit");




const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      setUser:(state, action) {
          
      } 
    },
    extraReducers: {
        
    }
})

export  const {setUser} = authSlice.actions
export default authSlice.reducer 