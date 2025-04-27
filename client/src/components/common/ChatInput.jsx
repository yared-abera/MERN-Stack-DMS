import React, { useState, useRef, useContext } from 'react';
import { Paperclip, Send, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, addMessage, removeMessage } from '../../store/chat/chatSlice';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { SocketContext } from '../../context/SocketContext';

const ChatInput = ({ receiverId }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const { currentRoom } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const socket = useContext(SocketContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if ((!message.trim() && !selectedFile) || isSending) return;
    if (!currentRoom?._id) {
      toast.error('Chat room not found');
      return;
    }

    if (!user?.id) {
      toast.error('User ID not found. Please try logging in again.');
      return;
    }

    setIsSending(true);

    try {
      const formData = new FormData();
      formData.append('roomId', currentRoom._id);
      formData.append('senderId', user.id.toString());
      formData.append('receiverId', receiverId);
      
      const hasText = message.trim().length > 0;
      if (hasText) {
        formData.append('text', message.trim());
      }
      
      const hasFile = selectedFile !== null;
      if (hasFile) {
        formData.append('file', selectedFile);
      }

      // Create temporary message for optimistic update
      const tempMessage = {
        _id: `temp-${Date.now()}`,
        sender: {
          _id: user.id,
          Fname: user.Fname,
          Lname: user.Lname,
          userName: user.userName
        },
        receiver: {
          _id: receiverId
        },
        message: hasText ? message.trim() : '',
        timestamp: new Date().toISOString(),
        pending: true
      };

      // Add file info to temporary message if there's a file
      if (hasFile) {
        tempMessage.fileName = selectedFile.name;
        tempMessage.fileType = selectedFile.type;
        tempMessage.isFile = true;
      }

      // Add message to UI immediately
      dispatch(addMessage(tempMessage));

      // Clear input fields
      setMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Send message to server
      const result = await dispatch(sendMessage(formData)).unwrap();
      
      if (result.success) {
        // Remove temporary message
        dispatch(removeMessage(tempMessage._id));

        // Add the real message from the server
        dispatch(addMessage(result.data));

        // Emit socket event with the server-generated message
        if (socket?.connected) {
          socket.emit('sendMessage', {
            roomId: currentRoom._id,
            senderId: user.id,
            receiverId: receiverId,
            message: result.data.message,
            _id: result.data._id,
            timestamp: result.data.timestamp,
            fileUrl: result.data.fileUrl,
            fileName: result.data.fileName,
            fileType: result.data.fileType,
            sender: result.data.sender,
            receiver: result.data.receiver
          });
        }
      } else {
        toast.error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Send message error:', error);
      toast.error(error?.message || 'Error sending message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        e.target.value = '';
        return;
      }

      setSelectedFile(file);
      toast.success('File selected: ' + file.name);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('File removed');
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border-t">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* File attachment button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={triggerFileInput}
        className="hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Attach file (max 10MB)"
      >
        <Paperclip className="h-5 w-5" />
      </Button>

      {/* Message input */}
      <div className="flex-1 relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={selectedFile ? `File selected: ${selectedFile.name}` : "Type a message..."}
          className="w-full p-2 rounded-md border dark:bg-gray-800 dark:border-gray-700"
        />
        
        {/* Selected file indicator */}
        {selectedFile && (
          <div className="absolute -top-6 left-0 right-0 bg-gray-100 dark:bg-gray-800 p-1 rounded-t-md flex items-center justify-between">
            <span className="text-xs truncate">{selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)}MB)</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="p-0 hover:bg-transparent"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Send button */}
      <Button
        type="submit"
        variant="primary"
        size="icon"
        disabled={!message.trim() && !selectedFile}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default ChatInput; 