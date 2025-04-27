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
  {
    label: "Confirm Password",
    name: "Confirm_password",
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
      { id: "admin", label: "Admin" },
      // { id: "student", label: "student" },
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
    label: "user_name",
    name: "id",
    placeholder: "Enter user_name",
    type: "text",
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

  {
    label: "Phone Number",
    name: "phoneNumber",
    placeholder: "Enter user Phone Number",
    type: "text",
    componentType: "input",
  },
];

export const typeOfIssue = [
  {
    label: "Electricity Issue",
    description:
      "Problems related to electrical systems, such as power outages or faulty wiring.",
    name: "electric",
  },
  {
    label: "Broken Window",
    description: "Windows that are cracked or completely broken.",
    name: "window",
  },
  {
    label: "Broken Door",
    description: "Doors that do not close properly or are damaged.",
    name: "door",
  },
  {
    label: "Missing Locker",
    description: "Lockers that are not available or have been removed.",
    name: "locker",
  },
  {
    label: "Missing Bed",
    description: "Beds that are not present in the dormitory.",
    name: "bed",
  },

  {
    label: "Safety Concern",
    description:
      "Any issues related to safety, such as inadequate lighting or security.",
    name: "safety",
  },
  {
    label: "Pest Infestation",
    description: "Presence of pests like rodents or insects in the dormitory.",
    name: "past",
  },
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
    label: "Gender",
    name: "sex",
 
    type: "text",
    componentType: "input",
  },
  {
    label: "Block",
    name: "block",
 
    type: "text",
    componentType: "input",
  },

  {
    label: "Dorm",
    name: "dormId",
 
    type: "text",
    componentType: "input",
  },


 

  {
    label: "Description",
    name: "textarea",
    placeholder: "Enter Desciption",
    type: "textarea",
    componentType: "input",
  },
 

 
];

export const RadioButton = [
  {
    value: "remedial",
    id: "remedial",
    label: "Remadial student ",
  },

  {
    value: "fresh",
    id: "fresh",
    label: "Freshman student ",
  },
  {
    value: "senior",
    id: "senior",
    label: "After Having Department",
  },
];
export const RadioFileFormat = [
  {
    value: "json",
    id: "json",
    label: "Json File format",
  },
  {
    value: "csv",
    id: "csv",
    label: "Microsoft Excel",
  },
];

export const StudDataSchema = {
  Fname: String,
  Mname: String,
  Lname: String,
  email: String,
  userName: String,
  phoneNum: String,
  password: String,
  sex: String,
  batch: String,
  isSpecial: String,
  isDisable: String,
  address: String,
  stream: String,
  studCategory: String,
  department: String,
  collage: String,
  dorm: Number,
  block: Number,
  role: String,
};
export const requiredSchema = {
  Fname:String,
  Mname: String,
  Lname: String,
  userName: String,
  sex: String,
  isSpecial: String,
  isDisable: String,
  department: String,
  stream: String,
};

export const Gust = {
  Fname: String,
  Mname: String,
  Lname: String,
  userName: String,
  block: "",
  dorm: "",
};

export const AllocationTabscategories = [
  {
    key: "physicalDisable",
    label: "physical Imared",
    options: [
      { name: "male", label: "Male Student" },
      { name: "female", label: "Female student" },
    ],
  },
  {
    key: "scholar",
    label: "Scholar Student",
    options: [
      { name: "male", label: "Male Student" },
      { name: "female", label: "Female Student" },
    ],
  },
  {
    key: "regular",
    label: "Regular Student",
    options: [
      { name: "male", label: "Male Student" },
      { name: "female", label: "Female Student" },
    ],
  },
];
export const RegisterBlock = [
  {
    label: "Block Number",
    name: "blockNum",
    placeholder: "Enter Block Number",
    type: "number",
   
  },
  {
    label: "floor Numbers",
    name: "totalFloors",
    placeholder: "Enter Number of floor",
    type: "number",
    
  },
  {
    label: "Found In",
    name: "foundIn",
     type:'text'
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
];

export const RegisterDorm = [
  {
    label: "Block Number",
    name: "blockNum",
    placeholder: "Enter Block Number",
    type: "number",
    componentType: "input",
  },
  {
    label: "floor Numbers",
    name: "totalFloors",
    placeholder: "Enter Number of floor",
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
    label: "Special Student Selection",
    name: "isSelectedForSpecialStud",
    componentType: "select",
    options: [
      { id: "true", label: "Yes" },
      { id: "false", label: "No" },
    ],
  },
];

 
