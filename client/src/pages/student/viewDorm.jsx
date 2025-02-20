import { useState } from "react";

export default function ViewDorm() {

  return (
    <div className="mt-20 overflow-hidden flex flex-col w-full min-h-screen m-4 shadow-md shadow-sky-500 border-solid">
    
     
     

      <div className="w-full h-[40%]   flex flex-col text-center  ">
        <h2 className="sm:text-xl md:text-2xl m-4">Studet Ahmed dorm</h2>
        <p>Block:220</p>
        <p>Dorm:120</p>
      </div>
      <div>
        <h1 className="text-xl font-semibold  ml-4 ">Dorm mates</h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 m-4 ">
          <div className="w-[300px] bg-orange-400">
            <p>First Name :Kebel</p>
            <p>Middle Name :Kebel</p>
            <p>Last Name :Kebel</p>
            <p>User Name :Kebel</p>
          </div>

          <div className="w-[300px] bg-orange-400">
            <p>First Name :Kebel</p>
            <p>Middle Name :Kebel</p>
            <p>Last Name :Kebel</p>
            <p>User Name :Kebel</p>
          </div>

          <div className="w-[300px] bg-orange-400">
            <p>First Name :Kebel</p>
            <p>Middle Name :Kebel</p>
            <p>Last Name :Kebel</p>
            <p>User Name :Kebel</p>
          </div>

          <div className="w-[300px] bg-orange-400">
            <p>First Name :Kebel</p>
            <p>Middle Name :Kebel</p>
            <p>Last Name :Kebel</p>
            <p>User Name :Kebel</p>
          </div>
        </div>
      </div>
    </div>
  );
}
