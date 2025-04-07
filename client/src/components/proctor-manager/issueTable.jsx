import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { GetAllMaintainanceIssue } from "@/store/maintenanceIssue/maintenanceIssue";
import { Button } from "../ui/button";

export default function IssueTableMaintenanace({ AllMaintainanceIssue }) {
  // const { user } = useSelector((state) => state.auth);
  const [openDialog, setDialog] = useState(false);
  const [userData, setUserData] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [verifiedId, setVerifiedId] = useState({});
  const dispatch = useDispatch();
  function handleViewDetail(id) {
    const viewIssue = AllMaintainanceIssue.data.find(
      (issue) => issue._id === id
    );

    setUserData(viewIssue);
    setDialog(true);
  }

  function handleRemoveDialog() {
    setUserData("");
    setDialog(false);
  }

  function HandleChangeStatus(id, value, issue) {
    setVerifiedId({ id, value, issue });
    setOpenAlert(true);
  }
  function HandleContinue(id) {
    dispatch(VerificationIssue(id)).then((data) => {
      if (data.payload.success) {
        const gender = capitalizeFirstLetter(user.sex);
        dispatch(GetAllMaintainanceIssue(gender));
        toast.success("👍 Status Updated Successfully");
      }
    });
  }

  console.log(AllMaintainanceIssue, "AllMaintainanceIssue");

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Middle Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Block</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Issue Types</TableHead>
            <TableHead>Date Reported</TableHead>
            <TableHead>View Detail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {AllMaintainanceIssue?.data?.map((issue, index) => (
            <TableRow key={index}>
              {/* Access userInfo properties correctly */}
              <TableCell>{issue.userInfo.fName}</TableCell>
              <TableCell>{issue.userInfo.mName}</TableCell>
              <TableCell>{issue.userInfo.lName}</TableCell>
              <TableCell>{issue.userInfo.userName}</TableCell>
              <TableCell>{issue.userInfo.blockNumber}</TableCell>
              <TableCell>{issue.userInfo.roomNumber}</TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      View Issues ({issue.issueTypes.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {issue.issueTypes.map((type, idx) => (
                      <DropdownMenuItem key={idx}>
                        {type.issue}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>

              <TableCell>
                {new Date(issue.createdAt).toLocaleDateString()}
              </TableCell>

              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => handleViewDetail(issue._id)}
                >
                  👀
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {userData !== "" ? (
        <Dialog open={openDialog} onOpenChange={() => handleRemoveDialog()}>
          <DialogContent className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-screen overflow-y-auto ">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-semibold text-gray-800">
                View Maintenance Issue Detail
              </DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <div className="flex flex-col gap-4">
                {/* User Information Section */}
                <div className="border rounded-md p-4">
                  <h2 className="text-lg font-bold text-gray-700 mb-2">
                    User Information
                  </h2>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    <div>
                      <span className="font-medium text-gray-600">
                        First Name:
                      </span>
                    </div>
                    <div>{userData.userInfo.fName}</div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Middle Name:
                      </span>
                    </div>
                    <div>{userData.userInfo.mName}</div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Last Name:
                      </span>
                    </div>
                    <div>{userData.userInfo.lName}</div>
                    <div>
                      <span className="font-medium text-gray-600">
                        User Name:
                      </span>
                    </div>
                    <div>{userData.userInfo.userName}</div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Block Number:
                      </span>
                    </div>
                    <div>{userData.userInfo.blockNumber}</div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Dorm Number:
                      </span>
                    </div>
                    <div>{userData.userInfo.roomNumber}</div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Phone Number:
                      </span>
                    </div>
                    <div>{userData.userInfo.phoneNumber}</div>
                  </div>
                </div>

                {/* Separator (optional, but can be visually improved) */}
                <div className="border-t my-2 border-gray-300"></div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    Issue Submitted
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2  gap-2  ">
                    {userData.issueTypes.map((item, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <h3 className="font-semibold text-gray-600 mb-1">
                          Issue #{index + 1}
                        </h3>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                          <div>
                            <span className="font-medium text-gray-500">
                              Issue Type:
                            </span>
                          </div>
                          <div>{item.issue}</div>
                          <div>
                            <span className="font-medium text-gray-500">
                              Issue Status:
                            </span>
                          </div>
                          <div>
                            <span
                              className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded ${
                                item.status === "pending"
                                  ? "bg-yellow-200 text-yellow-800"
                                  : item.status === "resolved"
                                  ? "bg-green-200 text-green-800"
                                  : "bg-red-200 text-red-800" // Add more status colors as needed
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-500 block">
                              Description:
                            </p>
                          </div>
                          <div className="text-sm">{item.description}</div>
                          <div>
                            <span className="font-medium text-gray-500">
                              Created At:
                            </span>
                          </div>
                          <div className="text-sm">
                            {new Date(item.createdAt).toLocaleString()}
                          </div>{" "}
                          {/* Format the date */}
                        </div>

                        {item.status === "verified" ? (
                          <div className="mt-4 border-t border-gray-300">
                            <h1 className="text-lg font-semibold">
                              Change The Status
                            </h1>
                            <div className="flex flex-col gap-2 mt-4">
                              <div className="flex  flex-col  ">
                                <Label className="text-sm text-violet-900">
                                  Change the status to Inprogress :
                                </Label>
                                <input
                                  className=" mt-[-15px] ml-4"
                                  type="radio"
                                  name={`action-${item._id}`}
                                  value="InProgress"
                                  checked={
                                    verifiedId.id === item._id &&
                                    verifiedId.value === "InProgress"
                                  }
                                  onChange={(e) =>
                                    HandleChangeStatus(
                                      item._id,
                                      e.target.value,
                                      item.issue
                                    )
                                  }
                                />
                              </div>

                              <div className="flex flex-col">
                                <Label className="text-sm text-green-700">
                                  Pass the issue to System Admin:
                                </Label>
                                <input
                                  className="mt-[-12px]  ml-[-14px]"
                                  type="radio"
                                  name={`action-${item._id}`}
                                  value="Pass"
                                  checked={
                                    verifiedId.id === item._id &&
                                    verifiedId.value === "Pass"
                                  }
                                  onChange={(e) =>
                                    HandleChangeStatus(
                                      item._id,
                                      e.target.value,
                                      item.issue
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <AlertDialog
                open={openAlert}
                onOpenChange={() => setOpenAlert(false)}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Changing the status of{" "}
                      <span className="text-violet-600 text-base font-semibold">
                        {verifiedId.issue}
                      </span>{" "}
                      Issue in to
                      <span className="text-blue-600 text-base font-semibold">
                        {" " + verifiedId.value === " Pass"
                          ? "Pass to System admin"
                          : "In Progress"}
                      </span>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to proceed with your action?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setVerifiedId({})}>
                      No
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => HandleContinue(verifiedId)}
                    >
                      Yes
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
