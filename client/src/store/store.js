import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice';
import MaintainanceIssueSlice from './maintenanceIssue/maintenanceIssue';
import UserSlice from './user-slice/userSlice';
import blockReducer from './blockSlice';
import AllocateSlice from './studentAllocation/allocateSlice';
import chatReducer from './chat-slice/chatSlice';
import themeReducer from './theme-slice/themeSlice';
import sidebarReducer from './common/sidebarSlice';
const store = configureStore({
    reducer: {
        auth: authReducer,
        block: blockReducer,
        student: AllocateSlice,
        allUser: UserSlice,
        issue: MaintainanceIssueSlice,
        chat: chatReducer,
        theme: themeReducer,
        sidebar: sidebarReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['chat/setOnlineUsers', 'chat/setTypingUsers'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.onlineUsers', 'payload.typingUsers'],
                // Ignore these paths in the state
                ignoredPaths: ['chat.onlineUsers', 'chat.typingUsers']
            }
        })
});

export default store;