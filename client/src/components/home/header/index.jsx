import React from 'react'
import img from '../../../assets/img/University_logo.png'
 function  HomeHeader() {
  return (
    <div className='py-3 mx-auto  max-w-3xl   justify-center'>
      <img className='mx-auto' src={img} alt="" /> 
      <h1 className='text-4xl text-center text-blue-600'>DORMITORY MANAGEMENT SYSTEM</h1>
      </div>
  )
}

export default HomeHeader