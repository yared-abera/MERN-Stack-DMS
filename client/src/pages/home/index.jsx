import React from 'react'
import NavBar from '../../components/home/navigation-menu/layout'
import Slider from '../../components/home/slider/index'
import AboutUs from "../../components/home/about/about";
import HomeHeader from '@/components/home/header';
import Contact from '../../components/home/contact/index';
import Footer from '../../components/home/footer/index';
  function Home() {
  return (
     <>

    
     
     
     <NavBar/>
     <HomeHeader />
     <Slider/> 
     <AboutUs/>
     <Contact/>
     <Footer />
     </>
    
  )
}

export default Home