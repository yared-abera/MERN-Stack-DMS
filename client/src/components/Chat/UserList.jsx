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
        {users.map((user) => {
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
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-white">
                      {user.Fname?.[0]?.toUpperCase() || user.userName?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {user.Fname
                      ? `${user.Fname} ${user.Lname || ''}`
                      : user.userName}
                  </h3>
                  {lastMessage && (
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500 truncate">
                        {lastMessage.message}
                      </p>
                      <span className="text-xs text-gray-400">
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
        })}
      </div>
    </div>
  );
};

export default UserList; 