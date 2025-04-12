import { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function AuthenticatedContact() {
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

  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-12" id="contact">
      <div className="dark:bg-gray-600 max-w-6xl mx-auto px-6 py-12 rounded-2xl">
        {/* Contact Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-700 dark:text-white">Contact Us</h2>
          <p className="text-gray-600 mt-2 dark:text-white">Get in touch with us for any inquiries or support.</p>
        </div>

        {/* Contact Details - Your original content preserved */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white dark:bg-gradient-to-r from-gray-900 via-cyan-700 to-blue-900 shadow-lg p-6 rounded-xl">
            <FaPhone className="text-green-700 dark:text-white text-4xl mx-auto" />
            <h3 className="text-lg font-semibold mt-4">Phone</h3>
            <p className="text-gray-600 dark:text-white">+251 000 111 222</p>
          </div>

          <div className="bg-white dark:bg-gradient-to-r from-gray-900 via-cyan-700 to-blue-900 shadow-lg p-6 rounded-xl">
            <FaEnvelope className="text-red-700 dark:text-white text-4xl mx-auto" />
            <h3 className="text-lg font-semibold mt-4 dark:text-white">Email</h3>
            <p className="text-gray-600 dark:text-white">abdlkerimshemsu0909@gmail.com</p>
          </div>

          <div className="bg-white dark:bg-gradient-to-r from-gray-900 via-cyan-700 to-blue-900 shadow-lg p-6 rounded-xl">
            <FaMapMarkerAlt className="text-blue-700 dark:text-white text-4xl mx-auto" />
            <h3 className="text-lg dark:text-white font-semibold mt-4">Location</h3>
            <p className="text-gray-600 dark:text-white">Wolkite University, Ethiopia</p>
          </div>
        </div>

        {/* Contact Form with EmailJS integration */}
        <div className="mt-12 bg-white dark:bg-gray-300 shadow-lg px-6 py-8 rounded-xl">
          <h3 className="text-2xl font-semibold text-blue-700 text-center mb-6">Send Us a Message</h3>
          <form ref={form} onSubmit={sendEmail} className="space-y-6">
            <label>Your Name:</label>
            <input
              type="text"
              name="user_name"
              placeholder="Enter Your Name"
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            <label>Your Email:</label>
            <input
              type="email"
              name="user_email"
              placeholder="Enter Your Email"
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            <label>Message:</label>
            <textarea
              name="user_message"
              placeholder="Enter Your Message"
              rows="5"
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            ></textarea>
            <button 
              type="submit" 
              className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthenticatedContact;