import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { formatDistanceToNow, format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Send, Image as ImageIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

// Create a configured instance of axios with correct authentication settings
const api = axios.create({
  baseURL: 'http://localhost:9000',
  withCredentials: true,
  timeout: 8000,
  headers: {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  }
});

const ChatBox = ({ 
  currentChat, 
  messages, 
  user, 
  newMessage, 
  setNewMessage, 
  handleSubmit, 
  handleTyping,
  isTyping
}) => {
  const [chatPartner, setChatPartner] = useState(null);
  const scrollRef = useRef();

  // Fetch chat partner info
  useEffect(() => {
    const getChatPartner = async () => {
      try {
        if (!currentChat || !currentChat.members) {
          console.log("No current chat or chat members available");
          return;
        }
        
        const partnerId = currentChat.members.find(m => m !== user._id);
        
        // Check if partnerId exists to prevent null API calls
        if (!partnerId) {
          console.log("No partner ID found in current chat");
          return;
        }
        
        // Log the partner ID for debugging
        console.log("Fetching chat partner with ID:", partnerId);
        
        // Update to use correct endpoint with /api prefix
        const res = await api.get(`/api/user/getOne/${partnerId}`);
        
        console.log("Chat partner response:", res.data);
        
        // Handle response correctly for multiple data formats
        let partnerData;
        
        if (res.data && typeof res.data === 'object') {
          if (res.data.user) {
            partnerData = res.data.user;
          } else if (res.data._id) {
            partnerData = res.data;
          } else {
            // Try to extract user object if present
            const possibleUser = Object.values(res.data).find(val => 
              val && typeof val === 'object' && val._id === partnerId
            );
            partnerData = possibleUser || null;
          }
        }
        
        if (partnerData) {
          setChatPartner(partnerData);
        } else {
          console.error("User data not found in response:", res.data);
        }
      } catch (err) {
        console.error("Error fetching chat partner:", err);
        
        // Special handling for auth errors
        if (err.response && err.response.status === 401) {
          console.error("Authentication failed. Please log in again.");
        }
        
        // Show detailed error information
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
    
    if (currentChat) {
      getChatPartner();
    }
  }, [currentChat, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.getDate() === now.getDate() && 
                    date.getMonth() === now.getMonth() && 
                    date.getFullYear() === now.getFullYear();

    if (isToday) {
      return format(date, "h:mm a");
    } else {
      return format(date, "MMM d, h:mm a");
    }
  };

  return (
    <>
      {/* Chat header */}
      <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={chatPartner?.profileImg} alt={chatPartner?.name} />
            <AvatarFallback>{chatPartner ? getInitials(chatPartner.name) : "?"}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium text-gray-900 dark:text-white">
              {chatPartner?.name || "Loading..."}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {chatPartner?.role || ""}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="space-y-4">
          {messages.map((message, index) => {
            const isMine = message.sender === user._id;
            return (
              <div 
                key={message._id || index} 
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                ref={index === messages.length - 1 ? scrollRef : null}
              >
                <div className="flex items-end gap-2 max-w-[75%]">
                  {!isMine && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={chatPartner?.profileImg} alt={chatPartner?.name} />
                      <AvatarFallback>{chatPartner ? getInitials(chatPartner.name) : "?"}</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`rounded-lg p-3 ${
                    isMine 
                      ? "bg-blue-500 text-white" 
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  }`}>
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    <div className={`text-xs mt-1 ${
                      isMine ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {message.createdAt && formatMessageTime(message.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-end gap-2 max-w-[75%]">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={chatPartner?.profileImg} alt={chatPartner?.name} />
                  <AvatarFallback>{chatPartner ? getInitials(chatPartner.name) : "?"}</AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 bg-white dark:bg-gray-800">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 border-t bg-white dark:bg-gray-800 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            className="flex-1 resize-none"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            rows={1}
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </>
  );
};

export default ChatBox; 