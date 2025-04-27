import {
  Card,
  CardContent,
  CardDescription, // CardDescription and CardFooter are imported but not used in the footer structure
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Import all image assets
import img from "../../assets/img/University_logo.png";
import img2 from "../../assets/img/gibi.jpg";
import img3 from "../../assets/img/gibi4.jpg";
import img4 from "../../assets/img/gibi6.jpg";
import img5 from "../../assets/img/stud.jpg";
import img6 from "../../assets/img/graugate.jpg";

// Import Lucid Icons for slideshow navigation and footer
import { ChevronLeft, ChevronRight, MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram, Users } from "lucide-react";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleStudent } from "@/store/studentAllocation/allocateSlice";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence

export default function StudentHome() {
  // Define the array of images for the slideshow
  const Images = [img2, img3, img4, img5, img6];
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [ThisStudent, setThisStudent] = useState("");

  // Effect to fetch student data on component mount or user change
  useEffect(() => {
    if (user?.id) { // Ensure user and id exist before dispatching
      const id = user.id;
      dispatch(getSingleStudent({ id })).then((data) => {
        if (data?.payload?.success) {
          setThisStudent(data?.payload?.data);
        }
      });
    }
  }, [user, dispatch]); // Depend on user and dispatch

  // Effect for automatic slideshow interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Images.length);
    }, 8000); // Change image every 8 seconds
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [Images.length]); // Depend on Images.length

  // Handler for next button
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % Images.length);
  };

  // Handler for previous button
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + Images.length) % Images.length);
  };

  // Framer Motion variants for image transition animations (fade effect)
  const imageVariants = {
    enter: { opacity: 0 }, // Image starts invisible
    center: { opacity: 1 }, // Image becomes fully visible
    exit: { opacity: 0 }, // Image fades out
  };

  return (
    // Main Container: Full width, min-height, dark gradient background, padding, centered items, hidden overflow
    <div className="mt-24 flex flex-col items-center p-6 w-full min-h-screen rounded-md  bg-gradient-to-br from-gray-400/35 to-gray-700   text-gray-100 overflow-auto"> {/* Changed overflow-hidden to overflow-auto to allow scrolling for the footer */}

      {/* Image Slideshow Container: Relative positioning for absolute children, responsive width, aspect ratio, styling */}
      <div className="relative w-[95%] max-w-4xl aspect-video rounded-xl shadow-2xl border-2 border-blue-500 overflow-hidden">

        {/* AnimatePresence: Enables exit animations for the image component */}
        <AnimatePresence initial={false} mode="wait"> {/* mode="wait" ensures one animation finishes before the next starts */}
          {/* Current Image: Absolute position to cover container, motion animation */}
          <motion.img
            key={currentIndex} // Key changes with index, triggering AnimatePresence
            src={Images[currentIndex]} // Current image source
            alt={`Slideshow image ${currentIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover" // Cover the container without repeating
            variants={imageVariants} // Apply defined animation variants
            initial="enter" // Start from 'enter' state
            animate="center" // Animate to 'center' state
            exit="exit" // Animate to 'exit' state when removed
            transition={{ duration: 0.8 }} // Animation duration
          />
        </AnimatePresence>

        {/* Header Section (Logo and Welcome Message): Positioned Absolutely on top of the image */}
        {/* Uses flex column to stack logo and text, centered horizontally */}
        <div className="absolute top-0 left-0 right-0 p-6 flex flex-col items-center z-20"> {/* Absolute positioning, padding, higher z-index */}
            {/* Logo Container: Added animation and subtle background for visibility on various images */}
            <motion.div
               initial={{ opacity: 0, y: -50 }} // Start hidden and above
               animate={{ opacity: 1, y: 0 }} // Slide down and fade in
               transition={{ duration: 0.5 }} // Animation duration
               className="mb-4 bg-black/20 rounded-lg p-2" // Margin bottom, semi-transparent background, padding, rounded corners
            >
              <img src={img} alt="Campus Logo" className="h-12 sm:h-16 filter drop-shadow-md" /> {/* Adjusted logo size, added drop shadow */}
            </motion.div>

            {/* Welcome Message: Added animation, enhanced styling, and text shadow for readability */}
            <motion.h2
              className="font-semibold text-base sm:text-lg md:text-xl text-white rounded-lg px-4 py-2 bg-blue-600/80 shadow-lg text-shadow-lg" // Added shadow-lg, text-shadow-lg (ensure this utility is configured if needed), slightly transparent background
              initial={{ opacity: 0, y: 20 }} // Start hidden and below
              animate={{ opacity: 1, y: 0 }} // Slide up and fade in
              transition={{ duration: 0.6, delay: 0.3 }} // Stagger animation after logo
            >
              Welcome Student{" "} {/* Greeting text */}
              {/* Student Name: Styled for emphasis */}
              <span className="text-green-300 font-bold">
                {ThisStudent ? `${ThisStudent.Fname} ${ThisStudent.Lname}` : "Loading..."} {/* Display student name or loading state */}
              </span>
            </motion.h2>
        </div>


        {/* Navigation Buttons: Absolute positioning over the image, styled, and with motion animations */}
        <motion.button
          onClick={handlePrev} // Previous image handler
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-3 rounded-full hover:bg-black/50 transition-colors z-30 focus:outline-none focus:ring-2 focus:ring-blue-400" // Positioning, styling, higher z-index, focus states
          whileHover={{ scale: 1.1 }} // Scale up on hover
          whileTap={{ scale: 0.9 }} // Scale down on tap
          aria-label="Previous image" // Accessibility
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" /> {/* Left arrow icon */}
        </motion.button>

        <motion.button
          onClick={handleNext} // Next image handler
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-3 rounded-full hover:bg-black/50 transition-colors z-30 focus:outline-none focus:ring-2 focus:ring-blue-400" // Positioning, styling, higher z-index, focus states
          whileHover={{ scale: 1.1 }} // Scale up on hover
          whileTap={{ scale: 0.9 }} // Scale down on tap
          aria-label="Next image" // Accessibility
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" /> {/* Right arrow icon */}
        </motion.button>

        {/* Slideshow Indicators (Dots): Positioned at the bottom center over the image, with z-index */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30"> {/* Positioning, spacing, higher z-index */}
          {Images.map((_, index) => (
            <button
              key={index} // Unique key for each dot
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-blue-500 scale-125" : "bg-gray-300/50 hover:bg-gray-300" // Active dot is larger and blue
              }`}
              onClick={() => setCurrentIndex(index)} // Set current index on click
              aria-label={`Go to slide ${index + 1}`} // Accessibility
            ></button>
          ))}
        </div>

      </div>

      {/* Amazing Footer Section: Positioned below the slideshow, full width (max-w-4xl), styled background, padding, shadow, border */}
      {/* Wrapped in motion.div for initial animation */}
      <motion.div
        className="w-full max-w-4xl mt-12 p-8 bg-gradient-to-r from-blue-600/10 to-blue-800/10 text-gray-100 rounded-xl shadow-2xl border border-blue-700 backdrop-blur-sm" // Enhanced background, padding, shadow, border, added backdrop blur
        initial={{ opacity: 0, y: 50 }} // Animation: start hidden below
        animate={{ opacity: 1, y: 0 }} // Animation: slide up and fade in
        transition={{ duration: 0.8, delay: 1 }} // Animation duration and delay after slideshow loads
      >
        {/* Footer Title */}
        <h3 className="text-3xl font-bold text-center text-blue-400 mb-8 drop-shadow"> {/* Styled title */}
          Connect With Us
        </h3>

        {/* Grid of Footer Cards: Responsive grid layout with gaps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> {/* Increased gap */}
          {/* Contact Card: Styled Card with Header, Content, and Lucid Icons */}
          {/* Wrapped in motion.div for staggered animation */}
          <motion.div
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 1.2 }} // Staggered animation
          >
            <Card className="h-full flex flex-col bg-gray-800/70 text-gray-200 border border-blue-600 rounded-lg shadow-md overflow-hidden"> {/* Styled Card with slightly more opaque background */}
              <CardHeader className="border-b border-blue-600/50 p-4"> {/* Styled Header */}
                <CardTitle className="text-xl font-semibold text-blue-300 flex items-center"> {/* Styled Title with icon */}
                   <Mail className="mr-3 w-5 h-5 text-blue-400" /> Contact Info {/* Changed icon and text */}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow p-4 space-y-3 text-sm"> {/* Styled Content, flex-grow to fill space, spacing between paragraphs */}
                <p className="flex items-start"><MapPin className="mr-3 mt-1 w-4 h-4 text-red-400 flex-shrink-0" /> Wolkite University Address, City, Country</p> {/* Address with icon */}
                <p className="flex items-center"><Phone className="mr-3 w-4 h-4 text-green-400" /> +123 456 7890</p> {/* Phone with icon */}
                <p className="flex items-center"><Mail className="mr-3 w-4 h-4 text-yellow-400" /> info@university.edu</p> {/* Email with icon */}
              </CardContent>
               {/* Optional CardFooter content if needed */}
              {/* <CardFooter className="p-4 text-center text-xs text-gray-400">Find us on the map!</CardFooter> */}
            </Card>
          </motion.div>

          {/* Quick Links Card: Styled Card with Header and list of links */}
          {/* Wrapped in motion.div for staggered animation */}
          <motion.div
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 1.4 }} // Staggered animation
          >
            <Card className="h-full flex flex-col bg-gray-800/70 text-gray-200 border border-blue-600 rounded-lg shadow-md overflow-hidden"> {/* Styled Card */}
              <CardHeader className="border-b border-blue-600/50 p-4"> {/* Styled Header */}
                <CardTitle className="text-xl font-semibold text-blue-300 flex items-center"> {/* Styled Title */}
                   <ChevronRight className="mr-3 w-5 h-5 text-blue-400" /> Quick Links {/* Added icon to Quick Links title */}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow p-4 text-sm"> {/* Styled Content, flex-grow */}
                <ul className="space-y-2"> {/* Spacing between list items */}
                   {/* Use Link if routing, otherwise <a> */}
                   <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center"><ChevronRight className="mr-2 w-4 h-4 text-blue-400 flex-shrink-0" />Academic Calendar</a></li> {/* Styled Link with icon */}
                   <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center"><ChevronRight className="mr-2 w-4 h-4 text-blue-400 flex-shrink-0" />Library</a></li>
                   <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center"><ChevronRight className="mr-2 w-4 h-4 text-blue-400 flex-shrink-0" />Student Portal</a></li>
                   <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center"><ChevronRight className="mr-2 w-4 h-4 text-blue-400 flex-shrink-0" />Campus Map</a></li>
                </ul>
              </CardContent>
              {/* Optional CardFooter content if needed */}
            </Card>
          </motion.div>

          {/* Social Media Card: Styled Card with Header and Social Icons */}
           {/* Wrapped in motion.div for staggered animation */}
           <motion.div
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 1.6 }} // Staggered animation
          >
            <Card className="h-full flex flex-col bg-gray-800/70 text-gray-200 border border-blue-600 rounded-lg shadow-md overflow-hidden"> {/* Styled Card */}
              <CardHeader className="border-b border-blue-600/50 p-4"> {/* Styled Header */}
                <CardTitle className="text-xl font-semibold text-blue-300 flex items-center"> {/* Styled Title */}
                   <Users className="mr-3 w-5 h-5 text-blue-400" /> Follow Us {/* Added Users icon to Follow Us title */}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow p-4 text-sm"> {/* Styled Content, flex-grow */}
                <div className="flex space-x-4 justify-center"> {/* Center social icons horizontally */}
                   <a href="https://web.facebook.com/wku.edu.et" className="text-blue-400 hover:text-blue-300 transition-colors" aria-label="Facebook"><Facebook size={28} /></a> {/* Styled Social Icons */}
                   <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors" aria-label="Twitter"><Twitter size={28} /></a>
                   <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors" aria-label="Instagram"><Instagram size={28} /></a>
                   <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors" aria-label="LinkedIn"><Linkedin size={28} /></a>
                </div>
                {/* Optional About Text */}
                {/* <p className="mt-4 text-center text-gray-300">A brief statement about the university or portal.</p> */}
              </CardContent>
               {/* Optional CardFooter content if needed */}
            </Card>
          </motion.div>
        </div>

        {/* Copyright Notice: Centered below the cards */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Your University Name. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
}