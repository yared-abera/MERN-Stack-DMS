import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';

// Async thunks
export const getChatRoom = createAsyncThunk(
  'chat/getChatRoom',
  async ({ userId, receiverId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/chat/room`, { userId, receiverId }, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get chat room');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ roomId, senderId, receiverId, message }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/chat/message`, {
        roomId,
        senderId,
        receiverId,
        message
      }, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to send message');
    }
  }
);

export const getMessages = createAsyncThunk(
  'chat/getMessages',
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/chat/messages/${roomId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get messages');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'chat/markAsRead',
  async ({ roomId, userId }, { rejectWithValue }) => {
    try {
      await axios.put(`${API_URL}/api/chat/read`, { roomId, userId }, {
        withCredentials: true
      });
      return { roomId, userId };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to mark messages as read');
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
        state.currentRoom = action.payload;
        state.messages = action.payload.messages;
      })
      .addCase(getChatRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // sendMessage
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
      })
      // getMessages
      .addCase(getMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.error = action.payload;
      })
      // markAsRead
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.messages = state.messages.map(msg => {
          if (msg.receiver === action.payload.userId && !msg.read) {
            return { ...msg, read: true };
          }
          return msg;
        });
      });
  },
});

export const { addMessage, setCurrentRoom, clearError } = chatSlice.actions;
export default chatSlice.reducer; 