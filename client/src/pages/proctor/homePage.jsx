import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProctorBlocks } from '@/store/blockSlice/index';
import { getAllocatedStudent } from "../../store/studentAllocation/allocateSlice";
import { FaUserGraduate, FaUserCheck, FaUserClock, FaHistory, FaTimes } from 'react-icons/fa';

export default function ProctorHomePage() {
  const dispatch = useDispatch();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { list: blocks } = useSelector((state) => state.block);
  const [stats, setStats] = useState({
    totalStudents: 0,
    registeredStudents: 0,
    unregisteredStudents: 0,
    recentlyAccessed: [],
    recentlyRegistered: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchProctorBlocks()).unwrap();
      } catch (error) {
        console.error("Failed to fetch blocks:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (blocks.length === 0) return;
      
      try {
        const response = await dispatch(getAllocatedStudent()).unwrap();
        if (response.data) {
          const proctorStudents = response.data.filter((student) =>
            blocks.some((block) => block.blockNum === student.blockNum)
          );
          
          setStudents(proctorStudents);
          
          // Calculate statistics
          const registered = proctorStudents.filter(s => s.status === 'Registered');
          const recentlyReg = registered
            .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
            .slice(0, 5);
          
          const recentlyAcc = proctorStudents
            .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
            .slice(0, 5);

          setStats({
            totalStudents: proctorStudents.length,
            registeredStudents: registered.length,
            unregisteredStudents: proctorStudents.length - registered.length,
            recentlyRegistered: recentlyReg,
            recentlyAccessed: recentlyAcc
          });
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [blocks, dispatch]);

  const handleRemoveFromList = (studentId, listType) => {
    setStats(prevStats => ({
      ...prevStats,
      [listType]: prevStats[listType].filter(student => student.userName !== studentId)
    }));
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${color} transform hover:scale-105 transition-transform duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <Icon className="text-4xl opacity-80" />
      </div>
    </div>
  );

  const StudentList = ({ title, students, icon: Icon, listType }) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="text-2xl text-blue-600" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="space-y-3">
        {students.map((student, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200">
            <div>
              <p className="font-medium">{`${student.Fname} ${student.Lname}`}</p>
              <p className="text-sm text-gray-500">{student.userName}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Block {student.blockNum}
              </span>
              <button
                onClick={() => handleRemoveFromList(student.userName, listType)}
                className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors duration-200"
                title="Remove from list"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        ))}
        {students.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No students in this list
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-8"
      style={{
        backgroundImage: "url('/assets/images/campus-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, Proctor
          </h1>
          <p className="text-gray-600 mt-2">
            Managing Block{blocks.length > 1 ? 's' : ''} {blocks.map(block => block.blockNum).join(', ')}
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FaUserGraduate}
            title="Total Students"
            value={stats.totalStudents}
            color="text-blue-600"
          />
          <StatCard
            icon={FaUserCheck}
            title="Registered Students"
            value={stats.registeredStudents}
            color="text-green-600"
          />
          <StatCard
            icon={FaUserClock}
            title="Unregistered Students"
            value={stats.unregisteredStudents}
            color="text-orange-600"
          />
          <StatCard
            icon={FaHistory}
            title="Block Occupancy"
            value={`${Math.round((stats.registeredStudents / stats.totalStudents) * 100)}%`}
            color="text-purple-600"
          />
        </div>

        {/* Recent Activities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StudentList
            title="Recently Registered Students"
            students={stats.recentlyRegistered}
            icon={FaUserCheck}
            listType="recentlyRegistered"
          />
          <StudentList
            title="Recently Accessed Students"
            students={stats.recentlyAccessed}
            icon={FaHistory}
            listType="recentlyAccessed"
          />
        </div>
      </div>
    </div>
  );
}
