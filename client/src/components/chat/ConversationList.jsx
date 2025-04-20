import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { formatDistanceToNow } from "date-fns";

// Create a configured instance of axios with correct authentication settings
const api = axios.create({
  baseURL: 'http://localhost:9000',
  withCredentials: true,
  timeout: 8000,
  headers: {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  }
});

const ConversationList = ({ conversations, currentUser, setCurrentChat, currentChat, onlineUsers }) => {
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const userMap = {};
      for (const conversation of conversations) {
        try {
          if (!conversation || !conversation.members) {
            console.log("Invalid conversation object:", conversation);
            continue;
          }
          
          const friendId = conversation.members.find(m => m !== currentUser._id);
          
          // Skip if no friendId found
          if (!friendId) {
            console.log("No friend ID found in conversation");
            continue;
          }
          
          // Log the friend ID for debugging
          console.log("Fetching conversation user with ID:", friendId);
          
          // Use the correct endpoint with /api prefix
          const res = await api.get(`/api/user/getOne/${friendId}`);
          
          console.log("Conversation user response:", res.data);
          
          // Extract user data from the response correctly based on multiple formats
          let userData;
          
          if (res.data && typeof res.data === 'object') {
            if (res.data.user) {
              userData = res.data.user;
            } else if (res.data._id) {
              userData = res.data;
            } else {
              // Try to extract user object if present
              const possibleUser = Object.values(res.data).find(val => 
                val && typeof val === 'object' && val._id === friendId
              );
              userData = possibleUser || null;
            }
          }
          
          if (userData && userData._id) {
            userMap[friendId] = userData;
          } else {
            console.error("Invalid user data format:", res.data);
          }
        } catch (err) {
          console.error("Error fetching user info:", err);
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
      }
      setUsers(userMap);
      setLoading(false);
    };

    if (conversations && conversations.length > 0 && currentUser) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [conversations, currentUser]);

  const isOnline = (userId) => {
    return onlineUsers.some(user => user.userId === userId);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  if (loading) {
    return <div className="p-4 text-center">Loading conversations...</div>;
  }

  if (conversations.length === 0) {
    return <div className="p-4 text-center text-gray-500">No conversations yet</div>;
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {conversations.map((conversation) => {
        const friendId = conversation.members.find(m => m !== currentUser._id);
        const friend = users[friendId];
        const isActive = currentChat?._id === conversation._id;

        return (
          <div 
            key={conversation._id}
            className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              isActive ? "bg-gray-100 dark:bg-gray-700" : ""
            }`}
            onClick={() => setCurrentChat(conversation)}
          >
            <div className="relative">
              <Avatar>
                <AvatarImage src={friend?.profileImg} alt={friend?.name} />
                <AvatarFallback>{friend ? getInitials(friend.name) : "?"}</AvatarFallback>
              </Avatar>
              {isOnline(friendId) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                  {friend?.name || "Unknown User"}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {conversation.updatedAt && formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                </span>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {conversation.lastMessage}
              </p>
            </div>
            
            {conversation.unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {conversation.unreadCount}
              </Badge>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList; 