 import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import themeSlice from "./common/ThemeSlice";
import sidebarReducer from "./common/sidebarSlice";
import DataSlice  from "./common/data";


const store = configureStore({

    reducer: {
        auth: authReducer,
        theme: themeSlice,
        sidebar: sidebarReducer,
        Data:DataSlice
    }
})

export default store