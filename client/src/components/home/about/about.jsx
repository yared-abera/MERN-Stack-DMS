import { FaBuilding, FaMapMarkerAlt, FaBed, FaUsers } from "react-icons/fa";

export default function AboutUs() {
  return (
    <div className="bg-gray-100 py-12" id="about">
      <div className="max-w-6xl mx-auto px-6">
        {/* Dormitory Overview */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-700">About Our Dormitory</h2>
          <p className="text-gray-600 mt-2">Providing Comfortable and Secure Accommodation for Students</p>
        </div>

        {/* Dormitory Details */}
        <div className="grid md:grid-cols-2  lg:grid-cols-4 gap-8">
          <div className="bg-white shadow-lg p-6 rounded-xl text-center">
            <FaBuilding className="text-blue-700 text-4xl mx-auto" />
            <h3 className="text-lg font-semibold mt-4">Established</h3>
            <p className="text-gray-600">Founded in 2010 to serve university students</p>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-xl text-center">
            <FaMapMarkerAlt className="text-green-700 text-4xl mx-auto" />
            <h3 className="text-lg font-semibold mt-4">Location</h3>
            <p className="text-gray-600">Main Campus, Wolkite University, Ethiopia</p>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-xl text-center">
            <FaBed className="text-purple-700 text-4xl mx-auto" />
            <h3 className="text-lg font-semibold mt-4">Accommodation</h3>
            <p className="text-gray-600">Fully furnished rooms with modern facilities</p>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-xl text-center">
            <FaUsers className="text-red-700 text-4xl mx-auto" />
            <h3 className="text-lg font-semibold mt-4">Capacity</h3>
            <p className="text-gray-600">Over 2,000 students housed comfortably</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {/* Facilities */}
          <div className="bg-white shadow-lg p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-blue-700">🏠 Facilities</h3>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              <li>24/7 Electricity</li>
              <li>24/7 Security</li>
              <li>DSTV Room to Watch Football</li>
              <li>Recreational Areas</li>
            </ul>
          </div>

          {/* Services */}
          <div className="bg-white shadow-lg p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-purple-700">🛠️ Services</h3>
            <ul className="list-disc list-inside text-gray-600 mt-2">
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
