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
  async (formData, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/chat/message`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
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

export const deleteMessage = createAsyncThunk(
  'chat/deleteMessage',
  async ({ messageId, roomId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${API_URL}/api/chat/messages/${messageId}`,
        {
          data: { roomId },
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        return messageId;
      }
      return rejectWithValue(response.data.message || 'Failed to delete message');
    } catch (error) {
      console.error('Delete message error:', error.response || error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete message'
      );
    }
  }
);

export const getMessages = createAsyncThunk(
  'chat/getMessages',
  async (receiverId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/chat/messages/${receiverId}`,
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
        `${API_URL}/api/chat/messages/mark-read`,
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

// New thunk to get unread messages count
export const getUnreadCount = createAsyncThunk(
  'chat/getUnreadCount',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/chat/messages/unread-count/${userId}`,
        getAuthHeader()
      );
      if (response.data.success) {
        return response.data.count;
      }
      return rejectWithValue(response.data.message || 'Failed to get unread count');
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get unread count'
      );
    }
  }
);

const initialState = {
  currentRoom: null,
  messages: [],
  loading: false,
  error: null,
  unreadCount: 0,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      // Ensure messages is an array
      if (!Array.isArray(state.messages)) {
        state.messages = [];
      }
      // If message with same ID exists and is pending, replace it
      const index = state.messages.findIndex(msg => msg._id === action.payload._id);
      if (index !== -1) {
        state.messages[index] = action.payload;
      } else {
        state.messages.push(action.payload);
      }
    },
    removeMessage: (state, action) => {
      // Ensure messages is an array
      if (!Array.isArray(state.messages)) {
        state.messages = [];
        return;
      }
      state.messages = state.messages.filter(msg => msg._id !== action.payload);
    },
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
      // Ensure messages array is initialized when setting room
      if (!Array.isArray(state.messages)) {
        state.messages = [];
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // getChatRoom
      .addCase(getChatRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.messages = []; // Initialize messages array
      })
      .addCase(getChatRoom.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.currentRoom = action.payload.data;
          state.messages = Array.isArray(action.payload.data.messages) 
            ? action.payload.data.messages 
            : [];
          state.error = null;
        } else {
          state.error = action.payload.message;
          state.messages = [];
        }
      })
      .addCase(getChatRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to get chat room';
      })
      // sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          // Find and remove any temporary version of this message
          const messages = state.messages.filter(msg => !msg.pending);
          // Add the real message from server
          messages.push(action.payload.data);
          state.messages = messages;
          state.error = null;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to send message';
        // Remove failed temporary messages
        state.messages = state.messages.filter(msg => !msg.pending);
      })
      // deleteMessage
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter(
          (message) => message._id !== action.payload
        );
      })
      // getMessages
      .addCase(getMessages.fulfilled, (state, action) => {
        state.messages = Array.isArray(action.payload) ? action.payload : [];
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
          state.unreadCount = 0;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to mark messages as read';
      })
      // Handle unread count fetching
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        // Check if the response has the expected structure
        if (typeof action.payload === 'object' && 'count' in action.payload) {
          state.unreadCount = action.payload.count;
        } else if (typeof action.payload === 'number') {
          state.unreadCount = action.payload;
        } else {
          console.error('Unexpected unread count response:', action.payload);
          state.unreadCount = 0;
        }
      });
  },
});

export const {
  addMessage,
  removeMessage,
  setCurrentRoom,
  clearError,
  updateUnreadCount,
  incrementUnreadCount,
  resetUnreadCount,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer; 