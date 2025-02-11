import {  LayoutDashboard,   MessageSquareShareIcon,   Settings,   } from "lucide-react"
 

export const logInForm=[
    {
        name:'userName',
        label:'User Name',
        placeholder:'Enter User Name',
        type:'text',
        componentType: 'input',

    },
    {
        name:'password',
        label:'Password',
        placeholder:'Enter Password',
        type:'password',
        componentType: 'input',

    },
]


export const adminSideBar=[
    {
        id:1,
        label:'Dashbord',
        path:'/admin/dashbord',
        icon: LayoutDashboard,
        
    },
    {
        id:2,
        label:'Manage Account',
        path:'/admin/manage',
        icon:MessageSquareShareIcon
        
    },
    {
        id:3,
        label:'setting',
        path:'/admin/setting',
        icons:Settings
        
    }
]