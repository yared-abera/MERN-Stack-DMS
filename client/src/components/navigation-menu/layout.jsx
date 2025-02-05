import React from 'react'
import { Moon,Menu } from 'lucide-react'
 
 

function  NavBar() {

      

  return (
     <nav className="bg-white/20 backdrop-blur-xl   top-0 w-full 
     shadow-lg relative items-center container mx-auto 
      p-4 mt-0  justify-around  ">
       

      <div className='flex  items-center justify-between   '>
      
       <div className='text-center'>
          {/* logo */}
          <h1 className='text-3xl'>wkudms</h1>

        </div> 
       {/* menu items*/}
        <div className='hidden space-x-6 md:flex '>
          <a  className=' text-lg py-1 px-4 w-1/3  rounded-xl hover:bg-blue-500 hover:scale-110 duration-1000' href="#"> HOME</a>
          <a  className='text-lg py-1 px-3  w-1/3 rounded-xl   hover:bg-blue-500 hover:scale-110 duration-1000'href="#">ABOUT</a>
          <a  className='text-lg py-1 px-3  w-1/3 rounded-xl   hover:bg-blue-500 hover:scale-110 duration-1000'href="#">CONTACT</a>
        </div>
        <div className='flex items-center space-x-6  border-2 border-blue'>
          <Moon  size={24} color="black" />
          <button className='bold bg-blue-500 hover:bg-blue-400  py-2  px-8  rounded-2xl '>LOGIN</button>
          {/* menu bar sheet */}
          
        </div>
         
        
      </div>
     </nav>

  )
}

export default NavBar