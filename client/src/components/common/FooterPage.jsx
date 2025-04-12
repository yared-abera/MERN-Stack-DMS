import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import AboutUsAuthenticated from "./authenticatedFooter/authenticatedAbout";
import AuthenticatedContact from "./authenticatedFooter/authenticatedContactus";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

export default function FooterPage() {
  const [isLinkSelected, setIsLinkSelected] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);

  const handleLinkClick = (link) => {
    setSelectedLink(link);
    setIsLinkSelected(true);
  };

  const handleCloseDialog = () => {
    setIsLinkSelected(false);
  };

  return (
    <footer className="bg-gradient-to-r from-sky-900/50 to-blue-800 text-white py-12 mt-8 rounded-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Wolkite University</h3>
            <p className="text-gray-300">
              Providing quality education and comfortable accommodation for
              students through our comprehensive Dormitory Management System.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("about")}
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("contact")}
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <FaPhone className="text-blue-300" />
                <span className="text-gray-300">+251 911 123 456</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaEnvelope className="text-blue-300" />
                <span className="text-gray-300">info@wku.edu.et</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-blue-300" />
                <span className="text-gray-300">Wolkite, Ethiopia</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-300">
            © {new Date().getFullYear()} Wolkite University Dormitory Management
            System. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Designed and Developed by 2025 Computer Science Graduate Students
          </p>
        </div>
      </div>

      {/* Dialog for About and Contact */}
      <Dialog open={isLinkSelected} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedLink === "about" ? "About Us" : "Contact Us"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {selectedLink === "about" ? (
              <AboutUsAuthenticated />
            ) : (
              <AuthenticatedContact />
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
