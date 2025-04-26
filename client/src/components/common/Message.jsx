import React, { useState } from 'react';
import { Trash2, Download, File, Image, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMessage } from '../../store/chat/chatSlice';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';

const Message = ({ message, currentUserId }) => {
  const dispatch = useDispatch();
  const { currentRoom } = useSelector((state) => state.chat);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Handle both object and string sender IDs
  const senderId = message.sender?._id || message.sender;
  const isOwnMessage = senderId === currentUserId || senderId?.toString() === currentUserId?.toString();
  const isPending = message.pending === true;

  const getFileUrl = (fileUrl) => {
    if (!fileUrl) return '';
    // If it's already a full URL, return as is
    if (fileUrl.startsWith('http')) return fileUrl;
    // If it starts with /uploads, append to API_URL
    if (fileUrl.startsWith('/uploads')) {
      return `${API_URL}${fileUrl}`;
    }
    // If it's just a filename, construct the full path
    return `${API_URL}/uploads/chat/${fileUrl}`;
  };

  const handleDelete = async () => {
    try {
      if (!currentRoom?._id) {
        toast.error('Cannot delete message: Chat room not found');
        return;
      }
      
      const result = await dispatch(deleteMessage({
        messageId: message._id,
        roomId: currentRoom._id
      })).unwrap();
      
      toast.success('Message deleted successfully');
    } catch (error) {
      toast.error(error || 'Failed to delete message');
    }
  };

  const handleFileDownload = async (fileUrl) => {

    console.log(fileUrl,'fileurl');
    
    try {
      setIsDownloading(true);
      const downloadUrl = getFileUrl(fileUrl);
      console.log('Attempting to download from:', downloadUrl);

      // Get the file with authorization header
      const token = localStorage.getItem('token');
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        console.error('Download failed:', {
          status: response.status,
          statusText: response.statusText,
          url: downloadUrl
        });
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }

      // Get the filename from the Content-Disposition header or fallback to message filename
      const contentDisposition = response.headers.get('content-disposition');
      let fileName = message.fileName;
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, '');
        }
      }
      if (!fileName) {
        fileName = fileUrl.split('/').pop() || 'download';
      }

      // Convert the response to blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      
      // Append to html link element page
      document.body.appendChild(link);
      
      // Start download
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Download completed successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error(`Failed to download file: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  
  
  };

  const formatMessageTime = (timestamp) => {
    try {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      return format(date, 'h:mm a');
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const renderFilePreview = () => {
    if (!message.fileUrl) return null;

    const isImage = message.fileType?.startsWith('image/');
    const fileUrl = getFileUrl(message.fileUrl);

    return (
      <div className="mt-2 border-t pt-2">
        <div className="flex flex-col gap-2">
          {isImage ? (
            <div className="relative">
              <img 
                src={fileUrl}
                alt={message.fileName || 'Image'} 
                className="max-w-full rounded-lg max-h-48 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'fallback-image-url';
                }}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded">
              <File className="h-5 w-5" />
              <span className="text-sm truncate">{message.fileName || 'File'}</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleFileDownload(message.fileUrl)}
            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Download</span>
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`relative max-w-[70%] ${
          isOwnMessage 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 dark:bg-gray-700'
        } rounded-lg p-3`}
      >
        {/* Message content */}
        <div className="break-words">
          {message.message && <p>{message.message}</p>}
          {renderFilePreview()}
        </div>

        {/* Timestamp and actions */}
        <div className={`flex items-center gap-2 mt-1 text-xs ${
          isOwnMessage ? 'text-white/80' : 'text-gray-500'
        }`}>
          <span>{formatMessageTime(message.timestamp)}</span>
          {isPending && (
            <span className="flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Sending...
            </span>
          )}
          {isOwnMessage && !isPending && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="p-1 hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;