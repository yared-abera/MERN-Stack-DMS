import { Outlet } from "react-router-dom";
import img from "../../assets/img/University_logo.png";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { useEffect } from "react";

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
          {/* <motion.p
            className="md:text-3xl sm:text-2xl font-bold  font-serif text-white opacity-40"
            initial={{ x: -10 }}
            animate={{ x: 40 }}
            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity,repeatDelay:2 }}
          > */}
          <p className="md:text-3xl sm:text-2xl font-bold  font-serif text-white opacity-40" >
            DORMITORY MANAGMENT SYSTEM
            </p>
          {/* </motion.p> */}
        </div>
      </header>
      <section className="w-full h-full flex-1  flex items-center justify-center ">
        <Outlet />
      </section>
    </motion.div>
  );
}
