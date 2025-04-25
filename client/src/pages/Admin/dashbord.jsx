import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUser } from "@/store/user-slice/userSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import FooterPage from "@/components/common/FooterPage";
import { AddRecentlySearchedUser, getRecentlySearchedUser, SearchedUsers } from "@/store/common/data";
import { Badge, CalendarIcon, Mail, MailIcon, User2Icon, UserIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import img from '../../assets/img/University_logo.png'
import { motion } from "framer-motion";


export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { isLoading, AllUser } = useSelector((state) => state.allUser);
  const{user}=useSelector((state)=>state.auth)

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentSearchedUsers, setRecentSearchedUsers] = useState('');
  const [isUserFound,setIsUserFound]=useState(false)
  const {SearchUsers}=useSelector((state)=>state.Data)
  const {AllRecentlySearchedUser}=useSelector((state)=>state.Data)

  useEffect(() => {
    // Fetch all users when the component mounts
    dispatch(getAllUser());
    const role = "User";
    const id=user.id
    dispatch(getRecentlySearchedUser({role,id}))
  }, [dispatch]);


  // useEffect(()=>{
  //   if(SearchUsers!==''){
  //     console.log(SearchUsers,'SearchUsers');
  //     let filteredUsers=''
  //     if(AllRecentlySearchedUser.data.length>0){
  //      filteredUsers = AllRecentlySearchedUser.data.find(user => 
  //       user.userId.userName===SearchUsers)

        
      
  //     }
  //     // if(recentUsers.length>0){
  //     //   filteredUsers = recentUsers.find(user => 
  //     //     user.userName===SearchUsers)
  //     // }
  //     console.log(filteredUsers,'filteredUsers');
      
  //     if(filteredUsers!==''){
  //       setIsUserFound(true)
  //       setRecentSearchedUsers(filteredUsers);
  //       dispatch(SearchedUsers(""));
  //     }

  //     else{
  //       const role='User'
  //       console.log(role,'role');
  //       console.log(SearchUsers,'SearchUsers on else');
  //       dispatch(AddRecentlySearchedUser({userName:SearchUsers,role})).then((res)=>{
  //         if(res.payload.success){
  //           console.log(res.payload.data,'res.payload.data');
  //           setIsUserFound(true)
  //           setRecentSearchedUsers(res.payload.data)
  //           dispatch(getRecentlySearchedUser(role))
  //         }
          
  //       })


  //       dispatch(SearchedUsers(""));
      
  //     }


 

  //   }  
    
  // },[SearchUsers])


  useEffect(() => {
    if (SearchUsers !== '') {
      console.log(SearchUsers, 'SearchUsers');
      let filteredUsers;
  
      if (AllRecentlySearchedUser.data && AllRecentlySearchedUser.data.length > 0) {
        filteredUsers = AllRecentlySearchedUser.data.find(user =>
          user.userId && user.userId.userName === SearchUsers
        );
      }
  
      console.log(filteredUsers, 'filteredUsers');
  
      if (filteredUsers) {
        setIsUserFound(true);
        setRecentSearchedUsers(filteredUsers);
        dispatch(SearchedUsers(""));
      } else {
        const role = 'User';
         const id=user.id
     
        dispatch(AddRecentlySearchedUser({ userName: SearchUsers, role,id })).then((res) => {
          if (res.payload && res.payload.success) {
            console.log(res.payload.data, 'res.payload.data');
            setIsUserFound(true);
            setRecentSearchedUsers(res.payload.data);
            dispatch(getRecentlySearchedUser({role,id}));
          }
        });
      }
  
      // Consider moving this dispatch based on your application's logic
      // dispatch(SearchedUsers(""));
    }
  }, [SearchUsers]);

  
  useEffect(() => {
    // Update recent users when AllUser data changes
    if (AllUser && AllUser.success && AllUser.data) {
      // Get the 5 most recent users
      const recent = [...AllUser.data].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      ).slice(0, 5);
      setRecentUsers(recent);
    }
  }, [AllUser]);

  // Function to get initials from name
  const getInitials = (fName, lName) => {
    return `${fName ? fName.charAt(0) : ''}${lName ? lName.charAt(0) : ''}`;
  };

  function HandleRecentUserDialog() {
    setIsUserFound(false);
    setRecentSearchedUsers("");
    dispatch(SearchedUsers(""));
  }


  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="w-full max-w-6xl mt-8 mx-4 sm:mx-6 lg:mx-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden">
        
        {/* Header */}
        {/* <div className="text-center py-8">
          <img src={img} alt="University Logo" className="mx-auto w-24 sm:w-32 md:w-40 mb-4" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
            Dormitory Management System
          </h1>
        </div> */}


            
   <div className="mx-auto m-4 flex items-center justify-center flex-col">
       
              <div className="flex items-center justify-center mt-5">
             <img src={img} alt="University"   />
               </div>
              <h1 className="font-sans font-bold sm:text-2xl md:text-3xl  mt-3">
               DORMITORY MANAGEMENT SYSTEM
             </h1>
           </div>
  
        <div className="px-6 sm:px-10 pb-10">
          
          {/* Recently Searched Users */}
          <section className="mb-12">
            <h2 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6 text-center">
              Recently Searched Users
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {AllRecentlySearchedUser?.success &&
                AllRecentlySearchedUser.data.map((student) => {
                  const { fName, mName, lName, userName, email } = student.userId;
                  const fullName = `${fName} ${mName} ${lName}`;
                  return (
                    <div
                      key={student._id}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-transparent hover:border-indigo-400 shadow-md hover:shadow-xl transition overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-white text-indigo-600 font-bold flex items-center justify-center shadow">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-white text-lg font-semibold">{fullName}</h3>
                          <p className="text-indigo-200 text-sm opacity-90">@{userName}</p>
                        </div>
                      </div>
                      <div className="p-4 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                        <div className="flex items-center gap-2">
                          <MailIcon className="h-4 w-4" /> {email}
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          {new Date(student.timestamp).toLocaleDateString()} • {new Date(student.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="px-4 pb-4">
                        <button
                          onClick={() => {
                            setRecentSearchedUsers(student);
                            setIsUserFound(true);
                          }}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
  
          {/* Recently Created Accounts */}
          <hr/>
          <section>
            <h2 className="text-lg md:text-xl  font-semibold text-gray-700 dark:text-gray-200 mb-6 text-center">
              Recently Created Accounts
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {isLoading ? (
                <p className="text-center text-gray-500">Loading users...</p>
              ) : recentUsers.length > 0 ? (
                recentUsers.map((user, idx) => (
                  <div
                    key={idx}
                    className="w-64 bg-white dark:bg-gray-800 rounded-xl border border-transparent hover:border-indigo-400 shadow-md hover:shadow-xl transition overflow-hidden"
                  >
                    <CardHeader className="p-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback className="bg-indigo-200 text-indigo-700">
                            {getInitials(user.fName, user.lName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg font-semibold">
                            {user.fName} {user.lName}
                          </CardTitle>
                          <p className="text-sm text-gray-500">{user.role}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <p>
                        <span className="font-medium">Username:</span> {user.userName}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {user.email}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span> {user.phoneNum}
                      </p>
                    </CardContent>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No users found</p>
              )}
            </div>
          </section>
        </div>
  
        {/* Detail Dialog */}
        {recentSearchedUsers && isUserFound && (
          <Dialog open={isUserFound} onOpenChange={HandleRecentUserDialog}>
            <DialogContent className="sm:max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              <DialogHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                <DialogTitle className="text-white text-lg font-semibold">
                  Recently Searched Student
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center -mt-8">
                <div className="h-16 w-16 rounded-full bg-indigo-200 dark:bg-indigo-700 flex items-center justify-center text-indigo-700 dark:text-indigo-200 font-bold text-xl shadow-lg">
                  {recentSearchedUsers.userId.Fname?.charAt(0) || "?"}
                </div>
                <h3 className="mt-3 text-xl font-medium text-gray-900 dark:text-gray-100 text-center">
                  {recentSearchedUsers.userId.Fname} {recentSearchedUsers.userId.Mname} {recentSearchedUsers.userId.Lname}
                </h3>
              </div>
              <DialogDescription className="px-6 py-4 space-y-3 text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <User2Icon className="h-5 w-5" />
                  <span>
                    {recentSearchedUsers.userId.fNname} {recentSearchedUsers.userId.mName} {recentSearchedUsers.userId.lNname}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  <span>@{recentSearchedUsers.userId.userName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  <span>{recentSearchedUsers.userId.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="h-5 w-5" />
                  <span>{recentSearchedUsers.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>
                    {new Date(recentSearchedUsers.timestamp).toLocaleDateString()} • {new Date(recentSearchedUsers.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </DialogDescription>
              <DialogFooter className="px-6 pb-6 flex justify-end">
                <DialogClose asChild>
                  <button
                    onClick={HandleRecentUserDialog}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  >
                    Close
                  </button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
  
        {/* Footer */}
        <FooterPage />
      </div>
    </div>
  );
  
  // return (
  //   <div className="flex flex-col items-center w-full min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100">
  //     <div className="w-full max-w-6xl mt-8 mx-4 sm:mx-6 lg:mx-8 py-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
  
  //       {/* ——— Header ——— */}
  //       <div className="text-center mb-12">
  //         <motion.img
  //           src={img}
  //           alt="University Logo"
  //           className="mx-auto w-24 sm:w-28 md:w-32"
  //           initial={{ scale: 0 }}
  //           animate={{ scale: 1 }}
  //           transition={{ type: "spring", stiffness: 120, damping: 12 }}
  //         />
  //         <motion.h1
  //           className="mt-4 text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight"
  //           initial={{ opacity: 0, y: -20 }}
  //           animate={{ opacity: 1, y: 0 }}
  //           transition={{ delay: 0.2 }}
  //         >
  //           Dormitory Management System
  //         </motion.h1>
  //       </div>
  
  //       {/* ——— Recently Searched Users ——— */}
  //       <section className="mb-16">
  //         <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
  //           Recently Searched Users
  //         </h2>
  //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  //           {AllRecentlySearchedUser?.success &&
  //             AllRecentlySearchedUser.data.map((student) => {
  //               const { fName, mName, lName, userName, email } = student.userId;
  //               const fullName = `${fName} ${mName} ${lName}`;
  
  //               return (
  //                 <motion.div
  //                   key={student._id}
  //                   className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-transparent hover:border-indigo-400 overflow-hidden transition"
  //                   initial={{ opacity: 0, y: 20 }}
  //                   animate={{ opacity: 1, y: 0 }}
  //                   transition={{ duration: 0.4 }}
  //                   whileHover={{ scale: 1.03 }}
  //                 >
  //                   <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex items-center gap-3">
  //                     <div className="h-12 w-12 rounded-full bg-white text-indigo-600 font-bold flex items-center justify-center shadow">
  //                       {userName.charAt(0).toUpperCase()}
  //                     </div>
  //                     <div>
  //                       <h3 className="text-white text-lg font-semibold">{fullName}</h3>
  //                       <p className="text-indigo-200 text-sm opacity-90">@{userName}</p>
  //                     </div>
  //                   </div>
  //                   <div className="p-4 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
  //                     <div className="flex items-center gap-2">
  //                       <MailIcon className="h-4 w-4" /> {email}
  //                     </div>
  //                     <div className="flex items-center gap-2">
  //                       <CalendarIcon className="h-4 w-4" />
  //                       {new Date(student.timestamp).toLocaleDateString()} •{" "}
  //                       {new Date(student.timestamp).toLocaleTimeString()}
  //                     </div>
  //                   </div>
  //                   <div className="px-4 pb-4">
  //                     <motion.button
  //                       onClick={() => {
  //                         setRecentSearchedUsers(student);
  //                         setIsUserFound(true);
  //                       }}
  //                       className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
  //                       whileTap={{ scale: 0.95 }}
  //                     >
  //                       View Details
  //                     </motion.button>
  //                   </div>
  //                 </motion.div>
  //               );
  //             })}
  //         </div>
  //       </section>
  
  //       {/* ——— Recently Created Accounts ——— */}
  //       <section className="mb-16">
  //         <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-6 text-center">
  //           Recently Created Accounts
  //         </h2>
  //         <div className="flex flex-wrap justify-center gap-6">
  //           {isLoading ? (
  //             <p className="text-gray-500">Loading users...</p>
  //           ) : recentUsers.length > 0 ? (
  //             recentUsers.map((user, idx) => (
  //               <motion.div
  //                 key={idx}
  //                 className="w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-transparent hover:border-indigo-400 transition overflow-hidden"
  //                 initial={{ opacity: 0, y: 20 }}
  //                 animate={{ opacity: 1, y: 0 }}
  //                 transition={{ delay: idx * 0.1 }}
  //                 whileHover={{ scale: 1.03 }}
  //               >
  //                 <CardHeader className="pb-2">
  //                   <div className="flex items-center space-x-4">
  //                     <Avatar>
  //                       <AvatarFallback className="bg-indigo-200 text-indigo-700">
  //                         {getInitials(user.fName, user.lName)}
  //                       </AvatarFallback>
  //                     </Avatar>
  //                     <div>
  //                       <CardTitle className="text-lg font-semibold">
  //                         {user.fName} {user.lName}
  //                       </CardTitle>
  //                       <p className="text-sm text-gray-500">{user.role}</p>
  //                     </div>
  //                   </div>
  //                 </CardHeader>
  //                 <CardContent>
  //                   <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
  //                     <p>
  //                       <span className="font-medium">Username:</span> {user.userName}
  //                     </p>
  //                     <p>
  //                       <span className="font-medium">Email:</span> {user.email}
  //                     </p>
  //                     <p>
  //                       <span className="font-medium">Phone:</span> {user.phoneNum}
  //                     </p>
  //                   </div>
  //                 </CardContent>
  //               </motion.div>
  //             ))
  //           ) : (
  //             <p className="text-gray-500">No users found</p>
  //           )}
  //         </div>
  //       </section>
  
  //       {/* ——— Detail Dialog ——— */}
  //       {recentSearchedUsers && isUserFound && (
  //         <Dialog open={isUserFound} onOpenChange={HandleRecentUserDialog}>
  //           <DialogContent className="sm:max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
  //             <DialogHeader className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4">
  //               <DialogTitle className="text-white text-lg font-semibold">
  //                 Recently Searched Student
  //               </DialogTitle>
  //             </DialogHeader>
  
  //             <div className="flex flex-col items-center -mt-8">
  //               <div className="h-16 w-16 rounded-full bg-indigo-200 dark:bg-indigo-700 flex items-center justify-center text-indigo-700 dark:text-indigo-200 font-bold text-xl shadow-lg">
  //                 {recentSearchedUsers.userId.Fname?.charAt(0) || "?"}
  //               </div>
  //               <h3 className="mt-3 text-xl font-medium text-gray-900 dark:text-gray-100 text-center">
  //                 {recentSearchedUsers.userId.Fname}{" "}
  //                 {recentSearchedUsers.userId.Mname}{" "}
  //                 {recentSearchedUsers.userId.Lname}
  //               </h3>
  //             </div>
  
  //             <DialogDescription className="px-6 py-4 space-y-3 text-gray-700 dark:text-gray-300">
  //               <div className="flex items-center gap-2">
  //                 <User2Icon className="h-5 w-5" />
  //                 <span>
  //                   {recentSearchedUsers.userId.fNname}{" "}
  //                   {recentSearchedUsers.userId.mName}{" "}
  //                   {recentSearchedUsers.userId.lNname}
  //                 </span>
  //               </div>
  //               <div className="flex items-center gap-2">
  //                 <UserIcon className="h-5 w-5" />
  //                 <span>@{recentSearchedUsers.userId.userName}</span>
  //               </div>
  //               <div className="flex items-center gap-2">
  //                 <Mail className="h-5 w-5" />
  //                 <span>{recentSearchedUsers.userId.email}</span>
  //               </div>
  //               <div className="flex items-center gap-2">
  //                 <Badge className="h-5 w-5" />
  //                 <span>{recentSearchedUsers.role}</span>
  //               </div>
  //               <div className="flex items-center gap-2">
  //                 <CalendarIcon className="h-5 w-5" />
  //                 <span>
  //                   {new Date(recentSearchedUsers.timestamp).toLocaleDateString()} •{" "}
  //                   {new Date(recentSearchedUsers.timestamp).toLocaleTimeString()}
  //                 </span>
  //               </div>
  //             </DialogDescription>
  
  //             <DialogFooter className="px-6 pb-6 flex justify-end">
  //               <motion.button
  //                 onClick={HandleRecentUserDialog}
  //                 className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
  //                 whileHover={{ scale: 1.05 }}
  //               >
  //                 Close
  //               </motion.button>
  //             </DialogFooter>
  //           </DialogContent>
  //         </Dialog>
  //       )}
  
  //       {/* ——— Footer ——— */}
  //       <FooterPage />
  //     </div>
  //   </div>
  // );
  
//    return (
//     <div className="flex flex-col justify-center items-center w-full min-h-screen">
//       <div className="flex items-center justify-center w-full flex-col mt-3 ml-3 mr-3 border-2  rounded-md shadow-md shadow-black">


//       <div className="flex-1 flex-col w-full p-10">
//         <div className="flex items-center justify-center flex-col">

//              <div className="w-full m-5">
//              <h1 className="my-6 text-xl font-bold font-sans text-center">
//             Recently Searched  Users
//           </h1>
//           <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 z-[-3px]">
       
//             {AllRecentlySearchedUser?.success &&
//               AllRecentlySearchedUser.data.map((student) => {
//                 const { fName, mName, lName, userName, email } = student.userId;
//                 const fullName = `${fName} ${mName} ${lName}`;

//                 return (
//                   <div
//                     key={student._id}
//                     className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition duration-300"
//                   >
//                     {/* Header with gradient accent */}
//                     <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 flex items-center gap-3">
//                       {/* Placeholder avatar with initials */}
//                       <div className="h-12 w-12 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-semibold">
//                         {userName.charAt(0)}
//                       </div>
//                       <div>
//                         <h3 className="text-white text-lg font-semibold leading-tight">
//                           {fullName}
//                         </h3>
//                         <p className="text-indigo-200 text-sm">@{userName}</p>
//                       </div>
//                     </div>

//                     {/* Body */}
//                     <div className="p-4 space-y-3">
//                       <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm">
//                         <MailIcon className="h-4 w-4 mr-2" />
//                         <span>{email}</span>
//                       </div>
//                       <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm">
//                         <CalendarIcon className="h-4 w-4 mr-2" />
//                         <span>
//                           {new Date(student.timestamp).toLocaleDateString()}{" "}
//                           {new Date(student.timestamp).toLocaleTimeString()}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Footer buttons */}
//                     <div className="px-4 pb-4 flex gap-3">
//                       {/* <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded">
//                         Remove
//                       </button> */}
//                       <button onClick={()=>{setRecentSearchedUsers(student)
//                         setIsUserFound(true)
//                       }} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded">
//                         View Details
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//           </div>

//              </div>
        
//           <h1 className="my-6 text-xl font-bold font-sans text-center">
//             Recently Created Accounts
//           </h1>
//           <div className="flex flex-wrap gap-4 w-full justify-center">
//             {isLoading ? (
//               <p>Loading users...</p>
//             ) : recentUsers.length > 0 ? (
//               recentUsers.map((user, index) => (
//                 <Card key={index} className="w-64 shadow-md">
//                   <CardHeader className="pb-2">
//                     <div className="flex items-center space-x-4">
//                       <Avatar>
//                         <AvatarFallback>{getInitials(user.fName, user.lName)}</AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <CardTitle className="text-lg">{user.fName} {user.lName}</CardTitle>
//                         <p className="text-sm text-gray-500">{user.role}</p>
//                       </div>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-1 text-sm">
//                       <p><span className="font-medium">Username:</span> {user.userName}</p>
//                       <p><span className="font-medium">Email:</span> {user.email}</p>
//                       <p><span className="font-medium">Phone:</span> {user.phoneNum}</p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))
//             ) : (
//               <p>No users found</p>
//             )}
//           </div>


        


//         </div>
//       </div>

//       { recentSearchedUsers &&
//          recentSearchedUsers != "" &&
//          isUserFound && (
//           <Dialog
//             open={isUserFound}
//             onOpenChange={() => HandleRecentUserDialog()}
//           >
//             <DialogContent className="sm:max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
//               {/* Header */}
//               <DialogHeader className="flex items-center justify-between bg-gradient-to-br from-indigo-600 to-purple-600 p-4">
//                 <DialogTitle className="text-white text-lg font-semibold">
//                   Recently Searched Student
//                 </DialogTitle>
//               </DialogHeader>

//               {/* Avatar & Name */}
//               <div className="flex flex-col items-center -mt-8">
//                 <div
//                   className="
//     h-16 w-16 rounded-full
//     bg-indigo-200 dark:bg-indigo-700
//     flex items-center justify-center
//     text-indigo-700 dark:text-indigo-200
//     font-bold text-xl shadow-lg
//   "
//                 >
//                   { recentSearchedUsers.userId.Fname?.charAt(0) || "?"}
//                 </div>
//                 <h3 className="mt-3 text-xl font-medium text-gray-900 dark:text-gray-100">
//                   { recentSearchedUsers.userId.Fname}{" "}
//                   { recentSearchedUsers.userId.Mname}{" "}
//                   { recentSearchedUsers.userId.Lname}
//                 </h3>
//               </div>

//               {/* Body */}
//               <DialogDescription className="px-6 py-4 space-y-3 text-gray-700 dark:text-gray-300">
//                 <div className="flex items-center gap-2">
//                   <User2Icon className="h-5 w-5" />
//                   <span>
//                     { recentSearchedUsers.userId.fNname}{" "}
//                     { recentSearchedUsers.userId.mName}{" "}
//                     { recentSearchedUsers.userId.lNname}
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <UserIcon className="h-5 w-5" />
//                   <span>@{ recentSearchedUsers.userId.userName}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Mail className="h-5 w-5" />
//                   <span>{ recentSearchedUsers.userId.email}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Badge className="h-5 w-5" />
//                   <span>{ recentSearchedUsers.role}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <CalendarIcon className="h-5 w-5" />
//                   <span>
//                     {new Date(
//                        recentSearchedUsers.timestamp
//                     ).toLocaleDateString()}{" "}
//                     {new Date(
//                        recentSearchedUsers.timestamp
//                     ).toLocaleTimeString()}
//                   </span>
//                 </div>
//               </DialogDescription>

//               {/* Footer */}
//               <DialogFooter className="px-6 pb-6 flex justify-end gap-3">
//                 <DialogClose asChild>
//                   <button
//                     className="
//       px-4 py-2 bg-gray-200 dark:bg-gray-700
//       text-gray-800 dark:text-gray-200
//       rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600
//       transition
//     "
//                     onClick={() => HandleRecentUserDialog()}
//                   >
//                     Close
//                   </button>
//                 </DialogClose>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         )}
//       <FooterPage/>
//       {/* <div className="flex flex-col justify-center items-center w-full min-h-screen">
         
//       </div> */}

// </div>
//     </div>
//   );
}
