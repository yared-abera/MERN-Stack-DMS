import React, { useEffect, useRef } from 'react'
import NavBar from '../../components/home/navigation-menu/layout'
import Slider from '../../components/home/slider/index'
import AboutUs from "../../components/home/about/about";
import HomeHeader from '@/components/home/header';
import Contact from '../../components/home/contact/index';
import Footer from '../../components/home/footer/index';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

  function Home() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  
  const parallaxRef = useRef(null);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!parallaxRef.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = parallaxRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      parallaxRef.current.style.setProperty('--mouse-x', `${x * 15}px`);
      parallaxRef.current.style.setProperty('--mouse-y', `${y * 15}px`);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        <div className="absolute inset-0 bg-[url('/assets/images/pattern.png')] opacity-5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      </div>
      
      {/* Floating particles */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-blue-400/30 dark:bg-blue-500/30"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: [null, Math.random() * -100],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <NavBar />
        
        <main className="relative">
          {/* Parallax header */}
          {/* <motion.div 
            ref={parallaxRef}
            style={{ y: springY }}
            className="relative transform-gpu will-change-transform"
          >
            <HomeHeader />
          </motion.div> */}
          
          {/* Content sections with staggered animations */}
          <div className="relative z-10 space-y-16 py-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <Slider />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <AboutUs />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Contact />
            </motion.div>
          </div>
        </main>
        
     <Footer />
      </motion.div>
    </div>
  )
}

export default Home