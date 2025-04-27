import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUser } from "@/store/user-slice/userSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import FooterPage from "@/components/common/FooterPage";
import { AddRecentlySearchedUser, getRecentlySearchedUser, SearchedUsers } from "@/store/common/data";
import { Badge, CalendarIcon, Mail, MailIcon, User2Icon, UserIcon, Building2, Wrench, Users2, Percent } from "lucide-react";
 
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
  const { user } = useSelector((state) => state.auth);
   
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
}
