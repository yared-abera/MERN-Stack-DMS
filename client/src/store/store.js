 import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import themeSlice from "./common/ThemeSlice";
import sidebarReducer from "./common/sidebarSlice";

const store = configureStore({

    reducer: {
        auth: authReducer,
        theme: themeSlice,
        sidebar: sidebarReducer,
    }
})

export default store