import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button"; // Assuming this path is correct
import { ChevronLeft, ChevronRight } from "lucide-react";
import universityLogo from '../../../assets/img/University_logo.png'; // Renamed import for clarity

// Import images using Vite's glob import
// Ensure the path ../../../assets/photo/ is correct relative to this component file
const images = import.meta.glob("../../../assets/photo/*.{png,jpg,jpeg,svg}", { eager: true });
// Check if images were found - handle potential errors
const imageList = Object.values(images).map((module) => module.default);

// Fallback if no images are found
const defaultImageList = [
    'https://via.placeholder.com/1024x450/cccccc/969696?text=Default+Image+1',
    'https://via.placeholder.com/1024x450/cccccc/969696?text=Default+Image+2'
];

const Slider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // Use imported images or fallback if none found
    const currentImageList = imageList.length > 0 ? imageList : defaultImageList;

    // Auto-scroll every 5 seconds
    useEffect(() => {
        // Prevent auto-scroll if there's only one image or none
        if (currentImageList.length <= 1) return;

        const interval = setInterval(() => {
            // Use functional update inside setInterval to avoid dependency issues
            setCurrentIndex((prev) => {
                const nextIndex = prev === currentImageList.length - 1 ? 0 : prev + 1;
                setDirection(1); // Set direction for next slide
                return nextIndex;
            });
        }, 5000); // 5 seconds

        // Clear interval on component unmount or if image list changes
        return () => clearInterval(interval);
        // Rerun effect if the image list itself changes (e.g., dynamic loading)
    }, [currentImageList.length]); // Dependency on the number of images

    const prevSlide = () => {
        if (currentImageList.length <= 1) return; // Don't navigate if only one image
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? currentImageList.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        if (currentImageList.length <= 1) return; // Don't navigate if only one image
        setDirection(1);
        setCurrentIndex((prev) => (prev === currentImageList.length - 1 ? 0 : prev + 1));
    };

    const goToSlide = (index) => {
        if (currentImageList.length <= 1) return;
        setDirection(index > currentIndex ? 1 : (index < currentIndex ? -1 : 0));
        setCurrentIndex(index);
    }

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000, // Start off-screen
            opacity: 0
        }),
        center: {
            zIndex: 1, // Active slide is on top during transition
            x: 0, // Center position
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0, // Exiting slide goes behind
            x: direction < 0 ? 1000 : -1000, // Exit off-screen
            opacity: 0
        })
    };

    // Handle case where no images were loaded
    if (currentImageList.length === 0) {
      return (
        <div className="dark:bg-gray-800 relative mx-auto my-8 max-w-5xl overflow-hidden rounded-2xl shadow-2xl p-10 text-center">
             <img className='mx-auto h-20 w-auto mb-4' src={universityLogo} alt="Wolkite University Logo" />
             <h1 className='text-3xl font-semibold text-center text-blue-600 dark:text-white mb-4'>
                DORMITORY MANAGEMENT SYSTEM
             </h1>
             <p className="text-red-500">Error: No slider images found in assets/photo/</p>
             <p className="text-gray-600 dark:text-gray-400">Please check the image path and ensure images exist.</p>
        </div>
      );
    }


    return (
        <div className="dark:bg-gray-800 mx-auto my-8 max-w-5xl rounded-2xl shadow-2xl overflow-hidden">
            {/* Static Header Section - Moved outside the slider container */}
            <div className='py-4 px-4 bg-white dark:bg-gray-800 dark:text-white'> {/* Removed redundant background */}
                <img className='mx-auto h-16 w-auto mb-2' src={universityLogo} alt="Wolkite University Logo" /> {/* Adjusted size */}
                <h1 className='text-3xl font-semibold text-center text-blue-600 dark:text-white'> {/* Adjusted size */}
                    DORMITORY MANAGEMENT SYSTEM
                </h1>
            </div>

            {/* Slider Container */}
            <div className="relative h-[450px] overflow-hidden"> {/* Keep overflow hidden here */}
                <AnimatePresence initial={false} custom={direction}>
                    <motion.img
                        key={currentIndex} // Essential for AnimatePresence to track changes
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 }, // Slide transition
                            opacity: { duration: 0.3 } // Fade transition
                        }}
                        src={currentImageList[currentIndex]}
                        alt={`Slide ${currentIndex + 1}`}
                        className="absolute w-full h-full object-cover" // Image covers the container
                    />
                </AnimatePresence>

                {/* Overlay gradient for better text visibility (only for caption now) */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div> {/* Gradient at bottom */}

                {/* Slide caption (ensure it's above the gradient) */}
                <div className="absolute bottom-16 left-0 right-0 text-center text-white z-10 px-4"> {/* Increased bottom padding */}
                    <h3 className="text-xl font-bold mb-1 drop-shadow-md">Wolkite University Dormitory</h3> {/* Slightly smaller */}
                    <p className="text-md drop-shadow-md">Comfortable and secure accommodation for students</p> {/* Slightly smaller */}
                </div>

                {/* Navigation Buttons (ensure they are above gradient/caption) */}
                 {currentImageList.length > 1 && ( // Only show buttons if more than one image
                     <>
                        <Button
                            variant="ghost"
                            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-20 transition-colors duration-300" // Increased z-index
                            onClick={prevSlide}
                            aria-label="Previous Slide"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>

                        <Button
                            variant="ghost"
                            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-20 transition-colors duration-300" // Increased z-index
                            onClick={nextSlide}
                            aria-label="Next Slide"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                     </>
                 )}


                {/* Indicators (ensure they are above gradient/caption) */}
                 {currentImageList.length > 1 && ( // Only show indicators if more than one image
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20"> {/* Adjusted spacing and z-index */}
                        {currentImageList.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${ // Slightly smaller dots
                                    currentIndex === index
                                        ? "bg-white scale-110" // Active indicator style
                                        : "bg-white/50 hover:bg-white/80" // Inactive indicator style
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                 )}
            </div>
        </div>
    );
};

export default Slider;