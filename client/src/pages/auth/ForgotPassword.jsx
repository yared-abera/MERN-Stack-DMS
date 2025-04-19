import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../lib/axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post('/api/user/forgot-password', { email });
      
      if (response.data.success) {
        if (response.data.message.includes("If the email exists")) {
          // Show dialog for non-existent email
          setDialogMessage("Email not found in our database. Please check your email address and try again.");
          setShowDialog(true);
        } else {
          // Show success message
          toast.success('Password reset link has been sent to your email.');
          setEmail('');
        }
      } else {
        setDialogMessage(response.data.message || 'Failed to send reset link.');
        setShowDialog(true);
      }
    } catch (error) {
      setDialogMessage('An error occurred. Please try again later.');
      setShowDialog(true);
      console.error('Forgot password error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col">
      <header className="bg-green-600 text-white text-center py-4">
        <h1 className="text-xl font-bold">Wolkite University DMS</h1>
      </header>
      
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
          <p className="text-gray-600 text-sm mb-6 text-center">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <a href="/auth/login" className="text-sm text-blue-600 hover:text-blue-800">
              Back to Login
            </a>
          </div>
        </div>
      </div>

      {/* Dialog for showing messages */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message</DialogTitle>
            <DialogDescription>
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowDialog(false)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              OK
            </button>
          </div>
        </DialogContent>
      </Dialog>
      
      <footer className="bg-gray-800 text-white text-center py-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Wolkite University DMS. All rights reserved.
        </p>
      </footer>
    </div>
  );
} 