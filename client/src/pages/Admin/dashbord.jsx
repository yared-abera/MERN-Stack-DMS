import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen  ">
      <div className=" mx-auto  mt-32   flex items-center justify-center flex-col ">
        <h2 className="font-sans font-bold sm:text-xl sm:px-6  md:text-2xl pl-14">
          WOLKITE UNIVERSITY
        </h2>
        <h1 className="font-sans font-bold sm:text-2xl md:text-3xl">
          DORMITORY MANAGEMENT SYSTEM
        </h1>
      </div>
      <div className="flex-1 flex-col w-full p-10    ">
        <div className="flex items-center justify-center flex-col ">
          <h1 className="my-6 text-xl font-bold font-sans">
            Recently Accessed Account
          </h1>
          <div className=" flex flex-wrap gap-4 w-full rounded-lg border-solid shadow-md">
            <div className="  flex flex-col justify-around dark:bg-gradient-to-tr  from-green-500 to-blue-700   p-4 text-white shadow-2xl shadow-slate-950 w-52 h-56 border-red-100">
              <p className="dark:text-white  text-black">First Name :</p>
              <p className="dark:text-white text-black" >Last Name :</p>
              <p className="dark:text-white text-black">User Name :</p>
              <p className="dark:text-white text-black">Email:</p>
              <p className="dark:text-white text-black">Role :</p>
              <div className="flex items-end justify-center mt-7  ">
                <Button className="w-full">Remove</Button>
              </div>
            </div>
            <div className="bg-gradient-to-tr from-blue-500 to-orange-700  p-4 text-white shadow-lg w-32 h-36">
              yes
            </div>
            <div className="bg-gradient-to-tr from-blue-500 to-orange-700  p-4 text-white shadow-lg w-32 h-36">
              yes
            </div>
            <div className="bg-gradient-to-tr from-blue-500 to-orange-700  p-4 text-white shadow-lg w-32 h-36">
              yes
            </div>
            <div className="bg-gradient-to-tr from-blue-500 to-orange-700  p-4 text-white shadow-lg w-32 h-36">
              yes
            </div>
          </div>
          <div></div>
        </div>{" "}
        <div className="flex flex-wrap gap-4 w-full">
          <h1 className="my-6 text-xl font-bold font-sans">
            Recently Created Account
          </h1>
          <div className=" grid grid-cols-3 gap-20">
            <div className="bg-gradient-to-tr from-blue-500 to-white p-4 text-white shadow-lg w-32 h-36 border-red-100">
              yes
            </div>
            <div className="bg-gradient-to-tr from-blue-500 to-white  p-4 text-white shadow-lg w-32 h-36">
              yes
            </div>
            <div className="bg-gradient-to-tr from-blue-500 to-white p-4 text-white shadow-lg w-32 h-36">
              yes
            </div>
            <div className="bg-gradient-to-tr from-blue-500 to-white  p-4 text-white shadow-lg w-32 h-36">
              yes
            </div>
            <div className="bg-gradient-to-tr from-blue-500 to-white  p-4 text-white shadow-lg w-32 h-36">
              yes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
