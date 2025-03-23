// import AccountPage from "@/components/common/Account";
// import { Button } from "@/components/ui/button";

// export default function Account() {
//   return (
//      <AccountPage/>
//   );
// }



import AccountPage from "@/components/common/Account";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleUser } from "@/store/user-slice/userSlice";

export default function AdminAccount() {
  const { user } = useSelector((state) => state.auth);
  const [ThisUser, setThisUser] = useState({});
  const dispatch = useDispatch();

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
