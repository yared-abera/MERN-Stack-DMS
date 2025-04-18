import React, { useState, useEffect } from 'react'
import img from '../../../assets/img/University_logo.png'
import { motion, useAnimation, useInView } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa';

function HomeHeader() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);
  
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    
    setMousePosition({ x, y });
  };
  
  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div 
      ref={ref}
      className="relative py-24 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-indigo-50/50 dark:from-gray-900/50 dark:to-gray-800/50" />
        
        {/* Animated circles */}
        <motion.div 
          className="absolute w-[400px] h-[400px] rounded-full bg-blue-200/20 dark:bg-blue-900/20 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            left: "10%",
            top: "20%",
          }}
        />
        
        <motion.div 
          className="absolute w-[300px] h-[300px] rounded-full bg-indigo-200/20 dark:bg-indigo-900/20 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            right: "15%",
            bottom: "30%",
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={variants}
          initial="hidden"
          animate={controls}
          className="text-center"
        >
          {/* Logo container with 3D effect */}
          <motion.div
            className="relative inline-block mb-8"
            whileHover={{ scale: 1.05, rotateY: 10 }}
            transition={{ duration: 0.3 }}
            style={{
              transformStyle: "preserve-3d",
              perspective: "1000px",
              transform: `translateX(${mousePosition.x * 10}px) translateY(${mousePosition.y * 10}px)`
            }}
          >
            <div className="absolute inset-0 bg-blue-500/30 dark:bg-blue-400/30 blur-3xl rounded-full" />
            <motion.div
              className="relative"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.5)",
                  "0 0 40px rgba(59, 130, 246, 0.3)",
                  "0 0 20px rgba(59, 130, 246, 0.5)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.img
                className="w-36 h-36 object-contain"
                src={img}
                alt="wolkite university logo"
                variants={itemVariants}
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </motion.div>

          {/* Title with advanced gradient and animation */}
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 animate-gradient"
            variants={itemVariants}
            style={{
              textShadow: "0 0 30px rgba(59, 130, 246, 0.3)"
            }}
          >
            DORMITORY MANAGEMENT SYSTEM
          </motion.h1>

          {/* Subtitle with fade-in effect */}
          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8"
            variants={itemVariants}
          >
            Efficiently managing student accommodations at Wolkite University
          </motion.p>
          
          {/* Call to action button */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a 
              href="#about" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Explore Our System
              <FaArrowDown className="ml-2 animate-bounce" />
            </a>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </motion.div>
      </div>
    </div>
  )
}

export default HomeHeader