import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client";
import ConversationList from "../components/chat/ConversationList";
import ChatBox from "../components/chat/ChatBox";
import UserList from "../components/chat/UserList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { 
  setConversations, 
  setCurrentChat, 
  setMessages, 
  addMessage, 
  setOnlineUsers, 
  setTypingUser, 
  removeTypingUser,
  clearUnreadCount
} from "../store/chat-slice/chatSlice";

// Create a configured instance of axios with default settings for authentication
const api = axios.create({
  baseURL: 'http://localhost:9000',
  withCredentials: true,
  timeout: 8000,
  headers: {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  }
});

// Configure default axios settings as a fallback
axios.defaults.baseURL = 'http://localhost:9000';
axios.defaults.withCredentials = true;

const MessagesPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { 
    conversations, 
    currentChat, 
    messages, 
    onlineUsers, 
    typingUsers 
  } = useSelector((state) => state.chat);
  
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const socket = useRef();
  const typingTimeoutRef = useRef(null);

  // Initialize socket connection with auth info
  useEffect(() => {
    socket.current = io("http://localhost:9000", {
      withCredentials: true,
      query: { userId: user?._id }
    });
    
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: data.createdAt,
        conversationId: currentChat?._id
      });
    });

    socket.current.on("getUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    socket.current.on("userTyping", (data) => {
      if (data.conversationId === activeChatId) {
        dispatch(setTypingUser(data));
      }
    });

    socket.current.on("userStopTyping", (data) => {
      if (data.conversationId === activeChatId) {
        dispatch(removeTypingUser(data));
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [activeChatId, currentChat, dispatch]);

  // Add user to socket
  useEffect(() => {
    if (user?._id) {
      socket.current.emit("addUser", user._id);
    }
  }, [user]);

  // Handle arrival message
  useEffect(() => {
    if (arrivalMessage && currentChat?.members.includes(arrivalMessage.sender)) {
      dispatch(addMessage(arrivalMessage));
    }
  }, [arrivalMessage, currentChat, dispatch]);

  // Get user conversations with proper auth headers
  useEffect(() => {
    const getConversations = async () => {
      try {
        if (!user || !user._id) {
          console.log("No user ID available");
          return;
        }
        
        console.log("Fetching conversations for user:", user._id);
        const res = await api.get(`/api/messages/conversations/${user._id}`);
        console.log("Conversations response:", res.data);
        dispatch(setConversations(res.data));
      } catch (err) {
        console.error("Error fetching conversations:", err);
        if (err.response && err.response.status === 401) {
          console.error("Authentication failed. Please log in again.");
        }
        if (err.response) {
          console.error("Error response status:", err.response.status);
          console.error("Error data:", err.response.data);
        } else if (err.request) {
          console.error("No response received:", err.request);
        } else {
          console.error("Error message:", err.message);
        }
      }
    };
    if (user?._id) {
      getConversations();
    }
  }, [user, dispatch]);

  // Get messages with proper auth headers
  useEffect(() => {
    const getMessages = async () => {
      try {
        if (!currentChat || !currentChat._id) {
          console.log("No current chat available");
          return;
        }
        
        console.log("Fetching messages for conversation:", currentChat._id);
        const res = await api.get(`/api/messages/${currentChat._id}`);
        console.log("Messages response:", res.data);
        dispatch(setMessages(res.data));
        setActiveChatId(currentChat._id);
        
        if (user && user._id) {
          await api.put(`/api/messages/${currentChat._id}/read/${user._id}`);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        if (err.response && err.response.status === 401) {
          console.error("Authentication failed. Please log in again.");
        }
        if (err.response) {
          console.error("Error response status:", err.response.status);
          console.error("Error data:", err.response.data);
        } else if (err.request) {
          console.error("No response received:", err.request);
        } else {
          console.error("Error message:", err.message);
        }
      }
    };
    getMessages();
  }, [currentChat, user, dispatch]);

  // Handle sending a message with proper auth headers
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat || !currentChat._id || !user || !user._id) {
      console.log("Missing required data for sending message");
      return;
    }

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    if (!receiverId) {
      console.log("No receiver ID found");
      return;
    }

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await api.post("/api/messages/", {
        conversationId: currentChat._id,
        sender: user._id,
        text: newMessage,
      });
      dispatch(addMessage(res.data));
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      if (err.response && err.response.status === 401) {
        console.error("Authentication failed. Please log in again.");
      }
    }
    
    // Stop typing indicator after sending message
    socket.current.emit("stopTyping", {
      conversationId: currentChat._id,
      userId: user._id,
    });
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (currentChat) {
      socket.current.emit("typing", {
        conversationId: currentChat._id,
        userId: user._id,
      });

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing indicator after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        socket.current.emit("stopTyping", {
          conversationId: currentChat._id,
          userId: user._id,
        });
      }, 2000);
    }
  };

  // Get if someone is typing in the current chat
  const isTypingInCurrentChat = currentChat ? 
    typingUsers[currentChat._id] !== undefined : false;

  // Handle setting the current chat
  const handleSetCurrentChat = (chat) => {
    dispatch(setCurrentChat(chat));
    if (chat && chat._id) {
      dispatch(clearUnreadCount(chat._id));
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <div className="container mx-auto p-4 flex flex-col max-h-screen">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Messages</h1>
        </div>
        
        <div className="flex flex-1 gap-4 h-[calc(100vh-100px)] overflow-hidden">
          <div className="w-1/4 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <Tabs defaultValue="users">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="conversations">Conversations</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>
              
              <TabsContent value="conversations" className="h-[calc(100vh-160px)] overflow-auto">
                <ConversationList 
                  conversations={conversations} 
                  currentUser={user} 
                  setCurrentChat={handleSetCurrentChat} 
                  currentChat={currentChat}
                  onlineUsers={onlineUsers}
                />
              </TabsContent>
              
              <TabsContent value="users" className="h-[calc(100vh-160px)] overflow-auto">
                <UserList 
                  currentUser={user} 
                  onlineUsers={onlineUsers}
                  setCurrentChat={handleSetCurrentChat}
                  conversations={conversations}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="w-3/4 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col overflow-hidden">
            {currentChat ? (
              <ChatBox 
                currentChat={currentChat}
                messages={messages}
                user={user}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleSubmit={handleSubmit}
                handleTyping={handleTyping}
                isTyping={isTypingInCurrentChat}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Select a user to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage; 