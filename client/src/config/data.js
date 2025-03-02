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
  {
    value: "gust",
    id: "gust",
    label: "Gust",
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
};
export const requiredSchema = {
  Fname: String,
  Mname: String,
  Lname: String,
  userName: String,
  sex: String,
  studCategory: String,
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

 // Block Data
export const blockData=[
  {
    "blockNum": 1,
    "location": "girls_Campus",
    "totalCapacity": 100,
    "availableRoom": 30,
    "isFull": false,
    "isSelectedForImpaired": false,
    "isSelectedForSpecial": true,
    "description": "Block for female students.",
    "floors": []
  },
  {
    "blockNum": 2,
    "location": "boys_Campus",
    "totalCapacity": 150,
    "availableRoom": 0,
    "isFull": true,
    "isSelectedForImpaired": true,
    "isSelectedForSpecial": false,
    "description": "Block for male students.",
    "floors": []
  },
  {
    "blockNum": 3,
    "location": "Other",
    "totalCapacity": 80,
    "availableRoom": 20,
    "isFull": false,
    "isSelectedForImpaired": false,
    "isSelectedForSpecial": false,
    "description": "Mixed block.",
    "floors": []
  }
]

// Floor Data
export const FloorData=[
  {
    "floorNumber": 1,
    "floorStatus": "available",
    "floorCapacity": 40,
    "block": "ObjectId_of_Block_1",
    "dorms": []
  },
  {
    "floorNumber": 2,
    "floorStatus": "occupied",
    "floorCapacity": 30,
    "block": "ObjectId_of_Block_1",
    "dorms": []
  },
  {
    "floorNumber": 1,
    "floorStatus": "partial",
    "floorCapacity": 50,
    "block": "ObjectId_of_Block_2",
    "dorms": []
  },
  {
    "floorNumber": 1,
    "floorStatus": "maintenance",
    "floorCapacity": 40,
    "block": "ObjectId_of_Block_3",
    "dorms": []
  }
]

// Dorm Data
export const dormData=[
  {
    "dormNumber": 101,
    "capacity": 4,
    "dormStatus": "available",
    "floor": "ObjectId_of_Floor_1",
    "block": "ObjectId_of_Block_1"
  },
  {
    "dormNumber": 102,
    "capacity": 4,
    "dormStatus": "occupied",
    "floor": "ObjectId_of_Floor_1",
    "block": "ObjectId_of_Block_1"
  },
  {
    "dormNumber": 201,
    "capacity": 2,
    "dormStatus": "available",
    "floor": "ObjectId_of_Floor_3",
    "block": "ObjectId_of_Block_2"
  },
  {
    "dormNumber": 202,
    "capacity": 3,
    "dormStatus": "maintenance",
    "floor": "ObjectId_of_Floor_4",
    "block": "ObjectId_of_Block_3"
  }
]


export const BlockDemoData = [
  {
    blockNum: 1,
    location: "boys_Campus",
    totalCapacity: 300,
    availableRoom: 50,
    isFull: false,
    floors: [
      {
        floorNumber: 1,
        floorStatus: "Available",
        floorCapacity: 100
      },
      {
        floorNumber: 2,
        floorStatus: "Available",
        floorCapacity: 100
      },
      {
        floorNumber: 3,
        floorStatus: "Available",
        floorCapacity: 100
      }
    ],
    dorms: [
      {
        dormNumber: 101,
        capacity: 4,
        dormStatus: "Available"
      },
      {
        dormNumber: 102,
        capacity: 4,
        dormStatus: "Available"
      },
      {
        dormNumber: 103,
        capacity: 2,
        dormStatus: "Available"
      },
        {
        dormNumber: 201,
        capacity: 4,
        dormStatus: "Available"
      },
      {
        dormNumber: 202,
        capacity: 4,
        dormStatus: "Available"
      },
      {
        dormNumber: 203,
        capacity: 2,
        dormStatus: "available"
      },
        {
        dormNumber: 301,
        capacity: 4,
        dormStatus: "Available"
      },
      {
        dormNumber: 302,
        capacity: 4,
        dormStatus: "Available"
      },
      {
        dormNumber: 303,
        capacity: 2,
        dormStatus: "Available"
      }
    ],
   
    description: "Block A - for general students"
  },
  {
    blockNum: 2,
    location: "girls_Campus",
    totalCapacity: 200,
    availableRoom: 100,
    isFull: false,
    floors: [
      {
        floorNumber: 1,
        floorStatus: "Available",
        floorCapacity: 100
      },
      {
        floorNumber: 2,
        floorStatus: "Available",
        floorCapacity: 100
      }
    ],
    dorms: [
      {
        dormNumber: 1,
        capacity: 2,
        dormStatus: "available"
      },
      {
        dormNumber: 2,
        capacity: 2,
        dormStatus: "available"
      },
      {
        dormNumber: 3,
        capacity: 4,
        dormStatus: "Available"
      },
       {
        dormNumber: 4,
        capacity: 4,
        dormStatus: "Available"
      }
    ],
    isSelectedForImaried: false,
    isSelectedForSpecial: true,
    description: "Block B - for special program students"
  },
    {
    blockNum: 3,
    location: "boys_Campus",
    totalCapacity: 150,
    availableRoom: 10,
    isFull: true,
    floors: [
      {
        floorNumber: 1,
        floorStatus: "Available",
        floorCapacity: 75
      },
      {
        floorNumber: 2,
        floorStatus: "Available",
        floorCapacity: 75
      },
    ],
    dorms: [
      {
        dormNumber: 1,
        capacity: 3,
        dormStatus: "Available"
      },
      {
        dormNumber: 2,
        capacity: 3,
        dormStatus: "Available"
      },
      {
        dormNumber: 3,
        capacity: 3,
        dormStatus: "Available"
      }
    ],
    isSelectedForImaried: false,
    isSelectedForSpecial: false,
    description: "Block C - for female students"
  }
];


export  const AllocationTabscategories = [
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

 