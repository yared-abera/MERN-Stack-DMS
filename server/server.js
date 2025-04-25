require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const auth_route = require("./router/auth-router/auth-router");
const block_route = require("./router/blockRouter/index");
const dorm_route = require("./router/dormRouter/index");
const student_Route = require('./router/student/studentRoute');
const user_Route = require('./router/user/user_Router');
const maintenance_Route = require('./router/maintenanceRouter/index');
const recentuser_Route = require('./router/recentlySearchedUser/recentuser-router');
const passwordReset_Route = require('./router/passwordReset/passwordResetRoutes');
const feedBack_Route = require('./router/FeedBack-route/feedBack-rout');
const attendance_Route = require('./router/attendance-router/attendance-route');
const controle_Route = require('./router/controleRoute/control-Route');
const chatRoutes = require('./routes/chatRouter/chatRoutes')
const chat_Routes = require('./routes/chatRouter/chatRoutes')
const http = require('http');
const socketIo = require('socket.io');

//"mongodb://localhost:27017/DMS"
mongoose
  .connect("mongodb://localhost:27017/", 
    {serverSelectionTimeoutMS: 30000}
  )
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
});

const app = express();

app.use(cookieParser());
app.use(express.json());

const PORT = process.env.PORT || 9000;

app.use(cors({
  origin: ["http://localhost:5174", "http://localhost:5173"],
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  allowedHeaders: [
    "content-type",
    "Authorization",
    "Cache-Control",
    "Expires",
    "Pragma",
  ],
  credentials: true,
}));

// Routes
app.use("/api/auth/", auth_route);
app.use("/api/block/", block_route);
app.use("/api/dorm/", dorm_route);
app.use('/api/student/', student_Route);
app.use('/api/user', user_Route);
app.use('/api/maintainanceIssue/', maintenance_Route);
app.use('/api/recentuser', recentuser_Route);
app.use('/api/user', passwordReset_Route);
app.use('/api/feedBack', feedBack_Route); 
app.use('/api/attendance', attendance_Route);
app.use('/api/control', controle_Route);
app.use('/api/Groupchat', chatRoutes);
app.use('/api/chat', chat_Routes);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5174", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["content-type"]
  },
  transports: ['websocket', 'polling'],
  path: '/socket.io'
});

// Track online users
const onlineUsers = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Add user to online users when they connect
  socket.on('connect', () => {
    if (socket.handshake.auth?.userId) {
      onlineUsers.set(socket.handshake.auth.userId, socket.id);
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    }
  });

  socket.on('join', ({ userId, receiverId }) => {
    const room = [userId, receiverId].sort().join('-');
    socket.join(room);
    console.log(`User ${userId} joined room ${room}`);
  });

  socket.on('sendMessage', (messageData) => {
    const room = [messageData.senderId, messageData.receiverId].sort().join('-');
    console.log(`Sending message to room ${room}:`, messageData);
    io.to(room).emit('message', messageData);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on('disconnect', () => {
    // Remove user from online users when they disconnect
    if (socket.handshake.auth?.userId) {
      onlineUsers.delete(socket.handshake.auth.userId);
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    }
    console.log('Client disconnected:', socket.id);
  });
});

// Change this to use the HTTP server instead of the Express app
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Update server export
module.exports = { app, server };