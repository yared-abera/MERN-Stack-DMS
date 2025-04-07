import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUser } from "@/store/user-slice/userSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { isLoading, AllUser } = useSelector((state) => state.allUser);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    // Fetch all users when the component mounts
    dispatch(getAllUser());
  }, [dispatch]);

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

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen">
      <div className="mx-auto mt-2 flex items-center justify-center flex-col">
        <h2 className="font-sans font-bold sm:text-xl sm:px-6 md:text-2xl pl-14">
          WOLKITE UNIVERSITY
        </h2>
        <h1 className="font-sans font-bold sm:text-2xl md:text-3xl">
          DORMITORY MANAGEMENT SYSTEM
        </h1>
      </div>
      <div className="flex-1 flex-col w-full p-10">
        <div className="flex items-center justify-center flex-col">
          <h1 className="my-6 text-xl font-bold font-sans">
            Recently Created Accounts
          </h1>
          <div className="flex flex-wrap gap-4 w-full justify-center">
            {isLoading ? (
              <p>Loading users...</p>
            ) : recentUsers.length > 0 ? (
              recentUsers.map((user, index) => (
                <Card key={index} className="w-64 shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{getInitials(user.fName, user.lName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{user.fName} {user.lName}</CardTitle>
                        <p className="text-sm text-gray-500">{user.role}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Username:</span> {user.userName}</p>
                      <p><span className="font-medium">Email:</span> {user.email}</p>
                      <p><span className="font-medium">Phone:</span> {user.phoneNum}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No users found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
