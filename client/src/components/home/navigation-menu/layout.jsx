import React from 'react'
import { Moon } from 'lucide-react'
import { Link } from "react-scroll";
import { FaHome, FaInfoCircle, FaPhone } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../../store/common/ThemeSlice';
function  NavBar() {
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
  return (
     <nav className="bg-white/20 dark:bg-black backdrop-blur-xl top-0 w-full 
     shadow-lg relative items-center container mx-auto 
      p-4 mt-0 justify-around " > 
      <div className='flex items-center justify-between '>
      
       <div className='text-center'>
          {/* logo */}
          <h1 className='text-3xl dark:text-white'>wkudms</h1>

        </div> 
       {/* menu items*/}
        <div className='hidden space-x-6 md:flex  lg:w-1/3 '>
        <Link
              to="home"
              smooth={true}
              duration={1000}
              className="text-lg dark:text-white flex items-center  w-1/3   space-x-7  rounded-xl hover:bg-blue-500 hover:scale-110 duration-1000 cursor-pointer"
             >
              
              <FaHome className="mr-1 " size={16} color={theme === 'dark' ? 'white' : 'black'}/>
               HOME
          </Link>
          <Link
              to="about"
              smooth={true}
              duration={1000}
              className="flex dark:text-white items-center text-lg py-1 px-3 w-1/3 rounded-xl hover:bg-blue-500 hover:scale-110 duration-1000 cursor-pointer"
             >
              <FaInfoCircle className="mr-1" size={16} color={theme === 'dark' ? 'white' : 'black'}/>
              ABOUT
          </Link>
          <Link
              to="contact"
              smooth={true}
              duration={1000}
              className="text-lg dark:text-white  flex items-center py-1 px-3 w-1/3 rounded-xl hover:bg-blue-500 hover:scale-110 duration-1000 cursor-pointer md:w-fit"
             >
              <FaPhone className="mr-1" size={16} color={theme === 'dark' ? 'white' : 'black'}/>
              CONTACT
          </Link>
        </div>
        <div className='flex items-center space-x-6  '>
         <button className='dark:text-white' onClick={() =>dispatch(toggleTheme())}> {theme === 'dark' ? 'Light' : 'Dark'} Mode</button> 
          <button className='bold bg-blue-500 dark:text-white dark:bg-blue-600 hover:bg-blue-400  py-2  px-8  rounded-2xl '>LOGIN</button>
          {/* menu bar sheet */}
          
        </div>
         
        
      </div>
     </nav>

  )
}

export default NavBar