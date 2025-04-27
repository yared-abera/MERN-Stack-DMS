import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';

// Helper function to get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    },
    withCredentials: true
  };
};

// Async thunks
export const getChatRoom = createAsyncThunk(
  'chat/getChatRoom',
  async ({ userId, receiverId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/chat/room`, 
        { userId, receiverId }, 
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { 
          success: false, 
          message: 'Failed to get chat room' 
        }
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ roomId, senderId, receiverId, message }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/chat/message`,
        { roomId, senderId, receiverId, message },
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { 
          success: false, 
          message: 'Failed to send message' 
        }
      );
    }
  }
);

export const getMessages = createAsyncThunk(
  'chat/getMessages',
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/chat/messages/${roomId}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { 
          success: false, 
          message: 'Failed to get messages' 
        }
      );
    }
  }
);

export const markAsRead = createAsyncThunk(
  'chat/markAsRead',
  async ({ roomId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/chat/read`,
        { roomId, userId },
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { 
          success: false, 
          message: 'Failed to mark messages as read' 
        }
      );
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    currentRoom: null,
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // getChatRoom
      .addCase(getChatRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatRoom.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.currentRoom = action.payload.data;
          state.messages = action.payload.data.messages || [];
          state.error = null;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(getChatRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to get chat room';
      })
      // sendMessage
      .addCase(sendMessage.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.messages = action.payload.data.messages;
          state.error = null;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to send message';
      })
      // getMessages
      .addCase(getMessages.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.messages = action.payload.data;
          state.error = null;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to get messages';
      })
      // markAsRead
      .addCase(markAsRead.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.messages = state.messages.map(msg => {
            if (msg.receiver === action.payload.data.userId && !msg.read) {
              return { ...msg, read: true };
            }
            return msg;
          });
          state.error = null;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to mark messages as read';
      });
  },
});

export const { addMessage, setCurrentRoom, clearError } = chatSlice.actions;
export default chatSlice.reducer; 