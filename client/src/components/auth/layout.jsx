import { Outlet } from "react-router-dom";
import img from "../../assets/img/University_logo.png";
import { motion } from "framer-motion";

export default function LogInLayout() {
   

  return (
    <motion.div
      className="flex flex-col w-full h-[100vh] bg-gradient-to-b from-blue-800 to-white "
      
    >
      <header className="w-full h-auto   flex flex-col items-center ">
        <div className="m-8">
          <img className="text-white" src={img} alt="" />
        </div>
        <div className="mt-2">
          
          <p className="md:text-3xl sm:text-2xl font-bold  font-serif text-white opacity-40" >
            DORMITORY MANAGMENT SYSTEM
            </p>
          
        </div>
      </header>
      <section className="w-full h-full flex-1  flex items-center justify-center ">
        <Outlet />
      </section>
    </motion.div>
  );
}

// import { Outlet } from "react-router-dom";
// import img from "../../assets/img/University_logo.png"; // Assuming this is your logo path
// import { motion } from "framer-motion";

// export default function LogInLayout() {
//   const welcomeVariants = {
//     hidden: { opacity: 0, x: -100 },
//     visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
//   };

//   return (
//     <motion.div
//       className="flex flex-col md:flex-row w-full h-[100vh] bg-gradient-to-br from-blue-800 to-blue-400 overflow-hidden" // Gradient background
//       initial="hidden"
//       animate="visible"
//       variants={{ visible: { transition: { staggerChildren: 0.3 } } }} // Stagger children animations
//     >
//       {/* Left Section - Welcome */}
//       <motion.div
//         className="w-full md:w-1/2 h-1/3 md:h-full flex flex-col items-center justify-center p-8 text-white relative"
//         variants={welcomeVariants}
//       >
//         {/* Abstract Shapes (Optional - Basic representation) */}
//         <div className="absolute top-0 left-0 w-64 h-64 bg-blue-700 opacity-20 rounded-full filter blur-3xl -translate-x-1/4 -translate-y-1/4"></div>
//         <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600 opacity-20 rounded-full filter blur-3xl translate-x-1/4 translate-y-1/4"></div>


//         <div className="z-10 text-center"> {/* Ensure text is above shapes */}
//            {/* Assuming you might still want the logo/title here or just the welcome text */}
//            {/* <div className="m-4 md:m-8">
//                <img className="text-white h-12 md:h-auto" src={img} alt="University Logo" />
//            </div>
//            <div className="mt-2">
//               <p className="md:text-3xl sm:text-2xl font-bold font-serif text-white opacity-80" >
//                 DORMITORY MANAGMENT SYSTEM
//               </p>
//            </div> */}
//           <motion.h1
//              className="text-4xl md:text-5xl font-bold mb-2"
//              initial={{ opacity: 0, y: 20 }}
//              animate={{ opacity: 1, y: 0 }}
//              transition={{ delay: 0.5, duration: 0.6 }}
//           >
//             WELCOME
//           </motion.h1>
//           <motion.p
//              className="text-xl md:text-2xl font-semibold opacity-90 mb-4"
//              initial={{ opacity: 0, y: 20 }}
//              animate={{ opacity: 1, y: 0 }}
//              transition={{ delay: 0.7, duration: 0.6 }}
//           >
//              YOUR HEADLINE NAME
//           </motion.p>
//           <motion.p
//              className="text-sm md:text-base opacity-70 max-w-sm mx-auto"
//              initial={{ opacity: 0, y: 20 }}
//              animate={{ opacity: 1, y: 0 }}
//              transition={{ delay: 0.9, duration: 0.6 }}
//           >
//             {/* Placeholder for descriptive text */}
//             Manage your dormitory easily and efficiently with our system.
//           </motion.p>
//         </div>
//       </motion.div>

//       {/* Right Section - Login Form */}
//       <div className="w-full md:w-1/2 h-2/3 md:h-full flex items-center justify-center relative z-0"> {/* z-0 to ensure card is below header elements */}
//         {/* A white background area for the card - The card itself is white */}
//         <Outlet /> {/* The LogIn component will be rendered here */}
//       </div>
//     </motion.div>
//   );
// }