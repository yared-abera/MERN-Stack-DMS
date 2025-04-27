import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import themeSlice from "./common/ThemeSlice";
import sidebarReducer from "./common/sidebarSlice";
import DataSlice  from "./common/data";
import AllocateSlice from './studentAllocation/allocateSlice'
import MaintainanceIssueSlice from './maintenanceIssue/maintenanceIssue'
import UserSlice from './user-slice/userSlice'
import feedBackSlice from './feedBack/feedBack'
import attendanceSlice from './attendance/attendance-Slice'
import ControlSlice from './control/controlSclice.jsx'
import chatReducer from './chat/chatSlice'
import dormReducer from './dormSlice';

import blockReducer from "./blockSlice";
const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeSlice,
        sidebar: sidebarReducer,
        Data:DataSlice,
        block:blockReducer,
        student:AllocateSlice,
        allUser:UserSlice,
        issue:MaintainanceIssueSlice,
        feedBack:feedBackSlice,
        attendance:attendanceSlice,
        control:ControlSlice,
        chat: chatReducer,
        dorm: dormReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export default store