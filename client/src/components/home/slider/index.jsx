import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";


const images = import.meta.glob("../../../assets/photo/*.{png,jpg,jpeg,svg}", { eager: true });

const imageList = Object.values(images).map((img) => img.default);

console.log(images); // Array of imported images


 

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="dark:bg-gray-800 relative  mx-5 my-5  overflow-hidden rounded-xl shadow-lg">
      {/* Slider Container */}
      <div className="flex items-center justify-center  mx-auto h-[400px] overflow-hidden">
        <motion.img
          key={currentIndex}
          src={imageList[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover rounded-xl"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          
        />
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        className="absolute top-1/2 left-2 ml-10 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <Button
        variant="ghost"
        className="absolute top-1/2 right-2 mr-10 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full"
        onClick={nextSlide}
      >
        <ChevronRight className="w-12 h-12" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {imageList.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
