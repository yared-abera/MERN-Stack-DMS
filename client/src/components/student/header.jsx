import { Bug, Home, View } from "lucide-react";
import { Link } from "react-router-dom";
const headerComponent = [
  {
    label: "home",
    url: "/student/home",
    icon: Home,
  },
  {
    label: "viewDorm",
    url: "/student/dorm",
    icon: View,
  },
  {
    label: "Report Maintenance Issue",
    url: "/student/home",
    icon: Bug,
  },
];

export default function StudentHeader() {
  const date = new Date();
  return (
    <div className="fixed top-0 w-full z-10 h-20 shadow-lg border-solid flex ">
      <div className="w-[65%] bg-blue-600 flex items-center justify-evenly h-full">
        {headerComponent.map((item, index) => (
          <Link key={index} to={item.url} className="flex">
            <item.icon className="mr-2" />

            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="bg-green-600 w-[35%] flex items-center justify-between ">
        <div>
          <h1>{date.toLocaleTimeString}</h1>
        </div>
        <div>
            Avater
        </div>
      </div>
    </div>
  );
}
