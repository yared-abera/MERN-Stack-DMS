import React from 'react';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';

const UserList = ({ users, onSelectUser, selectedUserId, onlineUsers = [] }) => {
  return (
    <div className="w-80 h-full border-r bg-gray-50">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Chats</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-180px)]">
        {/* Check if users array is not empty before mapping */}
        {users && users.length > 0 ? (
          users.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            const lastMessage = user.lastMessage || null;

            return (
              <div
                key={user._id}
                onClick={() => onSelectUser(user)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors ${
                  selectedUserId === user._id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {/* Conditional rendering for profile image or initial */}
                    {user.profileImage ? (
                      // If profileImage exists, display the image
                      <img
                        src={user.profileImage}
                        alt={`${user.Fname || user.userName}'s profile`}
                        className="w-12 h-12 rounded-full object-cover" // Use object-cover to maintain aspect ratio
                        // Optional: Add an onerror handler for broken image URLs
                        onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop
                            // You could set a placeholder image or hide the img tag
                            // For now, let's just log an error
                            console.error("Failed to load profile image:", user.profileImage);
                            // Example: e.target.src = 'URL_TO_PLACEHOLDER_IMAGE';
                        }}
                      />
                    ) : (
                      // If no profileImage, display the initial placeholder
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-white">
                          {/* Use Fname or userName for initial */}
                          {user.Fname?.[0]?.toUpperCase() || user.userName?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Online status indicator */}
                    {isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    {/* Display user's name */}
                    <h3 className="font-semibold">
                      {user.Fname || user.userName || 'Unknown User'} {/* Display Fname or userName */}
                    </h3>
                    {/* Display last message and timestamp */}
                    {lastMessage && (
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500 truncate">
                          {lastMessage.message}
                        </p>
                        <span className="text-xs text-gray-400 ml-2 flex-shrink-0"> {/* Added ml-2 and flex-shrink-0 */}
                          {formatDistanceToNow(new Date(lastMessage.timestamp), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          // Message to display if no users are available
          <div className="p-4 text-center text-gray-500">No users found.</div>
        )}
      </div>
    </div>
  );
};

export default UserList;
