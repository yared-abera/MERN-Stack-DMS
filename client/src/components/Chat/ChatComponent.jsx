import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import {
  getChatRoom,
  sendMessage,
  getMessages,
  markAsRead,
  addMessage
} from '../../store/chat/chatSlice';
import { toast } from 'sonner';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';

const ChatComponent = ({ currentUserId, receiverId, userRole }) => {
  const [message, setMessage] = useState('');
  const [socketError, setSocketError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch();
  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  
  const { currentRoom, messages, loading, error } = useSelector((state) => state.chat);

  // Initialize socket connection
  useEffect(() => {
    // Initialize chat room
    dispatch(getChatRoom({ userId: currentUserId, receiverId }))
      .unwrap()
      .then((response) => {
        if (!response.success) {
          toast.error(response.message || 'Failed to load chat room');
        }
      })
      .catch((err) => {
        const errorMessage = err?.message || 'Error loading chat room';
        toast.error(errorMessage);
        setSocketError(errorMessage);
      });

    // Connect to Socket.IO with explicit configuration
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      withCredentials: true,
      auth: { 
        userId: currentUserId,
        token: localStorage.getItem('token')
      }
    });

    // Socket event handlers
    socketRef.current.on('connect', () => {
      setIsConnected(true);
      setSocketError(null);
      
      // Join the room
      socketRef.current.emit('join', { userId: currentUserId, receiverId });
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      const errorMessage = 'Connection failed. Please check your internet connection.';
      setSocketError(errorMessage);
      setIsConnected(false);
      toast.error(errorMessage);
    });

    // Listen for new messages
    socketRef.current.on('message', (newMessage) => {
      if (newMessage && newMessage.message) {
        dispatch(addMessage(newMessage));
        if (newMessage.receiver === currentUserId && currentRoom?._id) {
          dispatch(markAsRead({ roomId: currentRoom._id, userId: currentUserId }));
        }
      }
    });

    // Error handling
    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
      const errorMessage = error.message || 'An error occurred with the chat connection';
      setSocketError(errorMessage);
      toast.error(errorMessage);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [currentUserId, receiverId, dispatch]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle message sending
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    
    if (!trimmedMessage) return;
    if (!isConnected) {
      toast.error('Not connected to chat server. Please try again.');
      return;
    }
    if (!currentRoom?._id) {
      toast.error('Chat room not initialized. Please try again.');
      return;
    }

    const messageData = {
      roomId: currentRoom._id,
      senderId: currentUserId,
      receiverId,
      message: trimmedMessage
    };

    try {
      const result = await dispatch(sendMessage(messageData)).unwrap();
      if (result.success) {
        socketRef.current.emit('sendMessage', messageData);
        setMessage('');
      } else {
        toast.error(result.message || 'Failed to send message');
      }
    } catch (err) {
      const errorMessage = err?.message || 'Error sending message';
      toast.error(errorMessage);
      setSocketError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chat</h2>
        {socketError && (
          <p className="text-sm text-red-500">{socketError}</p>
        )}
        {!isConnected && (
          <p className="text-sm text-yellow-500">Reconnecting...</p>
        )}
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages && messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 ${
                msg.sender === currentUserId ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  msg.sender === currentUserId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                }`}
              >
                <p className="break-words max-w-[300px]">{msg.message}</p>
                <span className="text-xs opacity-75">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
            disabled={!isConnected || !currentRoom}
          />
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded-lg focus:outline-none ${
              isConnected && currentRoom
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!isConnected || !currentRoom}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent; 