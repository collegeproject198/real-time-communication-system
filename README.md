# Real-Time Chat Application

A simple real-time communication system built with Node.js, Socket.IO, and React where multiple clients can connect and exchange messages instantly.

## Features

- **Real-time messaging**: Messages appear instantly for all connected users
- **User management**: See who's online and get notifications when users join/leave
- **Typing indicators**: See when other users are typing
- **Responsive design**: Works on both desktop and mobile devices
- **Clean UI**: Modern, intuitive interface with message timestamps

## Project Structure

```
CHATAPP/
├── backend/          # Node.js + Socket.IO server
│   ├── server.js     # Main server file
│   ├── package.json  # Backend dependencies
│   └── node_modules/ # Backend dependencies
└── frontend/         # React client application
    ├── src/
    │   ├── App.jsx   # Main chat component
    │   ├── App.css   # Chat styles
    │   └── ...
    ├── package.json  # Frontend dependencies
    └── node_modules/ # Frontend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation & Setup

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   The server will start on `http://localhost:3001`

2. **Start the Frontend (in a new terminal)**
   ```bash
   cd frontend
   npm run dev
   ```
   The React app will start on `http://localhost:5173`

3. **Open Multiple Browser Tabs**
   - Open `http://localhost:5173` in multiple browser tabs or different browsers
   - Enter different usernames in each tab
   - Start chatting in real-time!

## How to Use

1. **Join the Chat**: Enter your username and click "Join Chat"
2. **Send Messages**: Type your message and press Enter or click Send
3. **See Online Users**: Check the sidebar to see who's currently online
4. **Typing Indicators**: See when others are typing
5. **System Notifications**: Get notified when users join or leave

## Technical Details

### Backend (Node.js + Socket.IO)
- **Express.js**: Web server framework
- **Socket.IO**: Real-time bidirectional event-based communication
- **CORS**: Configured to allow frontend connections

### Frontend (React + Socket.IO Client)
- **React Hooks**: Modern functional components with state management
- **Socket.IO Client**: Real-time connection to the backend
- **Responsive CSS**: Mobile-friendly design

### Real-time Events
- `join`: User joins the chat
- `send_message`: Send a message to all users
- `receive_message`: Receive messages from other users
- `typing`: Send/receive typing indicators
- `user_joined`/`user_left`: User connection notifications
- `users_update`: Update online users list

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite dev server with hot reload
```

## Customization

You can easily customize:
- **Port numbers**: Change in `backend/server.js` and `frontend/src/App.jsx`
- **Styling**: Modify `frontend/src/App.css`
- **Features**: Add rooms, private messages, file sharing, etc.

## Browser Compatibility

Works in all modern browsers that support WebSocket connections:
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

1. **Connection Issues**: Make sure both backend (port 3001) and frontend (port 5173) are running
2. **CORS Errors**: Check that the backend CORS configuration matches your frontend URL
3. **WebSocket Errors**: Ensure no firewall is blocking WebSocket connections

Enjoy real-time chatting! 🚀
# real-time-communication-system
