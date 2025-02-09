import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

 function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-6 mt-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-lg font-semibold">&copy; {new Date().getFullYear()} Dormitory Management System,Designed by 2025 Computer Science Graduate Students 
        </p>
        <p className="text-gray-300 mt-2">Providing comfortable and secure accommodation for students.</p>   
        {/* Social Media Icons
        <div className="flex justify-center space-x-6 mt-4">
           
        </div> */}
      </div>
    </footer>
  );
}

export default Footer;