import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = import.meta.glob("../../../assets/photo/*.{png,jpg,jpeg,svg}", { eager: true });
const imageList = Object.values(images).map((img) => img.default);

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="dark:bg-gray-800 relative mx-auto my-8 max-w-5xl overflow-hidden rounded-2xl shadow-2xl">
      {/* Slider Container */}
      <div className="relative h-[450px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            src={imageList[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="absolute w-full h-full object-cover"
          />
        </AnimatePresence>
        
        {/* Overlay gradient for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Slide caption */}
        <div className="absolute bottom-20 left-0 right-0 text-center text-white z-10">
          <h3 className="text-2xl font-bold mb-2">Wolkite University Dormitory</h3>
          <p className="text-lg">Comfortable and secure accommodation for students</p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full z-10 transition-all duration-300"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <Button
        variant="ghost"
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full z-10 transition-all duration-300"
        onClick={nextSlide}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {imageList.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === index 
                ? "bg-white scale-125" 
                : "bg-gray-400 hover:bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
