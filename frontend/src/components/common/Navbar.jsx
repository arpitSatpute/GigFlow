import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { Bell, Briefcase, User, LogOut, Plus } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications } = useSocket();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">GigFlow</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Gigs
                </Link>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/create-gig"
                  className="flex items-center space-x-1 btn-primary"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post Gig</span>
                </Link>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <Bell className="w-6 h-6" />
                    {notifications.length > 0 && (
                      <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                            onClick={() => {
                              navigate(`/gig/${notif.gigId}`);
                              setShowNotifications(false);
                            }}
                          >
                            <p className="text-sm font-medium text-gray-900">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              From: {notif.clientName}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          No new notifications
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700 font-medium">
                      {user?.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;