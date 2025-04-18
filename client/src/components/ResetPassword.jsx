import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../lib/axios';

function ResetPassword() {
  const navigate = useNavigate();
  const { id, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  console.log("User ID:", id, "Token:", token);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      const response = await axiosInstance.post(`/api/user/reset/${id}/${token}`, { password });

      if (response.data.success) {
        toast.success('Password changed successfully!');
        navigate("/auth/login");
      } else {
        toast.error(response.data.message || 'Error changing password. Please try again.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error changing password. Please try again.');
      console.error("Axios Error:", error);
    }
  };

  return (
    <div className="bg-gray-200 w-screen h-screen flex flex-col">
      <header className="bg-green-600 text-white text-center py-4">
        <h1 className="text-xl font-bold">Welcome Wolkite Dormitory Management</h1>
      </header>
      <div className="h-[90vh] flex justify-center items-center">
        <div className="flex flex-col items-center justify-center mx-auto w-[50%] bg-white p-4">
          <h2 className="text-sm md:text-2xl font-bold">Reset Password</h2>
          <form className="flex flex-col justify-center" onSubmit={onSubmitHandler}>
            <label htmlFor="password" className="p-2 text-sm md:text-xl">New Password</label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="*******"
              className="p-2 outline-green-400 border border-black"
              required
            />
            <label htmlFor="confirm-password" className="p-2 text-xl">Confirm Password</label>
            <input
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="*******"
              className="p-2 outline-green-400 border border-black"
              required
            />
            <button
              type="submit"
              className="p-2 bg-green-500 my-4 rounded-lg mx-auto font-semibold text-black text-sm md:text-lg hover:bg-green-600"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
      <footer className="bg-gray-800 text-white text-center py-4">
        <p className="text-sm">&copy; {new Date().getFullYear()} Wolkite Dormitory Management. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ResetPassword; 