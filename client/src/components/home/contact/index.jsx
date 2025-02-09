import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function Contact() {
  return (
    <div className="bg-gray-100 py-12" id="contact">
      <div className="max-w-6xl mx-auto px-6">
        {/* Contact Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-700">Contact Us</h2>
          <p className="text-gray-600 mt-2">Get in touch with us for any inquiries or support.</p>
        </div>

        {/* Contact Details */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white shadow-lg p-6 rounded-xl">
            <FaPhone className="text-green-700 text-4xl mx-auto" />
            <h3 className="text-lg font-semibold mt-4">Phone</h3>
            <p className="text-gray-600">+251 000 111 222</p>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-xl">
            <FaEnvelope className="text-red-700 text-4xl mx-auto" />
            <h3 className="text-lg font-semibold mt-4">Email</h3>
            <p className="text-gray-600">info@dormitory.com</p>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-xl">
            <FaMapMarkerAlt className="text-blue-700 text-4xl mx-auto" />
            <h3 className="text-lg font-semibold mt-4">Location</h3>
            <p className="text-gray-600">Wolkite University, Ethiopia</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mt-12 bg-white shadow-lg p-8 rounded-xl">
          <h3 className="text-2xl font-semibold text-blue-700 text-center mb-6">Send Us a Message</h3>
          <form className="space-y-6">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              className="w-full p-3 border border-gray-300 rounded-lg"
            ></textarea>
            <button className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
