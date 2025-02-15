import img from "../../assets/photo/gibi.jpg";
import logo from "../../assets/img/University_logo.png";
import { Button } from "@/components/ui/button";

export default function StudentDeanHome() {
  return (
    <div
      className="w-full min-h-screen mt-20 bg-cover bg-center flex flex-col    "
      style={{
        backgroundImage: `url(${img})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="sm:p-2 md:p-4 flex-1">
        <div className="flex  items-center  place-content-center w-full mt-3 ">
          <img src={logo} alt="campus img" />
        </div>

        <div className="flex flex-col gap-2 ">
          <div className="my-4 text-center sm:w-full md:w-1/2">
            <h1 className="text-neutral-950 sm:text-md md:text-3xl font-bold ">
              Recently Searched Student Info
            </h1>
          </div>

          <div className="  grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 flex-1     ">
            <div className="  flex flex-col justify-around dark:bg-gradient-to-tr  from-orange-500 to-blue-700 bg-white  p-4 text-white shadow-2xl shadow-slate-950 w-auto h-56 border-red-100">
              <p className="dark:text-white  text-black">First Name :</p>
              <p className="dark:text-white text-black">Last Name :</p>
              <p className="dark:text-white text-black">User Name :</p>
              <p className="dark:text-white text-black">Email:</p>
              <p className="dark:text-white text-black">Role :</p>
              <div className="flex items-center justify-between mt-7 gap-4 ">
                <Button className="w-full">Remove</Button>
                <Button className="w-full">View Detail</Button>
              </div>
            </div>

            <div className="  flex flex-col justify-around dark:bg-gradient-to-tr  from-green-500 to-blue-700   p-4 text-white shadow-2xl shadow-slate-950 w-52 h-56 border-red-100">
              <p className="dark:text-white  text-black">First Name :</p>
              <p className="dark:text-white text-black">Last Name :</p>
              <p className="dark:text-white text-black">User Name :</p>
              <p className="dark:text-white text-black">Email:</p>
              <p className="dark:text-white text-black">Role :</p>
              <div className="flex items-end justify-center mt-7  ">
                <Button className="w-full">Remove</Button>
              </div>
            </div>
            <div className="  flex flex-col justify-around dark:bg-gradient-to-tr  from-green-500 to-blue-700   p-4 text-white shadow-2xl shadow-slate-950 w-52 h-56 border-red-100">
              <p className="dark:text-white  text-black">First Name :</p>
              <p className="dark:text-white text-black">Last Name :</p>
              <p className="dark:text-white text-black">User Name :</p>
              <p className="dark:text-white text-black">Email:</p>
              <p className="dark:text-white text-black">Role :</p>
              <div className="flex items-end justify-center mt-7  ">
                <Button className="w-full">Remove</Button>
              </div>
            </div>

            <div className="  flex flex-col justify-around dark:bg-gradient-to-tr  from-green-500 to-blue-700   p-4 text-white shadow-2xl shadow-slate-950 w-52 h-56 border-red-100">
              <p className="dark:text-white  text-black">First Name :</p>
              <p className="dark:text-white text-black">Last Name :</p>
              <p className="dark:text-white text-black">User Name :</p>
              <p className="dark:text-white text-black">Email:</p>
              <p className="dark:text-white text-black">Role :</p>
              <div className="flex items-end justify-center mt-7  ">
                <Button className="w-full">Remove</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="  w-full bg-orange-500  ">Foolter</div>
    </div>
  );
}
