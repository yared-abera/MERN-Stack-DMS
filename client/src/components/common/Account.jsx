import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { useState } from "react";
import EditAccount from "./EditAccount";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useDispatch } from "react-redux";
import { ComparePasswordAndUpdate } from "@/store/user-slice/userSlice";
import { toast } from "sonner";

export default function AccountPage({ ThisUser }) {
  const dispatch = useDispatch();

  const [viewDetial, setViewDetial] = useState(false);
  const [EditDialog, setEditDialog] = useState(false);
  const [PasswordIsNotMatch, setPasswordIsNotMatch] = useState(false);

  const [Password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function HandleViewDetail() {
    setViewDetial(!viewDetial);
  }

  function HandleEdit() {
    setEditDialog(!EditDialog);
  }

  function HandleChangePassword() {
    const id = ThisUser._id;
    if (Password.newPassword !== Password.confirmPassword) {
      setPasswordIsNotMatch(true);
      Password.confirmPassword = "";
      Password.currentPassword = "";
      Password.newPassword = "";
    } else {
      setPasswordIsNotMatch(false);
      dispatch(ComparePasswordAndUpdate({ Password, id })).then((data) => {
        if (data?.payload.success) {
          toast.success(`${data?.payload?.message}`);
        } else {
          toast.error(`${data?.payload?.message}`);
        }
      });
    }
  }

  return (
    <div className="w-full min-h-screen  mt-20 overflow-hidden">
      <div className="flex flex-col gap-2 p-4   ">
        <div className="flex flex-col items-center border-solid shadow-md mt-8">
          <h1>My profile</h1>

          <div className="m-4 flex items-center justify-around w-full">
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-full bg-black w-24 h-24 dark:bg-white "></div>
              <div>
                <p>Bio:</p>
              </div>
            </div>

            <Button>edit</Button>
          </div>
        </div>

        <div className="border border-gray-200 shadow-md mt-8 rounded-lg p-4">
          <div className="flex w-full my-4 ">
            <div className="flex items-center justify-end w-1/2">
              <h1 className="place-content-center text-lg md:text-xl font-bold">
                Personal Information
              </h1>
            </div>
            <div className="flex justify-end w-1/2">
              <Button className="mr-4" onClick={() => HandleEdit()}>
                edit
              </Button>
            </div>
          </div>
          <div className="space-y-4 w-[40%]  mx-auto">
            <div className="flex justify-between">
              <span className="font-medium">First Name:</span>
              <span>{ThisUser.fName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Middle Name:</span>
              <span>{ThisUser.mName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Last Name:</span>
              <span>{ThisUser.lName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Email:</span>
              <span>{ThisUser.email}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">User Name:</span>
              <span>{ThisUser.userName}</span>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => HandleViewDetail()}>View Detail</Button>
          </div>
        </div>

        <div className="border-solid border-2 px-6 py-3 flex flex-col gap-6 ">
          <div>
            <h1 className="text-lg md:text-xl font-bold">Change Password</h1>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Current Password:</Label>
            <div className="flex items-center">
              <Input
                className="text-sm md:text-base"
                Placeholder="Enter Your current Password"
                type={showCurrentPassword ? "text" : "password"}
                value={Password.currentPassword}
                onChange={(e) =>
                  setPassword({
                    ...Password,
                    currentPassword: e.target.value,
                  })
                }
              />
              <span
                className="ml-[-5vh] cursor-pointer"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                👁️
              </span>
            </div>
          </div>

          <div className="flex flex-col mt-2 gap-2">
            <Label>New Password:</Label>
            <div className="flex items-center">
              <Input
                className="text-sm md:text-base"
                Placeholder="Enter Your New Password"
                type={showNewPassword ? "text" : "password"}
                value={Password.newPassword}
                onChange={(e) =>
                  setPassword({
                    ...Password,
                    newPassword: e.target.value,
                  })
                }
              />
              <span
                className="ml-[-5vh] cursor-pointer"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                👁️
              </span>
            </div>

            {PasswordIsNotMatch ? (
              <p className="text-red-700 ">The Password is not match</p>
            ) : null}
          </div>

          <div className="flex flex-col mt-2 gap-2">
            <Label>Confirm Password:</Label>
            <div className="flex items-center">
              <Input
                className="text-sm md:text-base"
                Placeholder="Enter again New Password"
                type={showConfirmPassword ? "text" : "password"}
                value={Password.confirmPassword}
                onChange={(e) =>
                  setPassword({
                    ...Password,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <span
                className="ml-[-5vh] cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                👁️
              </span>
            </div>
            {PasswordIsNotMatch ? (
              <p className="text-red-700 ">The Password is not match</p>
            ) : null}
          </div>

          <div className="w-full flex justify-end py-4 ">
            <Button
              className="mr-4 "
              disabled={!Object.values(Password).every((pass) => pass !== "")}
              onClick={() => HandleChangePassword()}
            >
              Change
            </Button>
          </div>
        </div>

        <div className="w-full  border-solid shadow-md mt-8 px-7">
          <div>
            <div className="flex justify-between items-start">
              <h1>Address & contact </h1>
              <Button>edit</Button>
            </div>

            <div className="grid grid-cols-2 gap-1 w-full">
              <p>country:</p>
              <p>addis</p>
              <p>city</p>
              <p>wolkite</p>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-1 w-full">
              <p>Phone:</p>
              <p>0912344</p>
              <p>facebook</p>
              <p>faceBook</p>
              <p>twiter</p>
              <p>Twiter</p>
              <p>telegram</p>
              <p>telegram</p>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={viewDetial} onOpenChange={() => HandleViewDetail()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Detail Information</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="space-y-4 w-[40%]  mx-auto">
              <div className="flex justify-between">
                <span className="font-medium">First Name:</span>
                <span>{ThisUser.fName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Middle Name:</span>
                <span>{ThisUser.mName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Last Name:</span>
                <span>{ThisUser.lName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{ThisUser.email}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">User Name:</span>
                <span>{ThisUser.userName}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Sex:</span>
                <span>{ThisUser.gender}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Role:</span>
                <span>{ThisUser.role}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Phone:</span>
                <span>{ThisUser.phoneNum}</span>
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      {EditDialog ? (
        <EditAccount
          ThisUser={ThisUser}
          HandleEdit={HandleEdit}
          EditDialog={EditDialog}
        />
      ) : null}
    </div>
  );
}
