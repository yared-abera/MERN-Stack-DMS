import React, { useState, useEffect, useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getChatRoom,
  sendMessage,
  markAsRead,
  addMessage,
  incrementUnreadCount,
  resetUnreadCount,
  getUnreadCount,
  getMessages,
} from '../../store/chat/chatSlice';
import { toast } from 'sonner';
import { format, isToday, isYesterday } from 'date-fns';
import Message from '../common/Message';
import ChatInput from '../common/ChatInput';
import { SocketContext } from '../../context/SocketContext';

const ChatComponent = ({ currentUserId, receiverId }) => {
  const [message, setMessage] = useState('');
  const [socketError, setSocketError] = useState(null);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const socket = useContext(SocketContext);

  const { currentRoom, messages, loading } = useSelector((state) => state.chat);

  // Initialize chat room and socket event handlers
  useEffect(() => {
    // Get initial unread count
    if (currentUserId) {
      dispatch(getUnreadCount(currentUserId));
    }

    // Get or create chat room
    dispatch(getChatRoom({ userId: currentUserId, receiverId }))
      .unwrap()
      .then((data) => {
        if (data.success) {
          dispatch(markAsRead({ 
            roomId: data.data._id, 
            userId: currentUserId
          }));
        }
      })
      .catch((err) => {
        toast.error(err?.message || 'Failed to load chat room');
      });

    // Join chat room when socket is available
    if (socket) {
      socket.emit('join', { 
        userId: currentUserId, 
        receiverId 
      });

      // Handle incoming messages
      const handleNewMessage = (newMessage) => {
        console.log('Received message:', newMessage);
        if (newMessage?.message || newMessage?.fileUrl) {
          dispatch(addMessage(newMessage));
          
          // Update unread count for new messages
          if (newMessage.sender !== currentUserId) {
            if (document.hidden) {
              dispatch(incrementUnreadCount());
            } else {
              dispatch(markAsRead({ 
                roomId: currentRoom?._id, 
                userId: currentUserId 
              }));
            }
          }
          // Scroll to bottom on new message
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      };

      socket.on('message', handleNewMessage);

      // Cleanup socket event listeners
      return () => {
        socket.off('message', handleNewMessage);
      };
    }
  }, [currentUserId, receiverId, dispatch, currentRoom?._id, socket]);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && currentRoom?._id) {
        dispatch(markAsRead({ 
          roomId: currentRoom._id, 
          userId: currentUserId 
        }));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentRoom?._id, currentUserId, dispatch]);

  // Scroll handling
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Periodically update unread count
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentUserId) {
        dispatch(getUnreadCount(currentUserId));
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [currentUserId, dispatch]);

  // Fetch messages periodically to ensure sync
  useEffect(() => {
    if (currentRoom?._id) {
      const interval = setInterval(() => {
        dispatch(getMessages(currentRoom._id));
        // Update unread count
        dispatch(getUnreadCount(currentUserId));
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    }
  }, [currentRoom?._id, currentUserId, dispatch]);

  // Message sending handler
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !currentRoom?._id) return;

    // Create message object
    const messageData = {
      roomId: currentRoom._id,
      senderId: currentUserId,
      receiverId,
      message: trimmedMessage
    };

    // Optimistic update
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      message: trimmedMessage,
      sender: currentUserId,
      timestamp: new Date().toISOString(),
    };

    // Add message locally
    dispatch(addMessage(tempMessage));
    setMessage('');

    try {
      // Send via Socket.IO
      socket.emit('sendMessage', messageData);

      // Also send via HTTP for persistence
      const result = await dispatch(
        sendMessage(messageData)
      ).unwrap();

      if (!result.success) {
        toast.error(result.message || 'Failed to send message');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to send message');
    }
  };

  // Function to format date for separator
  const formatDateSeparator = (timestamp) => {
    try {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';

      if (isToday(date)) {
        return 'Today';
      } else if (isYesterday(date)) {
        return 'Yesterday';
      }
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Group messages by date
  const renderMessages = () => {
    if (!messages?.length) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          No messages yet
        </div>
      );
    }

    let currentDate = null;
    const messageGroups = [];
    
    messages.forEach((msg, index) => {
      try {
        if (!msg.timestamp) return;
        
        const messageDate = new Date(msg.timestamp);
        if (isNaN(messageDate.getTime())) return;
        
        const messageDateString = messageDate.toDateString();

        // Only add date separator if it's a new date
        if (currentDate !== messageDateString) {
          currentDate = messageDateString;
          messageGroups.push(
            <div key={`date-${msg.timestamp}`} className="flex justify-center my-4">
              <span className="bg-gray-200 dark:bg-gray-700 px-4 py-1 rounded-full text-sm">
                {formatDateSeparator(msg.timestamp)}
              </span>
            </div>
          );
        }

        // Add the message
        messageGroups.push(
          <Message 
            key={msg._id || `msg-${index}`} 
            message={msg} 
            currentUserId={currentUserId} 
          />
        );
      } catch (error) {
        console.error('Error rendering message:', error);
      }
    });

    return messageGroups;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span>Loading messages...</span>
          </div>
        ) : (
          <>
            {renderMessages()}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Chat input */}
      <ChatInput receiverId={receiverId} />
    </div>
  );
};

export default ChatComponent;