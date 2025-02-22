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
