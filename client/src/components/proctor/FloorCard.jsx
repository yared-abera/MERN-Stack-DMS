import React from 'react';
import { FaBed, FaDoorOpen, FaUsers, FaCheckCircle, FaUserGraduate, FaUserClock } from 'react-icons/fa';

const FloorCard = ({ floor }) => {
  const availabilityColor = floor.floorStatus === "Available" ? "text-green-600" : "text-red-600";
  const availabilityBg = floor.floorStatus === "Available" ? "bg-green-100" : "bg-red-100";

  // Calculate student-related statistics
  const totalStudentsAllocated = floor.dorms?.reduce((sum, dorm) => sum + (dorm.studentsAllocated || 0), 0) || 0;
  const totalCapacity = floor.floorCapacity || 0;
  const occupancyRate = totalCapacity > 0 ? Math.round((totalStudentsAllocated / totalCapacity) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-3 transform hover:scale-105 transition-transform duration-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-bold text-gray-800">Floor {floor.floorNumber}</h3>
        <span className={`${availabilityColor} ${availabilityBg} px-2 py-0.5 rounded-full text-xs font-medium`}>
          {floor.floorStatus}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        {/* Total Capacity */}
        <div className="flex items-center gap-1.5">
          <FaUsers className="text-blue-500 text-sm" />
          <div>
            <p className="text-xs text-gray-500">Capacity</p>
            <p className="font-semibold text-sm">{totalCapacity}</p>
          </div>
        </div>

        {/* Students Allocated */}
        <div className="flex items-center gap-1.5">
          <FaUserGraduate className="text-purple-500 text-sm" />
          <div>
            <p className="text-xs text-gray-500">Allocated</p>
            <p className="font-semibold text-sm">{totalStudentsAllocated}</p>
          </div>
        </div>

        {/* Available Beds */}
        <div className="flex items-center gap-1.5">
          <FaBed className="text-green-500 text-sm" />
          <div>
            <p className="text-xs text-gray-500">Available</p>
            <p className="font-semibold text-sm">{floor.totalAvailable || 0}</p>
          </div>
        </div>

        {/* Total Dorms */}
        <div className="flex items-center gap-1.5">
          <FaDoorOpen className="text-orange-500 text-sm" />
          <div>
            <p className="text-xs text-gray-500">Dorms</p>
            <p className="font-semibold text-sm">{floor.dorms?.length || 0}</p>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="flex items-center gap-1.5 col-span-2 mt-1">
          <FaCheckCircle className="text-blue-600 text-sm" />
          <div className="flex-grow">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">Occupancy</p>
              <p className="text-xs font-medium">{occupancyRate}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-0.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${occupancyRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Dorm Status Summary */}
        <div className="col-span-2 mt-1 pt-1 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Available: {floor.dorms?.filter(d => d.dormStatus === "Available").length || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Full: {floor.dorms?.filter(d => d.dormStatus === "Full").length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorCard; 