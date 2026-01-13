import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect to Socket.io server
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      const newSocket = io(socketUrl, {
        withCredentials: true,
      });

      setSocket(newSocket);

      // Join user's room
      newSocket.emit('join', user._id);

      // Listen for hire notifications
      newSocket.on('hired', (data) => {
        const notification = {
          id: Date.now(),
          message: data.message,
          gigTitle: data.gigTitle,
          gigId: data.gigId,
          clientName: data.clientName,
          timestamp: new Date(),
        };

        setNotifications((prev) => [notification, ...prev]);
        
        // Show toast notification
        toast.success(
          `🎉 ${data.message}`,
          {
            duration: 5000,
            position: 'top-right',
          }
        );
      });

      // Connection events
      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      // Cleanup on unmount
      return () => {
        newSocket.close();
      };
    } else if (socket) {
      // Disconnect if user logs out
      socket.close();
      setSocket(null);
      setNotifications([]);
    }
  }, [isAuthenticated, user]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const value = {
    socket,
    notifications,
    clearNotifications,
    removeNotification,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};