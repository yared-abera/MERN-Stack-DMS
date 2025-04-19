import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
   
  GetPendingStatusMaintenaceIssue,
  VerificationIssue,
} from "@/store/maintenanceIssue/maintenanceIssue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"; // Make sure to import Button
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MaintenanceIssuePage() {
  const { user } = useSelector((state) => state.auth);
  const { isLoading, AllMaintenaceIssueByStatus } = useSelector(
    (state) => state.issue
  );
  const [openDialog, setDialog] = useState(false);
  const [userData, setUserData] = useState("");
  const [selectedIssues, setSelectedIssues] = useState({});

  const [verifyId, setVerifyId] = useState("");
  const [openAlert, setOpenAlert] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const status = "Pending";
    const id = user.id;

    dispatch(GetPendingStatusMaintenaceIssue({ status, id }));
  }, [dispatch]);

  if (isLoading) return <div>Loading maintenance issues...</div>;

  function handleViewDetail(id) {
    const viewIssue = AllMaintenaceIssueByStatus.data.find(
      (issue) => issue._id === id
    );

    setUserData(viewIssue);
    setDialog(true);
  }

  
  function handleRemoveDialog() {
    setUserData("");
    setDialog(false);
  }

  const handleVerify = (id, issue, status) => {
    setSelectedIssues((prev) => ({ ...prev, [id]: "verified" }));
    setVerifyId({ id, issue, status });

    setOpenAlert(true);
    // any other logic, like setting a verification id, etc.
  };

  const handleReject = (id, issue, status) => {
    setSelectedIssues((prev) => ({ ...prev, [id]: "Rejected" }));
    setVerifyId({ id, issue, status });
    setOpenAlert(true);
    // any other logic for rejection
  };

  function HandleContinue(id) {
    console.log(id);
    
    dispatch(VerificationIssue(id)).then((data) => {
      if (data.payload.success) {
        const status = "Pending";
        const id = user.id;
    
        dispatch(GetPendingStatusMaintenaceIssue({ status, id }));
        toast.success("👍 Status Updated Successfully");
      }
    });
    setOpenAlert(false);
  }

 

  return (
    <Card className="mt-8 mx-4">
      <CardHeader>
        <CardTitle className="text-center">Maintenance Issues</CardTitle>
      </CardHeader>
      <CardContent>
        {AllMaintenaceIssueByStatus.success ? (
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
              {AllMaintenaceIssueByStatus.data.map((issue, index) => (
                <TableRow key={issue._id}>
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
        ) : (
          <div className="w-[80%]">
            <h1 className="text-center  text-gray-500 text-xl font-bold">No Issue is found </h1>
          </div>
        )}

        {userData !== "" && (
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
                            <div className="flex flex-col gap-2 pt-4">
                              <div className="flex gap-2">
                                <Label className="text-base text-blue-600">
                                  Verify The Issue
                                </Label>
                                <input
                                  type="radio"
                                  name={`action-${item._id}`} // unique group per issue
                                  value="verified"
                                  checked={
                                    selectedIssues[item._id] === "verified"
                                  }
                                  onChange={(e) =>
                                    handleVerify(
                                      item._id,
                                      item.issue,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div className="flex gap-2">
                                <Label className="text-base text-red-600">
                                  Reject The Issue
                                </Label>
                                <input
                                  type="radio"
                                  name={`action-${item._id}`} // same unique group per issue
                                  value="Rejected"
                                  checked={
                                    selectedIssues[item._id] === "Rejected"
                                  }
                                  onChange={(e) =>
                                    handleReject(
                                      item._id,
                                      item.issue,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
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

              {selectedIssues &&
                Object.values(selectedIssues).some(
                  (action) => action === "verified" || action === "Rejected"
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
                          onClick={() => setSelectedIssues({})}
                        >
                          No
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => HandleContinue(verifyId)}
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
      </CardContent>
    </Card>
  );
}
