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
import { useDispatch, useSelector } from "react-redux";
import { GetAllMaintainanceIssue, VerificationIssue } from "@/store/maintenanceIssue/maintenanceIssue";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Eye, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function IssueTableMaintenanace({ AllMaintainanceIssue,userRole }) {
  const { user } = useSelector(state=> state.auth);
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

  function HandleChangeStatus(id, value, status) {
    console.log(id, value, status, "id, value, issue");
    setVerifiedId({ id, value, status });
    setOpenAlert(true);
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
console.log(user,"user");

  function HandleContinue(id) {
    dispatch(VerificationIssue(id)).then((data) => {
      if (data.payload.success) {
        const sex=user.sex
        const gender = capitalizeFirstLetter(sex);
        dispatch(GetAllMaintainanceIssue(gender));
        toast.success("👍 Status Updated Successfully");
      }
    });
    console.log(id, "id");
  }

  console.log(AllMaintainanceIssue, "AllMaintainanceIssue");

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800/50">
            <TableHead className="font-semibold">First Name</TableHead>
            <TableHead className="font-semibold">Middle Name</TableHead>
            <TableHead className="font-semibold">Last Name</TableHead>
            <TableHead className="font-semibold">User Name</TableHead>
            <TableHead className="font-semibold">Block</TableHead>
            <TableHead className="font-semibold">Room</TableHead>
            <TableHead className="font-semibold">Issue Types</TableHead>
            <TableHead className="font-semibold">Date Reported</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {AllMaintainanceIssue?.data?.map((issue, index) => (
            <TableRow 
              key={index}
              className={cn(
                "transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50",
                index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
              )}
            >
              <TableCell className="font-medium">{issue.userInfo.fName}</TableCell>
              <TableCell>{issue.userInfo.mName}</TableCell>
              <TableCell>{issue.userInfo.lName}</TableCell>
              <TableCell className="font-medium text-blue-600">{issue.userInfo.userName}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-medium">
                  Block {issue.userInfo.blockNumber}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-medium">
                  Room {issue.userInfo.roomNumber}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <List className="h-4 w-4" />
                      <span>Issues ({issue.issueTypes.length})</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    {issue.issueTypes.map((type, idx) => (
                      <DropdownMenuItem key={idx} className="py-2">
                        <Badge variant="secondary" className="font-medium">
                          {type.issue}
                        </Badge>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-medium">
                  {new Date(issue.createdAt).toLocaleDateString()}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetail(issue._id)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

 

{userData&& userData!=='' && (
          <Dialog open={openDialog} onOpenChange={handleRemoveDialog}>
            <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl max-h-screen overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-center text-gray-800">
                  Maintenance Issue Details
                </DialogTitle>
              </DialogHeader>
              {userData ? (
                <div className="space-y-4 py-4 px-2">
                  {/* User Information Section */}
                  <div className="px-4 py-3 border border-gray-300 rounded-md shadow-sm">
                    <h2 className="text-center text-lg font-bold mb-3 text-gray-700">
                      User Information
                    </h2>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-semibold mr-2 text-gray-900">
                          First Name:
                        </span>
                        {userData.userInfo.fName}
                      </p>
                      <p>
                        <span className="font-semibold mr-2 text-gray-900">
                          Middle Name:
                        </span>
                        {userData.userInfo.mName}
                      </p>
                      <p>
                        <span className="font-semibold mr-2 text-gray-900">
                          Last Name:
                        </span>
                        {userData.userInfo.lName}
                      </p>
                      <p>
                        <span className="font-semibold mr-2 text-gray-900">
                          Username:
                        </span>
                        {userData.userInfo.userName}
                      </p>
                      <p>
                        <span className="font-semibold mr-2 text-gray-900">
                          Block Number:
                        </span>
                        {userData.userInfo.blockNumber}
                      </p>
                      <p>
                        <span className="font-semibold mr-2 text-gray-900">
                          Room Number:
                        </span>
                        {userData.userInfo.roomNumber}
                      </p>
                      {userData.userInfo.phoneNumber && (
                        <p>
                          <span className="font-semibold mr-2 text-gray-900">
                            Phone Number:
                          </span>
                          {userData.userInfo.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  <Separator />
                  {/* Issues Submitted Section */}
                  <div>
                    <h2 className="text-lg font-bold text-center mb-3 text-gray-700">
                      Issues Submitted
                    </h2>
                    {userData.issueTypes && userData.issueTypes.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userData.issueTypes.map((item) => (
                          <div
                            key={item._id}
                            className="px-4 py-3 border border-gray-300 rounded-md shadow-sm space-y-1 text-sm text-gray-600"
                          >
                            <p>
                              <span className="font-semibold mr-2 text-gray-900">
                                Issue Type:
                              </span>
                              {item.issue}
                            </p>
                            <p>
                              <span className="font-semibold mr-2 text-gray-900">
                                Status:
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                {item.status}
                              </span>
                            </p>
                            <p>
                              <span className="font-semibold mr-2 text-gray-900">
                                Description:
                              </span>
                              {item.description}
                            </p>
                            <p>
                              <span className="font-semibold mr-2 text-gray-900">
                                Submitted:
                              </span>
                              {item.createdAt
                                ? new Date(item.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )
                                : "N/A"}
                            </p>
 
{userRole === 'ProctorManager' && item.status === 'verified' && (
  <div className="flex flex-col gap-2 pt-4">
    {/* Option 1: Change status */}
    <div className="flex items-center"> {/* Removed gap-*. Added items-center */}
      <Label htmlFor={`action-${item._id}-inprogress`} className="text-base text-blue-600 cursor-pointer"> {/* Added htmlFor and cursor-pointer */}
        Change status to In Progress
      </Label>
      <input
        id={`action-${item._id}-inprogress`} // Added id matching Label's htmlFor
        type="radio"
        name={`action-${item._id}`} // unique group per issue
        value="InProgress"
        checked={verifiedId.value === 'InProgress'}
        onChange={(e) =>
          HandleChangeStatus(item._id, item.issue, e.target.value)
        }
        className="ml-2 cursor-pointer" // Added specific margin (e.g., ml-2) and cursor-pointer
      />
    </div>

    {/* Option 2: Pass to Dean */}
    <div className="flex items-center"> {/* Removed gap-*. Added items-center */}
      <Label htmlFor={`action-${item._id}-pass`} className="text-base text-red-600 cursor-pointer"> {/* Added htmlFor and cursor-pointer */}
        Pass The Issue to Dean
      </Label>
      <input
        id={`action-${item._id}-pass`} // Added id matching Label's htmlFor
        type="radio"
        name={`action-${item._id}`} // same unique group per issue
        value="Pass"
        checked={verifiedId.value === 'Pass'}
        onChange={(e) =>
          HandleChangeStatus(item._id, item.issue, e.target.value)
        }
        className="ml-2 cursor-pointer" // Added specific margin (e.g., ml-2) and cursor-pointer
      />
    </div>
  </div>
)}

{userRole === 'dean' && item.status === 'Pass' && (
  <div className="flex items-center pt-4"> {/* Removed gap-*. Added items-center */}
    <Label htmlFor={`action-${item._id}-inprogress-dean`} className="text-base text-blue-600 cursor-pointer"> {/* Added htmlFor and cursor-pointer */}
      Change status to In Progress:
    </Label>
    <input
      id={`action-${item._id}-inprogress-dean`} // Added id matching Label's htmlFor
      type="radio"
      name={`action-${item._id}`} // unique group per issue
      value="InProgress"
      checked={verifiedId.value === 'InProgress'}
      onChange={(e) =>
        HandleChangeStatus(item._id, item.issue, e.target.value)
      }
      className="ml-2 cursor-pointer" // Added specific margin (e.g., ml-2) and cursor-pointer
    />
  </div>
)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500">
                        No issues submitted.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">Loading details...</div>
              )}

             { verifiedId &&
                Object.values(verifiedId).some(
                  (action) => action.value!==""  
                ) && (
                  <AlertDialog
                    open={openAlert}
                    onOpenChange={() => setOpenAlert(false)}
                  >
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to proceed with your action?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() =>{setVerifiedId({});setOpenAlert(false)}}
                        >
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
                )} 
            </DialogContent>
          </Dialog>
        )}
    </div>
  );
}

// function InfoItem({ label, value }) {
//   return (
//     <div className="space-y-1">
//       <Label className="text-sm text-gray-500 dark:text-gray-400">{label}</Label>


//       <div className="font-medium text-gray-900 dark:text-gray-100">{value}</div>
//     </div>
//   );
// }
