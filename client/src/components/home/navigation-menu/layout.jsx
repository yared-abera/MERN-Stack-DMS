import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { FaHome, FaInfoCircle, FaPhone } from "react-icons/fa";
import { Moon, Sun, Menu, X, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../../store/common/ThemeSlice";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

function NavBar() {
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("home");
  const { scrollY } = useScroll();
  
  // Parallax effect for navbar background
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.8)"]
  );
  
  const darkBackgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(17, 24, 39, 0)", "rgba(17, 24, 39, 0.8)"]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Update active section based on scroll position
      const sections = ["home", "about", "contact"];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveItem(currentSection);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { icon: FaHome, label: "HOME", to: "home" },
    { icon: FaInfoCircle, label: "ABOUT", to: "about" },
    { icon: FaPhone, label: "CONTACT", to: "contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={{
        backgroundColor: theme === "dark" ? darkBackgroundColor : backgroundColor,
        backdropFilter: isScrolled ? "blur(10px)" : "none",
      }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with 3D effect */}
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 10 }}
            transition={{ duration: 0.3 }}
            style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
            className="flex-shrink-0"
          >
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 animate-gradient">
              WKU DMS
            </h1>
          </motion.div>

          {/* Desktop Navigation with 3D hover effects */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
          <Link 
                  to={item.to}
            smooth={true}
            duration={1000}
                  onClick={() => setActiveItem(item.to)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                    activeItem === item.to
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${activeItem === item.to ? "text-white" : ""}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                  
                  {/* Active indicator */}
                  {activeItem === item.to && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
          </Link>
              </motion.div>
            ))}
        </div>

          {/* Right side buttons with advanced effects */}
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 shadow-md"
          onClick={() => dispatch(toggleTheme())}
        >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={() => navigate("/auth/logIn")}
          >
              <LogIn size={16} />
              <span>LOGIN</span>
            </motion.button>

            {/* Mobile menu button with animation */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu with advanced animations */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                  className="block"
                >
                  <Link
                    to={item.to}
                    smooth={true}
                    duration={1000}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 ${
                      activeItem === item.to ? "bg-blue-50 dark:bg-blue-900/30" : ""
                    }`}
                    onClick={() => {
                      setActiveItem(item.to);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <item.icon className={`w-4 h-4 ${activeItem === item.to ? "text-blue-600 dark:text-blue-400" : ""}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </motion.div>
              ))}
              <motion.button
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-3 flex items-center justify-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate("/auth/logIn");
                }}
              >
                <LogIn size={16} />
                <span>LOGIN</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default NavBar;
