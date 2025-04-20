require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require('http');
const SocketService = require('./services/socketService');
const auth_route = require("./router/auth-router/auth-router");
const block_route = require("./router/blockRouter/index");
const dorm_route = require("./router/dormRouter/index");
const student_Route = require('./router/student/studentRoute');
const user_Route = require('./router/user/user_Router');
const maintenance_Route = require('./router/maintenanceRouter/index');
const message_Route = require('./router/messageRoutes');

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
const server = http.createServer(app);

// Initialize Socket.io
const socketService = new SocketService(server);

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
app.use('/api/messages/', message_Route);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});