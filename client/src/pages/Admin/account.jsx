import AccountPage from "@/components/common/Account";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleUser } from "@/store/user-slice/userSlice";

export default function AdminAccount() {
  const { user } = useSelector((state) => state.auth);
  const [ThisUser, setThisUser] = useState({});
  const dispatch = useDispatch();

  console.log("Auth user:", user);

  // Function to fetch user data
  const fetchUserData = useCallback(() => {
    if (user?.id) {
      console.log("Fetching user data for ID:", user.id);
      dispatch(getSingleUser(user.id)).then((data) => {
        console.log("User data response:", data);
        if (data.payload?.success) {
          setThisUser(data.payload.user);
        }
      });
    } else {
      console.log("No user ID available");
    }
  }, [dispatch, user]);

  // Initial fetch
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Listen for changes in the user data from Redux
  const { selectedUser } = useSelector((state) => state.allUser);
  console.log("Selected user from Redux:", selectedUser);
  
  useEffect(() => {
    if (selectedUser && selectedUser._id === user?.id) {
      console.log("Updating ThisUser from selectedUser");
      setThisUser(selectedUser);
    }
  }, [selectedUser, user]);

  console.log("ThisUser state:", ThisUser);

  // Always render the AccountPage component, even if ThisUser is empty
  return <AccountPage ThisUser={ThisUser} />;
}
