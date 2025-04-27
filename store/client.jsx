import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  getChatRoom,
  sendMessage,
  getMessages,
  markAsRead,
  addMessage,
} from "../../store/chat/chatSlice";
import { toast } from "sonner";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:9000";

const ChatComponent = ({ currentUserId, receiverId, userRole }) => {
  const [message, setMessage] = useState("");
  const [socketError, setSocketError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch();
  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  const { currentRoom, messages, loading, error } = useSelector(
    (state) => state.chat
  );

  // Initialize socket connection
  useEffect(() => {
    // Initialize chat room
    dispatch(getChatRoom({ userId: currentUserId, receiverId }))
      .unwrap()
      .then((response) => {
        if (!response.success) {
          toast.error(response.message || "Failed to load chat room");
        }
      })
      .catch((err) => {
        const errorMessage = err?.message || "Error loading chat room";
        toast.error(errorMessage);
        setSocketError(errorMessage);
      });

    // Connect to Socket.IO with explicit configuration
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
      withCredentials: true,
      auth: {
        userId: currentUserId,
        token: localStorage.getItem("token"),
      },
    });

    // Socket event handlers
    socketRef.current.on("connect", () => {
      setIsConnected(true);
      setSocketError(null);

      // Join the room
      socketRef.current.emit("join", { userId: currentUserId, receiverId });
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      const errorMessage =
        "Connection failed. Please check your internet connection.";
      setSocketError(errorMessage);
      setIsConnected(false);
      toast.error(errorMessage);
    });

    // Listen for new messages
    socketRef.current.on("message", (newMessage) => {
      if (newMessage && newMessage.message) {
        dispatch(addMessage(newMessage));
        if (newMessage.receiver === currentUserId && currentRoom?._id) {
          dispatch(
            markAsRead({ roomId: currentRoom._id, userId: currentUserId })
          );
        }
      }
    });

    // Error handling
    socketRef.current.on("error", (error) => {
      console.error("Socket error:", error);
      const errorMessage =
        error.message || "An error occurred with the chat connection";
      setSocketError(errorMessage);
      toast.error(errorMessage);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [currentUserId, receiverId, dispatch, currentRoom?._id]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle message sending
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;
    if (!isConnected) {
      toast.error("Not connected to chat server. Please try again.");
      return;
    }
    if (!currentRoom?._id) {
      toast.error("Chat room not initialized. Please try again.");
      return;
    }

    const messageData = {
      roomId: currentRoom._id,
      senderId: currentUserId,
      receiverId,
      message: trimmedMessage,
    };

    try {
      const result = await dispatch(sendMessage(messageData)).unwrap();
      if (result.success) {
        socketRef.current.emit("sendMessage", messageData);
        setMessage("");
      } else {
        toast.error(result.message || "Failed to send message");
      }
    } catch (err) {
      const errorMessage = err?.message || "Error sending message";
      toast.error(errorMessage);
      setSocketError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  console.log(messages, "messgaes");
  console.log(currentRoom, "currentRoom");
  // return (
  //   <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
  //     {/* Chat Header */}
  //     <div className="p-4 border-b">
  //       <h2 className="text-lg font-semibold">Chat</h2>
  //       {socketError && (
  //         <p className="text-sm text-red-500">{socketError}</p>
  //       )}
  //       {!isConnected && (
  //         <p className="text-sm text-yellow-500">Reconnecting...</p>
  //       )}
  //       {error && (
  //         <p className="text-sm text-red-500">{error}</p>
  //       )}
  //     </div>

  //     {/* Messages Area */}
  //     <div className="flex-1 p-4 overflow-y-auto">
  //       {messages && messages.length > 0 ? (
  //         messages.map((msg, index) => {
  //           // Check if sender is an object (populated) or just an ID
  //           const senderId = msg.sender._id || msg.sender;
  //           const isCurrentUser = senderId === currentUserId;

  //           return (
  //             <div
  //               key={index}
  //               className={`mb-4 ${
  //                 isCurrentUser ? 'text-right' : 'text-left'
  //               }`}
  //             >
  //               <div
  //                 className={`inline-block p-2 rounded-lg ${
  //                   isCurrentUser
  //                     ? 'bg-blue-500 text-white'
  //                     : 'bg-gray-200'
  //                 }`}
  //               >
  //                 <p className="break-words max-w-[300px]">{msg.message}</p>
  //                 <span className="text-xs opacity-75">
  //                   {new Date(msg.timestamp).toLocaleTimeString()}
  //                 </span>
  //               </div>
  //             </div>
  //           );
  //         })
  //       ) : (
  //         <div className="flex items-center justify-center h-full text-gray-500">
  //           No messages yet
  //         </div>
  //       )}
  //       <div ref={messagesEndRef} />
  //     </div>

  //     {/* Message Input */}
  //     <form onSubmit={handleSendMessage} className="p-4 border-t">
  //       <div className="flex gap-2">
  //         <input
  //           type="text"
  //           value={message}
  //           onChange={(e) => setMessage(e.target.value)}
  //           placeholder="Type a message..."
  //           className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
  //           disabled={!isConnected || !currentRoom}
  //         />
  //         <button
  //           type="submit"
  //           className={`px-4 py-2 text-white rounded-lg focus:outline-none ${
  //             isConnected && currentRoom
  //               ? 'bg-blue-500 hover:bg-blue-600'
  //               : 'bg-gray-400 cursor-not-allowed'
  //           }`}
  //           disabled={!isConnected || !currentRoom}
  //         >
  //           Send
  //         </button>
  //       </div>
  //     </form>
  //   </div>
  // );
  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chat</h2>
        {socketError && <p className="text-sm text-red-500">{socketError}</p>}
        {!isConnected && (
          <p className="text-sm text-yellow-500">Connecting...</p>
        )}
        {error && ( // Assuming 'error' from Redux state
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages && messages.length > 0 ? (
          messages.map((msg, index) => {
            // Determine sender ID: Check if sender is an object (populated) or just an ID string
            // This is the key fix for handling messages from different sources (initial fetch vs socket)
            const senderId =
              typeof msg.sender === "object" && msg.sender !== null
                ? msg.sender._id
                : msg.sender;

            const isCurrentUser = senderId === currentUserId;

            return (
              <div
                key={msg._id || index} // Use msg._id if available (from backend), fallback to index
                className={`mb-4 flex ${
                  isCurrentUser ? "justify-end" : "justify-start" // Use flexbox for alignment
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg max-w-[70%] ${
                    // Added max-w for message bubble width
                    isCurrentUser
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800" // Added text color for receiver messages
                  }`}
                >
                  <p className="break-words">{msg.message}</p>{" "}
                  {/* Removed max-w from here */}
                  <span
                    className={`text-xs opacity-75 block mt-1 ${
                      isCurrentUser ? "text-right" : "text-left"
                    }`}
                  >
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet
          </div>
        )}
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
            disabled={!isConnected || !currentRoom} // Disable input if not connected or room not ready
          />
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded-lg focus:outline-none ${
              isConnected && currentRoom && message.trim() // Also check if message is not empty
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isConnected || !currentRoom || !message.trim()} // Disable button if not connected, room not ready, or message is empty
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;

// import React, { useState, useEffect, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { io } from 'socket.io-client';
// import {
//   getChatRoom,
//   sendMessage,
//   getMessages, // Note: getMessages is imported but not used in the provided snippet
//   markAsRead,
//   addMessage
// } from '../../store/chat/chatSlice';
// import { toast } from 'sonner'; // Assuming 'sonner' is used for toasts

// // Define the SOCKET_URL - ENSURE THIS EXACTLY MATCHES YOUR SERVER'S LISTENING ADDRESS AND PORT
// // Based on your server code, this should be http://localhost:9000
// const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000'; // Using environment variable with fallback

// const ChatComponent = ({ currentUserId, receiverId, userRole }) => {
//   const [message, setMessage] = useState('');
//   const [socketError, setSocketError] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const dispatch = useDispatch();
//   const socketRef = useRef();
//   const messagesEndRef = useRef(null);
//   // const {user}=useSelector(state=>state.auth) // user is imported but not used in this snippet

//   const { currentRoom, messages, loading, error } = useSelector((state) => state.chat);

//   // Initialize socket connection and fetch chat room data
//   useEffect(() => {
//     // Do not proceed if essential IDs are missing
//     if (!currentUserId || !receiverId) {
//         console.warn("currentUserId or receiverId is missing, skipping chat initialization.");
//         // Optionally set an error state or show a message to the user
//         return;
//     }

//     // Initialize chat room - This fetches initial messages and room details
//     // This should ideally happen before or in parallel with socket connection
//     dispatch(getChatRoom({ userId: currentUserId, receiverId }))
//       .unwrap()
//       .then((response) => {
//         if (!response.success) {
//           toast.error(response.message || 'Failed to load chat room');
//         }
//       })
//       .catch((err) => {
//         const errorMessage = err?.message || 'Error loading chat room';
//         toast.error(errorMessage);
//         // Consider if you want to show this error via socketError state
//         // setSocketError(errorMessage);
//       });

//     // Connect to Socket.IO with explicit configuration
//     socketRef.current = io(SOCKET_URL, {
//       transports: ['websocket'], // Explicitly prefer websocket
//       autoConnect: true,
//       withCredentials: true,
//       auth: {
//         userId: currentUserId,
//         token: localStorage.getItem('token') // Make sure token is available and valid
//       },
//       timeout: 10000 // 10 seconds connection timeout
//     });

//     // Socket event handlers
//     socketRef.current.on('connect', () => {
//       console.log('Socket connected:', socketRef.current.id);
//       setIsConnected(true);
//       setSocketError(null);

//       // Join the room immediately upon connection
//       const roomId = [currentUserId, receiverId].sort().join('-');
//       console.log(`Attempting to join room: ${roomId}`);
//       socketRef.current.emit('join', { userId: currentUserId, receiverId });
//     });

//     socketRef.current.on('connect_error', (error) => {
//       console.error('Socket connection error:', error);
//       const errorMessage = `Connection failed. Please check your internet connection or server address (${SOCKET_URL}).`;
//       setSocketError(errorMessage);
//       setIsConnected(false);
//       toast.error(errorMessage);
//     });

//     // Listen for new messages
//     socketRef.current.on('message', (newMessage) => {
//       console.log('Received message:', newMessage);
//       if (newMessage && newMessage.message) {
//         // Dispatch action to add the new message to Redux state
//         // The structure of newMessage here is crucial.
//         // It should ideally match the structure expected by your Redux slice (addMessage)
//         // and the rendering logic below.
//         // If the server sends just senderId, ensure addMessage handles it.
//         dispatch(addMessage(newMessage));

//         // Mark message as read if it's for the current user and in the active room
//         // Using newMessage.receiverId as sent from the server
//         if (newMessage.receiverId === currentUserId && currentRoom?._id) {
//           console.log(`Marking message as read in room ${currentRoom._id}`);
//           dispatch(markAsRead({ roomId: currentRoom._id, userId: currentUserId }));
//         }
//       }
//     });

//     // Listen for server-side errors emitted
//     socketRef.current.on('error', (error) => {
//       console.error('Socket error from server:', error);
//       const errorMessage = error.message || 'An error occurred with the chat connection';
//       setSocketError(errorMessage);
//       toast.error(errorMessage);
//     });

//     // Cleanup function
//     return () => {
//       console.log('Disconnecting socket...');
//       if (socketRef.current) {
//         // Remove all listeners before disconnecting to prevent memory leaks
//         socketRef.current.off('connect');
//         socketRef.current.off('connect_error');
//         socketRef.current.off('message');
//         socketRef.current.off('error');
//         socketRef.current.disconnect();
//       }
//     };
//   }, [currentUserId, receiverId, dispatch, currentRoom?._id]); // Dependencies

//   // Scroll to bottom when messages update
//   useEffect(() => {
//     // Use a small delay to ensure DOM updates before scrolling
//     const timer = setTimeout(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, 100); // Adjust delay if needed

//     return () => clearTimeout(timer); // Clean up the timer
//   }, [messages]); // Depend on the messages array

//   // Handle message sending
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     const trimmedMessage = message.trim();

//     if (!trimmedMessage) return;
//     if (!isConnected) {
//       toast.error('Not connected to chat server. Please try again.');
//       return;
//     }
//     if (!currentRoom?._id) {
//       toast.error('Chat room not initialized. Please try again.');
//       return;
//     }

//     const messageData = {
//       roomId: currentRoom._id,
//       senderId: currentUserId, // Send senderId as a string
//       receiverId, // Send receiverId as a string
//       message: trimmedMessage,
//       // Include timestamp and read status if your backend expects them,
//       // or if you want to optimistically update the UI before server confirmation.
//       timestamp: new Date().toISOString(),
//       read: false, // Assuming new messages are initially unread
//     };

//     // Optimistically add the message to the UI
//     // This assumes your addMessage reducer can handle a message object
//     // with senderId as a string, similar to how socket messages are received.
//     dispatch(addMessage(messageData));
//     setMessage(''); // Clear input immediately

//     try {
//       // Emit the message via socket
//       socketRef.current.emit('sendMessage', messageData);

//       // Optional: You might still want to call a backend API
//       // to persist the message if the socket emission is only for real-time delivery.
//       // However, if your server handles persistence upon receiving 'sendMessage',
//       // the dispatch(sendMessage) call might be redundant here if it's just for persistence.
//       // If dispatch(sendMessage) also emits via socket internally, calling emit directly might be redundant.
//       // Clarify your Redux action's role. If it's purely for persistence,
//       // consider if you need to wait for its result before emitting via socket.
//       // const result = await dispatch(sendMessage(messageData)).unwrap();
//       // if (!result.success) {
//       //   toast.error(result.message || 'Failed to send message via API');
//       //   // Handle potential UI rollback if API persistence fails after socket emission
//       // }

//     } catch (err) {
//       const errorMessage = err?.message || 'Error sending message via socket';
//       toast.error(errorMessage);
//       setSocketError(errorMessage);
//       // Consider removing the optimistically added message from UI if sending fails
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   // console.log(messages,"messages") // Keep or remove console logs as needed
//   // console.log( currentRoom,"currentRoom")

//   return (
//     <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
//       {/* Chat Header */}
//       <div className="p-4 border-b">
//         <h2 className="text-lg font-semibold">Chat</h2>
//         {socketError && (
//           <p className="text-sm text-red-500">{socketError}</p>
//         )}
//         {!isConnected && (
//           <p className="text-sm text-yellow-500">Connecting...</p>
//         )}
//         {error && ( // Assuming 'error' from Redux state
//           <p className="text-sm text-red-500">{error}</p>
//         )}
//       </div>

//       {/* Messages Area */}
//       <div className="flex-1 p-4 overflow-y-auto">
//         {messages && messages.length > 0 ? (
//           messages.map((msg, index) => {
//             // Determine sender ID: Check if sender is an object (populated) or just an ID string
//             // This is the key fix for handling messages from different sources (initial fetch vs socket)
//             const senderId = typeof msg.sender === 'object' && msg.sender !== null ? msg.sender._id : msg.sender;

//             const isCurrentUser = senderId === currentUserId;

//             return (
//               <div
//                 key={msg._id || index} // Use msg._id if available (from backend), fallback to index
//                 className={`mb-4 flex ${
//                   isCurrentUser ? 'justify-end' : 'justify-start' // Use flexbox for alignment
//                 }`}
//               >
//                 <div
//                   className={`inline-block p-2 rounded-lg max-w-[70%] ${ // Added max-w for message bubble width
//                     isCurrentUser
//                       ? 'bg-blue-500 text-white'
//                       : 'bg-gray-200 text-gray-800' // Added text color for receiver messages
//                   }`}
//                 >
//                   <p className="break-words">{msg.message}</p> {/* Removed max-w from here */}
//                   <span className={`text-xs opacity-75 block mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}> {/* Display time below message */}
//                     {/* Check if timestamp is a valid date before formatting */}
//                     {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
//                   </span>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <div className="flex items-center justify-center h-full text-gray-500">
//             No messages yet
//           </div>
//         )}
//         <div ref={messagesEndRef} /> {/* Element to scroll into view */}
//       </div>

//       {/* Message Input */}
//       <form onSubmit={handleSendMessage} className="p-4 border-t">
//         <div className="flex gap-2">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Type a message..."
//             className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
//             disabled={!isConnected || !currentRoom} // Disable input if not connected or room not ready
//           />
//           <button
//             type="submit"
//             className={`px-4 py-2 text-white rounded-lg focus:outline-none ${
//               isConnected && currentRoom && message.trim() // Also check if message is not empty
//                 ? 'bg-blue-500 hover:bg-blue-600'
//                 : 'bg-gray-400 cursor-not-allowed'
//             }`}
//             disabled={!isConnected || !currentRoom || !message.trim()} // Disable button if not connected, room not ready, or message is empty
//           >
//             Send
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ChatComponent;
