import { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import './App.css'

const socket = io('http://localhost:3001')

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [username, setUsername] = useState('')
  const [hasJoined, setHasJoined] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Connection status
    const handleConnect = () => setIsConnected(true)
    const handleDisconnect = () => setIsConnected(false)

    // Message handling
    const handleReceiveMessage = (messageData) => {
      setMessages(prev => [...prev, { ...messageData, type: 'message' }])
    }

    const handleUserJoined = (data) => {
      setMessages(prev => [...prev, { ...data, type: 'system' }])
    }

    const handleUserLeft = (data) => {
      setMessages(prev => [...prev, { ...data, type: 'system' }])
    }

    const handleUsersUpdate = (users) => {
      setOnlineUsers(users)
    }

    const handleUserTyping = (data) => {
      if (data.isTyping) {
        setTypingUsers(prev => [...prev.filter(user => user !== data.username), data.username])
      } else {
        setTypingUsers(prev => prev.filter(user => user !== data.username))
      }
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('receive_message', handleReceiveMessage)
    socket.on('user_joined', handleUserJoined)
    socket.on('user_left', handleUserLeft)
    socket.on('users_update', handleUsersUpdate)
    socket.on('user_typing', handleUserTyping)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('receive_message', handleReceiveMessage)
      socket.off('user_joined', handleUserJoined)
      socket.off('user_left', handleUserLeft)
      socket.off('users_update', handleUsersUpdate)
      socket.off('user_typing', handleUserTyping)
    }
  }, [])

  const handleJoinChat = (e) => {
    e.preventDefault()
    if (username.trim()) {
      socket.emit('join', username.trim())
      setHasJoined(true)
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim()) {
      socket.emit('send_message', {
        username: username,
        text: message.trim()
      })
      setMessage('')
      
      // Clear typing indicator
      socket.emit('typing', { username: username, isTyping: false })
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }

  const handleTyping = (e) => {
    setMessage(e.target.value)
    
    // Send typing indicator
    socket.emit('typing', { username: username, isTyping: true })
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { username: username, isTyping: false })
    }, 1000)
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: 'numeric', 
      minute: '2-digit' 
    })
  }

  if (!hasJoined) {
    return (
      <div className="app">
        <div className="join-container">
          <h1>Real-Time Chat</h1>
          <form onSubmit={handleJoinChat} className="join-form">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="username-input"
              maxLength={20}
            />
            <button type="submit" disabled={!username.trim()}>
              Join Chat
            </button>
          </form>
          <div className="connection-status">
            Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <h2>Real-Time Chat</h2>
          <div className="connection-status">
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </div>
        </div>
        
        <div className="chat-main">
          <div className="messages-section">
            <div className="messages-container">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`message ${msg.type === 'system' ? 'system-message' : 
                    msg.username === username ? 'own-message' : 'other-message'}`}
                >
                  {msg.type === 'message' && (
                    <>
                      <div className="message-header">
                        <span className="message-username">{msg.username}</span>
                        <span className="message-time">{formatTime(msg.timestamp)}</span>
                      </div>
                      <div className="message-text">{msg.text}</div>
                    </>
                  )}
                  {msg.type === 'system' && (
                    <div className="system-text">
                      {msg.message} <span className="system-time">at {formatTime(msg.timestamp)}</span>
                    </div>
                  )}
                </div>
              ))}
              
              {typingUsers.length > 0 && (
                <div className="typing-indicator">
                  <em>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</em>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="message-input-form">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={handleTyping}
                className="message-input"
              />
              <button type="submit" disabled={!message.trim()}>
                Send
              </button>
            </form>
          </div>
          
          <div className="users-sidebar">
            <h3>Online Users ({onlineUsers.length})</h3>
            <div className="users-list">
              {onlineUsers.map((user, index) => (
                <div key={index} className={`user ${user === username ? 'current-user' : ''}`}>
                  <span className="user-indicator">🟢</span>
                  {user} {user === username && '(You)'}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
