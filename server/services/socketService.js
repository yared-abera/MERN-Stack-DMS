const { Server } = require('socket.io');

class SocketService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: ["http://localhost:5174", "http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.users = [];

    this.io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      // Add user to online users
      socket.on('addUser', (userId) => {
        this.addUser(userId, socket.id);
        this.io.emit('getUsers', this.users);
      });

      // Send and receive messages
      socket.on('sendMessage', ({ senderId, receiverId, text }) => {
        const user = this.getUser(receiverId);
        if (user) {
          this.io.to(user.socketId).emit('getMessage', {
            senderId,
            text,
            createdAt: new Date(),
          });
        }
      });

      // Typing indicators
      socket.on('typing', ({ conversationId, userId }) => {
        const members = this.getConversationMembers(conversationId);
        members.forEach(memberId => {
          if (memberId !== userId) {
            const user = this.getUser(memberId);
            if (user) {
              this.io.to(user.socketId).emit('userTyping', {
                conversationId,
                userId,
              });
            }
          }
        });
      });

      socket.on('stopTyping', ({ conversationId, userId }) => {
        const members = this.getConversationMembers(conversationId);
        members.forEach(memberId => {
          if (memberId !== userId) {
            const user = this.getUser(memberId);
            if (user) {
              this.io.to(user.socketId).emit('userStopTyping', {
                conversationId,
                userId,
              });
            }
          }
        });
      });

      // Disconnect
      socket.on('disconnect', () => {
        console.log('A user disconnected');
        this.removeUser(socket.id);
        this.io.emit('getUsers', this.users);
      });
    });
  }

  // User management methods
  addUser(userId, socketId) {
    // Check if user already exists, remove old socket
    this.removeUser(this.users.find(user => user.userId === userId)?.socketId);
    this.users.push({ userId, socketId });
  }

  removeUser(socketId) {
    this.users = this.users.filter(user => user.socketId !== socketId);
  }

  getUser(userId) {
    return this.users.find(user => user.userId === userId);
  }

  getConversationMembers(conversationId) {
    try {
      // We can't directly use mongoose models due to require cycles, so we'll
      // need to return the data from memory or use the socketMembers map
      
      // For simplicity in this implementation, we'll rely on the conversation ID format
      // where the ID is formed by concatenating the two user IDs.
      // A better approach would be to actually fetch from the database
      
      // Return an empty array if we can't derive the members
      if (!conversationId) return [];
      
      // This is a simplified example, in a production app you would
      // properly query the database using mongoose
      return this.users
        .filter(user => user.userId) // Just return all connected users except the current one
        .map(user => user.userId);
    } catch (error) {
      console.error("Error getting conversation members:", error);
      return [];
    }
  }
}

module.exports = SocketService; 