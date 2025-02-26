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
    name: "fName",
    componentType: "input",
    type: "text",
    placeholder: "Enter First Name",
  },
  {
    label: "Middle Name",
    name: "mName",
    componentType: "text",
    placeholder: "Enter Middle Name",
    type: "text",
  },
  {
    label: "Last Name",
    name: "lName",
    componentType: "text",
    placeholder: "Enter Last Name",
    type: "text",
  },
  {
    label: "Email",
    name: "email",
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
    name: "phoneNum",
    componentType: "text",
    type: "text",
    placeholder: "Enter Phone Number",
  },

  {
    label: "Gender",
    name: "gender",
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
  // {
  //   label: "Confirm Password",
  //   name: "Confirm_password",
  //   componentType: "text",
  //   type: "password",
  //   placeholder: "Confrim Password",
  // },
  {
    label: "Role",
    name: "role",
    componentType: "select",
    options: [
      { id: "studentDean", label: "Student Dean" },
      { id: "proctorManager", label: "Proctor Manager" },
      { id: "proctor", label: "proctor" },
      { id: "admin", label: "Admin" },
      
    ],
  },
];

export const Maintainance_Issue = [
  {
    label: "First Name",
    name: "Fname",
    placeholder: "Enter First Name",
    type: "text",
    componentType: "input",
  },
  {
    label: "Middle Name",
    name: "Mname",
    placeholder: "Enter Middle Name",
    type: "text",
    componentType: "input",
  },
  {
    label: "Last Name",
    name: "Lname",
    placeholder: "Enter Last Name",
    type: "text",
    componentType: "input",
  },
  {
    label: "Student Id",
    name: "id",
    placeholder: "Enter user id",
    type: "text",
    componentType: "input",
  },
 
  {
    label: "Date",
    name: "date",
    
    type: "date",
    componentType: "input",
  },
  {
    label: "Block",
    name: "block",
    placeholder: "Enter user Block",
    type: "number",
    componentType: "input",
  },
  {
    label: "Dorm",
    name: "dorm",
    placeholder: "Enter user dorm",
    type: "number",
    componentType: "input",
  },
];
 

export const typeOfIssue = [
  {
    label: 'Electricity Issue',
    description: 'Problems related to electrical systems, such as power outages or faulty wiring.',
    name:'electric'
  },
  {
    label: 'Broken Window',
    description: 'Windows that are cracked or completely broken.',
    name:'window'
  },
  {
    label: 'Broken Door',
    description: 'Doors that do not close properly or are damaged.',
    name:'door'
  },
  {
    label: 'Missing Locker',
    description: 'Lockers that are not available or have been removed.',
    name:'locker'
  },
  {
    label: 'Missing Bed',
    description: 'Beds that are not present in the dormitory.',
    name:'bed'
  },
  
  {
    label: 'Safety Concern',
    description: 'Any issues related to safety, such as inadequate lighting or security.',
    name:'safety'
  },
  {
    label: 'Pest Infestation',
    description: 'Presence of pests like rodents or insects in the dormitory.',
    name:'past'
  }
];

export const Comment_Report = [
  {
    label: "First Name",
    name: "Fname",
    placeholder: "Enter First Name",
    type: "text",
    componentType: "input",
  },
  {
    label: "Middle Name",
    name: "Mname",
    placeholder: "Enter Middle Name",
    type: "text",
    componentType: "input",
  },
  {
    label: "Last Name",
    name: "Lname",
    placeholder: "Enter Last Name",
    type: "text",
    componentType: "input",
  },
  {
    label: "Student Id",
    name: "id",
    placeholder: "Enter user id",
    type: "text",
    componentType: "input",
  },
  
 
  {
    label: "Date",
    name: "date",
    type: "date",
    componentType: "input",
  },

  {
    label: "Description",
    name: "text_area",
    placeholder: "Enter Desciption",
    type: "textarea",
    componentType: "input",
  },
  
];

export const RadioButton=[
  {
    value:'remadial',
    id:'remadial',
    label:'Remadial Student'
  },
  {
    value:'freash',
    id:'freash',
    label:'Freshman student'
  },
  {
    value:'department',
    id:'department',
    label:'After Having Department'
  }
]

export const RegisterBlock = [
  {
    label: "Block Number",
    name: "blockNum",
    placeholder: "Enter Block Number",
    type: "number",
    componentType: "input",
  },
  {
    label: "Capacity",
    name: "capacity",
    placeholder: "Enter Capacity",
    type: "number",
    componentType: "input",
  },
  {
    label: "Found In",
    name: "foundIn",
    componentType: "select",
    options: [
      { id: "maleArea", label: "Male Area" },
      { id: "femaleArea", label: "Female Area" },
    ],
  },
  {
    label: "Status",
    name: "status",
    componentType: "select",
    options: [
      { id: "Available", label: "Available" },
      { id: "Occupied", label: "Occupied" },
    ],
  },
  {
    label: "Total Rooms",
    name: "totalRoom",
    placeholder: "Enter Total Number of Rooms",
    type: "number",
    componentType: "input",
  },
  {
    label: "Available Rooms",
    name: "availableRoom",
    placeholder: "Enter Number of Available Rooms",
    type: "number",
    componentType: "input",
  },
  {
    label: "Special Student Selection",
    name: "isSelectedForSpecialStud",
    componentType: "select",
    options: [
      { id: "true", label: "Yes" },
      { id: "false", label: "No" },
    ],
  },
  {
    label: "Disabled Student Selection",
    name: "isSelectedForDisableStud",
    componentType: "select",
    options: [
      { id: "true", label: "Yes" },
      { id: "false", label: "No" },
    ],
  },
];

 