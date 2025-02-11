import img from "../../assets/img/building.jpeg";

export default function Admin() {
  return (
    <div
      className="flex  justify-center  w-full h-full opacity-50"
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
  <div  className="flex flex-col gap-1 p-2 ">
    <div className="mt-8">
    <h2 className="font-sans font-bold text-xl px-10">WOLKITE UNIVERSITY</h2>
    <h1 className="font-sans font-bold text-2xl">DORMITORY MANAGEMENT SYSTEM</h1>
    </div>
  
     </div>
      
    </div>
  );
}
