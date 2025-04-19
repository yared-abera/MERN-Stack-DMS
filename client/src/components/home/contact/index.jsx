import { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from 'framer-motion';

function Contact() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      'service_gy2dh2l',
      'template_6hdvxdj',
      form.current,
      'sMLeluawfkDC9HU1u'
    )
    .then(() => {
      alert('Message sent successfully!');
      e.target.reset();
    }, (error) => {
      alert('Failed to send message. Please try again.');
    });
  };

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

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 py-10" id="contact">
      <div className="max-w-5xl mx-auto px-4">
        {/* Contact Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-300 dark:to-indigo-300 mb-3">
            Contact Us
          </h2>
          <p className="text-gray-600 mt-2 text-base dark:text-gray-300 max-w-xl mx-auto">
            Get in touch with us for any inquiries or support regarding the dormitory management system.
          </p>
        </motion.div>

        {/* Contact Details */}
        <motion.div 
          className="grid md:grid-cols-3 gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            className="bg-white dark:bg-gradient-to-r from-gray-900 via-cyan-700 to-blue-900 shadow-lg p-4 rounded-xl text-center transform hover:scale-105 transition-transform duration-300"
            variants={itemVariants}
          >
            <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaPhone className="text-green-600 dark:text-white text-2xl" />
            </div>
            <h3 className="text-lg font-semibold mt-2 dark:text-white mb-1">Phone</h3>
            <p className="text-gray-600 dark:text-gray-200 text-sm">+251 000 111 222</p>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gradient-to-r from-gray-900 via-cyan-700 to-blue-900 shadow-lg p-4 rounded-xl text-center transform hover:scale-105 transition-transform duration-300"
            variants={itemVariants}
          >
            <div className="bg-red-100 dark:bg-red-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaEnvelope className="text-red-600 dark:text-white text-2xl" />
            </div>
            <h3 className="text-lg font-semibold mt-2 dark:text-white mb-1">Email</h3>
            <p className="text-gray-600 dark:text-gray-200 text-sm">abdlkerimshemsu0909@gmail.com</p>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gradient-to-r from-gray-900 via-cyan-700 to-blue-900 shadow-lg p-4 rounded-xl text-center transform hover:scale-105 transition-transform duration-300"
            variants={itemVariants}
          >
            <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaMapMarkerAlt className="text-blue-600 dark:text-white text-2xl" />
            </div>
            <h3 className="text-lg font-semibold mt-2 dark:text-white mb-1">Location</h3>
            <p className="text-gray-600 dark:text-gray-200 text-sm">Wolkite University, Ethiopia</p>
          </motion.div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
            <h3 className="text-xl font-semibold text-white text-center">Send Us a Message</h3>
          </div>
          
          <form ref={form} onSubmit={sendEmail} className="p-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                <input
                  type="text"
                  name="user_name"
                  placeholder="Enter Your Name"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Email</label>
                <input
                  type="email"
                  name="user_email"
                  placeholder="Enter Your Email"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea
                name="user_message"
                placeholder="Enter Your Message"
                rows="3"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                required
              ></textarea>
            </div>
            
            <div className="text-center">
              <button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 text-sm font-medium"
              >
                Send Message
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Contact;