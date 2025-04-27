import React from 'react'
import img from '../../../assets/img/University_logo.png'
 function  HomeHeader() {
  return (
    <div className='py-3 mx-auto mt-8 max-w-3xl dark:bg-gray-800 dark:text-white  justify-center'>
      <img className='mx-auto' src={img} alt="wolkite university logo" /> 
      <h1 className='text-4xl text-center text-blue-600 dark:text-white'   >DORMITORY MANAGEMENT SYSTEM</h1>
      </div>
  )
}

export default HomeHeader