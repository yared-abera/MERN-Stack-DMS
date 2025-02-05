import { FaUniversity, FaMapMarkerAlt, FaChalkboardTeacher, FaUsers } from "react-icons/fa";

export default function AboutUs() {
  return (
    <div className="bg-gray-100 py-12" id="about">
      <div className="max-w-6xl mx-auto px-6">
        {/* University Overview */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-700">About Wolkite University</h2>
          <p className="text-gray-600 mt-2">We Strive for Wisdom!</p>
        </div>

        {/* University Details */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white shadow-lg p-6 rounded-xl text-center">
            <FaUniversity className="text-blue-700 text-4xl mx-auto" />
            <h3 className="text-lg font-semibold mt-4">Established</h3>
            <p className="text-gray-600">Foundation laid in 2001 E.C by H.E. Meles Zenawi</p>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-xl text-center">
            <FaMapMarkerAlt className="text-green-700 text-4xl mx-auto" />
            <h3 className="text-lg font-semibold mt-4">Location</h3>
            <p className="text-gray-600">SNNPR, Guraghe Zone, 170 km SW of Addis Ababa</p>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-xl text-center">
            <FaChalkboardTeacher className="text-purple-700 text-4xl mx-auto" />
            <h3 className="text-lg font-semibold mt-4">Academic Programs</h3>
            <p className="text-gray-600">7 Colleges, 1 School, 46 UG & 3 PG Programs</p>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-xl text-center">
            <FaUsers className="text-red-700 text-4xl mx-auto" />
            <h3 className="text-lg font-semibold mt-4">Students</h3>
            <p className="text-gray-600">11,049 Regular, 2,834 in other programs</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {/* Campuses */}
          <div className="bg-white shadow-lg p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-blue-700">📍 Campuses</h3>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              <li>Gubreye Campus (Main Campus)</li>
              <li>Wolkite Campus</li>
              <li>Butajira Campus</li>
            </ul>
          </div>

          {/* Staff Details */}
          <div className="bg-white shadow-lg p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-purple-700">👨‍🏫 Staff</h3>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              <li>1,071 Academic Staff</li>
              <li>32 Full-time Expatriate Staff</li>
              <li>1,031 Administrative Staff</li>
              <li>1,307 Support Staff</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
