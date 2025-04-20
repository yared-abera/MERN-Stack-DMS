import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  currentChat: null,
  messages: [],
  onlineUsers: [],
  typingUsers: {},
  unreadCounts: {},
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Conversations
    setConversations: (state, action) => {
      state.conversations = action.payload;
      
      // Initialize unread counts
      action.payload.forEach(conv => {
        if (conv.unreadCount > 0) {
          state.unreadCounts[conv._id] = conv.unreadCount;
        }
      });
    },
    addConversation: (state, action) => {
      state.conversations = [action.payload, ...state.conversations];
    },
    updateConversation: (state, action) => {
      state.conversations = state.conversations.map(conv => 
        conv._id === action.payload._id ? action.payload : conv);
      
      // Update unread count
      if (action.payload.unreadCount > 0) {
        state.unreadCounts[action.payload._id] = action.payload.unreadCount;
      } else {
        delete state.unreadCounts[action.payload._id];
      }
    },
    
    // Current chat
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
      
      // Clear unread count when opening a conversation
      if (action.payload && state.unreadCounts[action.payload._id]) {
        delete state.unreadCounts[action.payload._id];
      }
    },
    
    // Messages
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      
      // Update conversation last message
      if (state.conversations.length > 0) {
        const conversationId = action.payload.conversationId;
        const conversationIndex = state.conversations.findIndex(
          conv => conv._id === conversationId
        );
        
        if (conversationIndex !== -1) {
          const updatedConversation = {
            ...state.conversations[conversationIndex],
            lastMessage: action.payload.text,
          };
          
          // Remove and reinsert at beginning to maintain sorted order
          const newConversations = [...state.conversations];
          newConversations.splice(conversationIndex, 1);
          state.conversations = [updatedConversation, ...newConversations];
          
          // Increment unread count if the message is not from current user
          if (state.currentChat?._id !== conversationId) {
            state.unreadCounts[conversationId] = (state.unreadCounts[conversationId] || 0) + 1;
          }
        }
      }
    },
    
    // Unread counts
    clearUnreadCount: (state, action) => {
      const conversationId = action.payload;
      if (state.unreadCounts[conversationId]) {
        delete state.unreadCounts[conversationId];
      }
    },
    
    // User statuses
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setTypingUser: (state, action) => {
      state.typingUsers = {
        ...state.typingUsers,
        [action.payload.conversationId]: action.payload.userId,
      };
    },
    removeTypingUser: (state, action) => {
      const { [action.payload.conversationId]: _, ...remainingTypingUsers } = state.typingUsers;
      state.typingUsers = remainingTypingUsers;
    },
    
    // Loading states
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setConversations, 
  addConversation,
  updateConversation,
  setCurrentChat,
  setMessages,
  addMessage,
  clearUnreadCount,
  setOnlineUsers,
  setTypingUser,
  removeTypingUser,
  setLoading,
  setError
} = chatSlice.actions;

export default chatSlice.reducer; 