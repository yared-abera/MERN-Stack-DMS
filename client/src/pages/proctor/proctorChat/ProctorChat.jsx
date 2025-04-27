 

import ChatComponent from '@/components/Chat/ChatComponent';
import UserList from '@/components/Chat/UserList';
import { getAllUser } from '@/store/user-slice/userSlice';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
 
import { io } from 'socket.io-client';
 
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';

const ProctorChat = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const {user} = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const {AllUser,isLoading}=useSelector(state=>state.allUser)

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: { userId: user.id }
    });

    setSocket(newSocket);

    // Listen for online users updates
    newSocket.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });

    return () => newSocket.disconnect();
  }, [user.id]);

  useEffect(() => {
    // Fetch users that the proctor manager can chat with (proctors)
    dispatch(getAllUser())
  }, []);


  useEffect(()=>{

    if(AllUser.success&&AllUser&&AllUser.data&&AllUser.data.length>0){
      setUsers(AllUser.data)
    }
  },[AllUser])




  

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <UserList
        users={users}
        onSelectUser={handleSelectUser}
        selectedUserId={selectedUser?._id}
        onlineUsers={onlineUsers}
      />
      <div className="flex-1">
        {selectedUser ? (
          <ChatComponent
            currentUserId={user.id}
            receiverId={selectedUser._id}
            userRole="proctor"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a proctor to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ProctorChat; 