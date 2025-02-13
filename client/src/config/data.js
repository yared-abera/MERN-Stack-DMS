import {
  LayoutDashboard,
  MessageSquareShareIcon,
  Settings,
} from "lucide-react";

export const logInForm = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter User Name",
    type: "text",
    componentType: "input",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter Password",
    type: "password",
    componentType: "input",
  },
];

export const adminSideBar = [
  {
    id: 1,
    label: "Dashbord",
    path: "/admin/dashbord",
    icon: LayoutDashboard,
  },
  {
    id: 2,
    label: "Manage Account",
    path: "/admin/manage",
    icon: MessageSquareShareIcon,
  },
  {
    id: 3,
    label: "setting",
    path: "/admin/setting",
    icons: Settings,
  },
];
 
export const UserAccount = [
  {
    label: "First Name",
    fName: "Fname",
    componentType: "input",
    type: "text",
    placeholder: "Enter First Name",
  },
  {
    label: "Middle Name",
    name: "Mname",
    componentType: "text",
    placeholder: "Enter Middle Name",
    type: "text",
  },
  {
    label: "Last Name",
    name: "Lname",
    componentType: "text",
    placeholder: "Enter Last Name",
    type: "text",
  },
  {
    label: "Email",
    name: "ename",
    componentType: "text",
    type: "email",
    placeholder: "Enter Email",
  },
  {
    label: "User Name",
    name: "userName",
    componentType: "text",
    type: "text",
    placeholder: "Enter User Name",
  },
  {
    label: "Phone Number",
    name: "PhonNum",
    componentType: "text",
    type: "text",
    placeholder: "Enter Email",
  },

  {
    label: "Gender",
    name: "sex",
    componentType: "select",
    options: [
      { id: "male", label: "Male" },
      { id: "female", label: "Female" },
    ],
  },
  {
    label: " Password",
    name: "password",
    componentType: "text",
    type: "password",
    placeholder: "Enter Password",
  },
  {
    label: "Confirm Password",
    name: "password",
    componentType: "text",
    type: "password",
    placeholder: "Confrim Password",
  },
  {
    label: "Role",
    name: "role",
    componentType: "select",
    options: [
      { id: "studentDean", label: "Student Dean" },
      { id: "proctorManager", label: "Proctor Manager" },
      { id: "proctor", label: "proctor" },
    ],
  },
];
