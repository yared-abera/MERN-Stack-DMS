import { motion, AnimatePresence } from 'framer-motion';
import { FaBuilding, FaMapMarkerAlt, FaBed, FaUsers, FaTimes } from "react-icons/fa";
import { useState, useEffect } from 'react';

function AboutUs() {
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Close dialog when pressing Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMapOpen(false);
      }
    };

    if (isMapOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Restore scrolling when modal is closed
      document.body.style.overflow = 'auto';
    };
  }, [isMapOpen]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 py-12" id="about">
      <div className="max-w-5xl mx-auto px-4">
        {/* Dormitory Overview */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-300 dark:to-indigo-300 mb-4">
            About Our Dormitory
          </h2>
          <p className="text-gray-600 mt-2 text-base dark:text-gray-300 max-w-xl mx-auto">
            Providing comfortable and secure accommodation for students at Wolkite University
          </p>
        </motion.div>

        {/* Dormitory Details */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            className="bg-white dark:bg-gradient-to-r from-gray-900 via-cyan-700 to-blue-900 shadow-lg p-6 rounded-xl text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
            variants={itemVariants}
          >
            <div className="bg-blue-100 dark:bg-blue-900 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBuilding className="text-blue-600 dark:text-white text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mt-3 dark:text-white mb-2">Established</h3>
            <p className="text-gray-600 dark:text-gray-200 text-sm">Founded in 2010 to serve university students</p>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gradient-to-r from-gray-900 via-cyan-700 to-blue-900 shadow-lg p-6 rounded-xl text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl cursor-pointer"
            variants={itemVariants}
            onClick={() => setIsMapOpen(true)}
          >
            <div className="bg-green-100 dark:bg-green-900 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMapMarkerAlt className="text-green-600 dark:text-white text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mt-3 dark:text-white mb-2">Location</h3>
            <p className="text-gray-600 dark:text-gray-200 text-sm">Main Campus, Wolkite University, Ethiopia</p>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gradient-to-r from-gray-900 via-cyan-700 to-blue-900 shadow-lg p-6 rounded-xl text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
            variants={itemVariants}
          >
            <div className="bg-purple-100 dark:bg-purple-900 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBed className="text-purple-600 dark:text-white text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mt-3 dark:text-white mb-2">Accommodation</h3>
            <p className="text-gray-600 dark:text-gray-200 text-sm">Fully furnished rooms with modern facilities</p>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gradient-to-r from-gray-900 via-cyan-700 to-blue-900 shadow-lg p-6 rounded-xl text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
            variants={itemVariants}
          >
            <div className="bg-red-100 dark:bg-red-900 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-red-600 dark:text-white text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mt-3 dark:text-white mb-2">Capacity</h3>
            <p className="text-gray-600 dark:text-gray-200 text-sm">Over 2,000 students housed comfortably</p>
          </motion.div>
        </motion.div>

        {/* Additional Info */}
        <motion.div 
          className="mt-12 grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Facilities */}
          <div className="bg-white dark:bg-gradient-to-r from-gray-900 via-cyan-700 to-blue-900 shadow-lg p-6 rounded-xl hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-300 mb-4">🏠 Facilities</h3>
            <ul className="dark:text-white space-y-3 text-gray-600 text-sm">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                24/7 Electricity
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                24/7 Security
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                DSTV Room to Watch Football
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Recreational Areas
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="bg-white dark:bg-gradient-to-r from-gray-900 via-cyan-700 to-blue-900 shadow-lg p-6 rounded-xl hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-purple-600 dark:text-purple-300 mb-4">🛠️ Services</h3>
            <ul className="dark:text-white space-y-3 text-gray-600 text-sm">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Daily Cleaning
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Maintenance Support
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Health & Wellness Support
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Student Counseling
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Emergency Assistance
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Map Modal */}
      <AnimatePresence>
        {isMapOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            onClick={() => setIsMapOpen(false)}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden"
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Location</h3>
                <button
                  onClick={() => setIsMapOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none"
                  aria-label="Close"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.827996366374!2d37.8018345!3d8.2141453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b5c3c1c1c1c1c%3A0x1c1c1c1c1c1c1c1c!2sWolkite%20University!5e0!3m2!1sen!2set!4v1645000000000!5m2!1sen!2set"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AboutUs;
