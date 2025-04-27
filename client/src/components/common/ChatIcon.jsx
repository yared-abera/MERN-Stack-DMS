import React, { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUnreadCount } from '../../store/chat/chatSlice';

const ChatIcon = ({ userRole }) => {
  const dispatch = useDispatch();
  const { unreadCount } = useSelector(state => state.chat);
  const { user } = useSelector(state => state.auth);

  // Get chat route based on user role
  const getChatRoute = () => {
    switch (userRole) {
      case 'admin':
        return '/admin/chat';
      case 'proctorManager':
        return '/proctor-manager/chat';
      case 'proctor':
        return '/proctor/chat';
      case 'studentDean':
        return '/dean/chat';
      default:
        return '/chat';
    }
  };

  // Fetch unread count on mount and periodically
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user?.id) {
        console.log('Fetching unread count for user:', user.id);
        try {
          const result = await dispatch(getUnreadCount(user.id)).unwrap();
          console.log('Unread count result:', result);
        } catch (error) {
          console.error('Error fetching unread count:', error);
        }
      } else {
        console.warn('No user ID available for fetching unread count');
      }
    };

    // Initial fetch
    fetchUnreadCount();

    // Set up periodic fetch
    const interval = setInterval(fetchUnreadCount, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch, user?.id]); // Added user?.id to dependencies

  
  return (
    <Link to={getChatRoute()} className="relative inline-block">
      <MessageCircle className="h-6 w-6"/>
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default ChatIcon; 