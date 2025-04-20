import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiMessageSquare } from 'react-icons/fi';

const ChatButton = () => {
    const navigate = useNavigate();
    const chat = useSelector(state => state.chat || {});
    const unreadCounts = chat.unreadCounts || {};

    const totalUnreadCount = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate('/messages', { replace: false });
    };

    return (
        <button
            onClick={handleClick}
            type="button"
            className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            aria-label="Open Messages"
        >
            <FiMessageSquare className="w-6 h-6" />
            {totalUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                </span>
            )}
        </button>
    );
};

export default ChatButton; 