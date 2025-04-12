import { FaBuilding, FaMapMarkerAlt, FaBed, FaUsers } from "react-icons/fa";

export default function AboutUsAuthenticated() {
  return (
    <div className="bg-gray-100  dark:bg-gray-800  py-12" id="about">
       <div className="  dark:bg-gray-600 py-6  rounded-2xl max-w-6xl mx-auto px-6">
        {/* Dormitory Overview */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold dark:text-white text-blue-700 ">About Our Dormitory</h2>
          <p className="text-gray-600 mt-2 dark:text-white">Providing Comfortable and Secure Accommodation for Students</p>
        </div>

        {/* Dormitory Details */}
        <div className=" grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-gradient-to-r from-gray-900 via-cyan-700 to-blue-900

           shadow-lg p-6 rounded-xl text-center">
            <FaBuilding className="text-blue-700 dark:text-white text-4xl mx-auto" />
            <h3 className="text-lg dark:text-white font-semibold mt-4">Established</h3>
            <p className="text-gray-600 dark:text-white">Founded in 2010 to serve university students</p>
          </div>

          <div className="bg-white dark:bg-gradient-to-r from-gray-900 via-cyan-700 to-blue-900 shadow-lg p-6 rounded-xl text-center">
            <FaMapMarkerAlt className="text-green-700 dark:text-white  text-4xl mx-auto" />
            <h3 className="text-lg font-semibold mt-4 dark:text-white">Location</h3>
            <p className="text-gray-600 dark:text-white">Main Campus, Wolkite University, Ethiopia</p>
          </div>

          <div className="bg-white dark:bg-gradient-to-r from-gray-900 via-cyan-700 to-blue-900  shadow-lg p-6 rounded-xl text-center">
            <FaBed className="text-purple-700 dark:text-white text-4xl mx-auto" />
            <h3 className="text-lg font-semibold mt-4 dark:text-white">Accommodation</h3>
            <p className="text-gray-600 dark:text-white">Fully furnished rooms with modern facilities</p>
          </div>
 
          <div className="bg-#2c46e4 dark:bg-gradient-to-r from-gray-900 via-cyan-700 to-blue-900  shadow-lg p-6 rounded-xl text-center">
            <FaUsers className="text-red-700 dark:text-white text-4xl mx-auto" />
            <h3 className="text-lg dark:text-white font-semibold mt-4">Capacity</h3>
            <p className="text-gray-600 dark:text-white">Over 2,000 students housed comfortably</p>
          </div>
        </div>
         

        {/* Additional Info */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {/* Facilities */}
          <div className="bg-white dark:bg-gradient-to-r from-gray-900 via-cyan-700 to-blue-900  shadow-lg p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-blue-700 dark:text-white">🏠 Facilities</h3>
            <ul className="dark:text-white list-disc list-inside text-gray-600 mt-2">
              <li>24/7 Electricity</li>
              <li>24/7 Security</li>
              <li>DSTV Room to Watch Football</li>
              <li>Recreational Areas</li>
            </ul>
          </div>

          {/* Services */}
          <div className="bg-white dark:bg-gradient-to-r from-gray-900 via-cyan-700 to-blue-900 shadow-lg p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-purple-700  dark:text-white">🛠️ Services</h3>
            <ul className=" dark:text-white list-disc list-inside text-gray-600 mt-2">
            <li>Daily Cleaning</li>
              <li>Maintenance Support</li>
              <li>Health & Wellness Support</li>
              <li>Student Counseling</li>
              <li>Emergency Assistance</li>
               
            </ul>
          </div>
        </div>
      </div>
    </div>
    
  );
}
