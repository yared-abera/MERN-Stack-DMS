import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import {
  getChatRoom,
  sendMessage,
  markAsRead,
  addMessage,
} from '../../store/chat/chatSlice';
import { toast } from 'sonner';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';

const ChatComponent = ({ currentUserId, receiverId }) => {
  const [message, setMessage] = useState('');
  const [socketError, setSocketError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch();
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  const { currentRoom, messages, loading } = useSelector((state) => state.chat);

  // Initialize socket and chat room
  useEffect(() => {
    dispatch(getChatRoom({ userId: currentUserId, receiverId }))
      .unwrap()
      .catch((err) => {
        toast.error(err?.message || 'Failed to load chat room');
      });

    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: {
        userId: currentUserId,
        token: localStorage.getItem('token'),
      },
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      socketRef.current.emit('join-room', { userId: currentUserId, receiverId });
    });

    socketRef.current.on('connect_error', () => {
      setIsConnected(false);
      toast.error('Connection error. Please check your network.');
    });

    socketRef.current.on('new-message', (newMessage) => {
      if (newMessage?.message) {
        // Replace optimistic message with server response
        dispatch(removeOptimisticMessage(`temp-${newMessage.tempId}`));
        dispatch(addMessage(newMessage));
      }
    });

    return () => socketRef.current?.disconnect();
  }, [currentUserId, receiverId, dispatch]);

  // Scroll handling
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Message sending handler
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !currentRoom?._id) return;

    // Generate temporary ID and timestamp
    const tempId = Date.now();
    const tempMessage = {
      _id: `temp-${tempId}`,
      message: trimmedMessage,
      sender: currentUserId,
      timestamp: new Date().toISOString(),
      tempId, // For server correlation
    };

    // Optimistic update
    dispatch(addMessage(tempMessage));
    setMessage('');

    try {
      const result = await dispatch(
        sendMessage({
          roomId: currentRoom._id,
          senderId: currentUserId,
          receiverId,
          message: trimmedMessage,
          tempId, // Send temporary ID to server
        })
      ).unwrap();

      if (!result.success) {
        dispatch(removeOptimisticMessage(tempMessage._id));
        toast.error(result.message || 'Failed to send message');
      }
    } catch (err) {
      dispatch(removeOptimisticMessage(tempMessage._id));
      toast.error(err?.message || 'Failed to send message');
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
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chat</h2>
        {!isConnected && <p className="text-sm text-yellow-500">Connecting...</p>}
        {socketError && <p className="text-sm text-red-500">{socketError}</p>}
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {messages?.length > 0 ? (
          messages.map((msg) => {
            const senderId = msg.sender?._id || msg.sender;
            const isCurrentUser = senderId === currentUserId;

            return (
              <div
                key={msg._id}
                className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-[75%] ${
                    isCurrentUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  } ${msg._id.startsWith('temp-') ? 'opacity-75' : ''}`}
                >
                  <p className="break-words text-sm">{msg.message}</p>
                  <div className={`mt-1 text-xs ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!isConnected}
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg transition-colors ${
              isConnected && message.trim()
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!isConnected || !message.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;