import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Footer() {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-16">
          {/* About Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h3 
              className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400"
              variants={itemVariants}
            >
              About DMS
            </motion.h3>
            <motion.p 
              className="text-gray-300 leading-relaxed text-lg"
              variants={itemVariants}
            >
              The Dormitory Management System is designed to streamline and enhance the management of university dormitories, providing efficient solutions for both administrators and students.
            </motion.p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h3 
              className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400"
              variants={itemVariants}
            >
              Quick Links
            </motion.h3>
            <motion.ul 
              className="space-y-4"
              variants={itemVariants}
            >
              <li>
                <a href="#home" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-lg">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-lg">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-lg">
                  Contact
                </a>
              </li>
            </motion.ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h3 
              className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400"
              variants={itemVariants}
            >
              Connect With Us
            </motion.h3>
            <motion.div 
              className="flex space-x-8"
              variants={itemVariants}
            >
              <a 
                href="#" 
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
              >
                <FaFacebook size={32} />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
              >
                <FaTwitter size={32} />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
              >
                <FaInstagram size={32} />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
              >
                <FaLinkedin size={32} />
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div 
          className="mt-16 pt-8 border-t border-gray-700 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-gray-400 text-lg">
            © {currentYear} Dormitory Management System. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;