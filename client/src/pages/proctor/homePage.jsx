import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProctorBlocks } from '@/store/blockSlice/index';
import { getAllocatedStudent, getStudentForProctor } from "../../store/studentAllocation/allocateSlice";
import { FaUserGraduate, FaUserCheck, FaUserClock, FaHistory, FaTimes, FaBuilding } from 'react-icons/fa';
import FloorCard from '@/components/proctor/FloorCard';

export default function ProctorHomePage() {
  const dispatch = useDispatch();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState({
    blocks: true,
    students: true
  });
  const [error, setError] = useState(null);
  const { list: blocks } = useSelector((state) => state.block);
  const [stats, setStats] = useState({
    totalStudents: 0,
    registeredStudents: 0,
    unregisteredStudents: 0,
    recentlyAccessed: [],
    recentlyRegistered: [],
    occupancyPercentage: 0
  });
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching blocks...');
        await dispatch(fetchProctorBlocks()).unwrap();
        console.log('Blocks fetched successfully');
        setLoading(prev => ({ ...prev, blocks: false }));
      } catch (error) {
        console.error("Failed to fetch blocks:", error);
        setError(`Failed to fetch blocks: ${error.message}`);
        setLoading(prev => ({ ...prev, blocks: false }));
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (blocks.length === 0) {
        console.log('No blocks available, skipping student fetch');
        setLoading(prev => ({ ...prev, students: false }));
        return;
      }
      
      try {
        console.log('Fetching students for proctor...');
        const response = await dispatch(getStudentForProctor(user.id)).unwrap();
        console.log("Raw API Response:", response);
        
        if (response?.data) {
          const proctorStudents = response.data;
          setStudents(proctorStudents);
          
          // Calculate statistics
          const registered = proctorStudents.filter(s => s.status === true);
          const unregistered = proctorStudents.filter(s => s.status === false);
          
          // Get recently registered students (last 5)
          const recentlyReg = proctorStudents
            .filter(student => student.status === true && student.registrationDate)
            .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
            .slice(0, 5);
          
          // Get recently accessed students (last 5)
          const recentlyAcc = proctorStudents
            .filter(student => student.lastUpdated)
            .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
            .slice(0, 5);
  
          const totalStudents = proctorStudents.length;
          const registeredCount = registered.length;
          
          // Calculate occupancy percentage
          const occupancyPercentage = totalStudents > 0 
            ? Math.round((registeredCount / totalStudents) * 100) 
            : 0;
  
          setStats({
            totalStudents: totalStudents,
            registeredStudents: registeredCount,
            unregisteredStudents: unregistered.length,
            recentlyRegistered: recentlyReg,
            recentlyAccessed: recentlyAcc,
            occupancyPercentage: occupancyPercentage
          });
          
          console.log('Students and stats updated successfully:', {
            total: totalStudents,
            registered: registeredCount,
            unregistered: unregistered.length,
            occupancy: occupancyPercentage
          });
        }
        setLoading(prev => ({ ...prev, students: false }));
      } catch (error) {
        console.error("Failed to fetch students:", error);
        setError(`Failed to fetch students: ${error.message}`);
        setLoading(prev => ({ ...prev, students: false }));
      }
    };

    fetchStudents();
  }, [blocks, dispatch, user.id]);

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

  // Check if any loading state is true
  const isLoading = Object.values(loading).some(state => state === true);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600 mb-4">Loading dashboard...</div>
        <div className="text-sm text-gray-500">
          {loading.blocks && <div>Loading blocks...</div>}
          {loading.students && <div>Loading students...</div>}
        </div>
        {error && (
          <div className="text-red-500 mt-4 text-center max-w-md">
            Error: {error}
          </div>
        )}
      </div>
    );
  }

  console.log("Blocks:", blocks); // Debug log
  console.log("Students:", students); // Debug log

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
            Welcome, {user?.userName || 'Proctor'}
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
            value={stats.totalStudents || 0}
            color="text-blue-600"
          />
          <StatCard
            icon={FaUserCheck}
            title="Registered Students"
            value={stats.registeredStudents || 0}
            color="text-green-600"
          />
          <StatCard
            icon={FaUserClock}
            title="Unregistered Students"
            value={stats.unregisteredStudents || 0}
            color="text-orange-600"
          />
          <StatCard
            icon={FaHistory}
            title="Block Occupancy"
            value={`${stats.occupancyPercentage || 0}%`}
            color="text-purple-600"
          />
        </div>

        {/* Blocks and Floors Section */}
        {blocks.map((block) => (
          <div key={block._id} className="bg-white/90 backdrop-blur-sm rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <FaBuilding className="text-2xl text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Block {block.blockNum} ({block.location})
              </h2>
              <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${
                block.status === "Available" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}>
                {block.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...block.floors]
                .sort((a, b) => a.floorNumber - b.floorNumber)
                .map((floor) => (
                  <FloorCard key={floor.floorNumber} floor={floor} blockId={block._id}/>
                ))}
            </div>
          </div>
        ))}

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
