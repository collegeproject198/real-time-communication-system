import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);

// Configure CORS for Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite dev server default port
    methods: ["GET", "POST"]
  }
});

// Enable CORS for Express
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// Store connected users
const connectedUsers = new Map();

// Basic route for health check
app.get('/', (req, res) => {
  res.json({ message: 'Chat server is running!', connectedUsers: connectedUsers.size });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Handle user joining with username
  socket.on('join', (username) => {
    connectedUsers.set(socket.id, username);
    socket.username = username;
    
    // Broadcast to all clients that a user joined
    socket.broadcast.emit('user_joined', {
      username: username,
      message: `${username} joined the chat`,
      timestamp: new Date().toISOString()
    });
    
    // Send current online users to the newly connected client
    socket.emit('online_users', Array.from(connectedUsers.values()));
    
    // Broadcast updated user list to all clients
    io.emit('users_update', Array.from(connectedUsers.values()));
    
    console.log(`${username} joined the chat`);
  });
  
  // Handle incoming messages
  socket.on('send_message', (messageData) => {
    const message = {
      id: Date.now(),
      username: messageData.username,
      text: messageData.text,
      timestamp: new Date().toISOString()
    };
    
    // Broadcast message to all connected clients
    io.emit('receive_message', message);
    console.log('Message sent:', message);
  });
  
  // Handle typing indicators
  socket.on('typing', (data) => {
    socket.broadcast.emit('user_typing', {
      username: data.username,
      isTyping: data.isTyping
    });
  });
  
  // Handle user disconnect
  socket.on('disconnect', () => {
    if (socket.username) {
      connectedUsers.delete(socket.id);
      
      // Broadcast to all clients that a user left
      socket.broadcast.emit('user_left', {
        username: socket.username,
        message: `${socket.username} left the chat`,
        timestamp: new Date().toISOString()
      });
      
      // Broadcast updated user list to all clients
      io.emit('users_update', Array.from(connectedUsers.values()));
      
      console.log(`${socket.username} disconnected`);
    }
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
