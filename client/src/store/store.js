 import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import themeSlice from "./common/ThemeSlice";

const store = configureStore({

    reducer: {
        auth: authReducer,
        theme: themeSlice,
        
    }
})

export default store