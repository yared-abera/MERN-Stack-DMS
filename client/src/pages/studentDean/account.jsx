import AccountPage from "@/components/common/Account";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleUser } from "@/store/user-slice/userSlice";
 
export default function StudDeanAccount() {
  const { user } = useSelector((state) => state.auth);
  const [ThisUser, setThisUser] = useState({});
  const dispatch = useDispatch();

  
console.log(ThisUser,'from the component');

  useEffect(() => {
    if (user?.id) {
      dispatch(getSingleUser(user.id)).then((data) => {
        if (data.payload?.success) {
          setThisUser(data.payload.user);
        }
      });
    }
  }, [dispatch, user]);

  return ThisUser ? <AccountPage ThisUser={ThisUser} /> : null;
}
