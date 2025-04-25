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

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';

const ChatComponent = ({ currentUserId, receiverId, userRole }) => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  
  const { currentRoom, messages, loading } = useSelector((state) => state.chat);

  useEffect(() => {
    // Initialize chat room
    dispatch(getChatRoom({ userId: currentUserId, receiverId }));

    // Connect to Socket.IO with explicit configuration
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      withCredentials: true
    });

    // Join the room
    socketRef.current.emit('join', { userId: currentUserId, receiverId });

    // Listen for new messages
    socketRef.current.on('message', (newMessage) => {
      dispatch(addMessage(newMessage));
      if (newMessage.receiver === currentUserId) {
        dispatch(markAsRead({ roomId: currentRoom?._id, userId: currentUserId }));
      }
    });

    // Error handling
    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const messageData = {
      roomId: currentRoom?._id,
      senderId: currentUserId,
      receiverId,
      message: message.trim()
    };

    dispatch(sendMessage(messageData));
    socketRef.current.emit('sendMessage', messageData);
    setMessage('');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chat</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
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
              <p>{msg.message}</p>
              <span className="text-xs opacity-75">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
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
          />
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent; 