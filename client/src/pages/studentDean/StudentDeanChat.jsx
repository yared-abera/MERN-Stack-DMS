import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserList from '../../components/Chat/UserList';
import ChatComponent from '../../components/Chat/ChatComponent';
import { io } from 'socket.io-client';
import { getAllUser } from '@/store/user-slice/userSlice';

const SOCKET_URL ='http://localhost:9000';

const StudentDeanChat = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const  {user} = useSelector(state => state.auth);
  const [socket, setSocket] = useState(null);
  const {AllUser,isLoading}=useSelector(state=>state.allUser)
console.log(user,"from chat");
console.log(AllUser,"all user");


  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: { userId:  user.id }
    });

    setSocket(newSocket);

    // Listen for online users updates
    newSocket.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });

    return () => newSocket.disconnect();
  }, [user.id]);

  useEffect(() => {
    

    dispatch(getAllUser()) 
     
  },[dispatch]);
 
 
  useEffect(()=>{

    if(AllUser.success&&AllUser&&AllUser.data&&AllUser.data.length>0){
      setUsers(AllUser.data)
    }
  },[AllUser])

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };
 console.log(selectedUser,"selected user");
 

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
            userRole="studentDean"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
 
 
  );
};

export default StudentDeanChat; 