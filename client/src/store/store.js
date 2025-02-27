 import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import themeSlice from "./common/ThemeSlice";
import sidebarReducer from "./common/sidebarSlice";
import blockReducer from "./blockSlice";
const store = configureStore({

    reducer: {
        auth: authReducer,
        theme: themeSlice,
        sidebar: sidebarReducer,
        block:blockReducer
    }
})

export default store