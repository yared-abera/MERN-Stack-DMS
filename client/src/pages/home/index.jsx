import React from 'react'
import NavBar from '../../components/navigation-menu/layout'
import Slider from '../../components/slider/index'
import AboutUs from "../../components/about/about";
  function Home() {
  return (
     <>
     
     <NavBar/>
     
     <Slider/> 
     <AboutUs/>
     </>
    
  )
}

export default Home