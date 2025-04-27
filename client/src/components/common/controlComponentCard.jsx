import React, { useState } from 'react'; // Import useState
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter, // Although not used, keep if needed elsewhere
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button"; // Although not used, keep if needed elsewhere
import { Label } from "../ui/label";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  // AlertDialogTrigger, // Not needed for manual control
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { UpdateControlIssueSatus } from '@/store/control/controlSclice';

export default function ControlComponentCard({ filteredIndividualIssues }) {
  console.log(
    filteredIndividualIssues,
    "filteredIndividualIssues from components"
  );
  const { user } = useSelector((state) => state.auth);
  console.log(user, "user from control component card");
  
const dispatch =useDispatch()
  // State to hold the details of the status change about to be confirmed
  const [statusChangeDetails, setStatusChangeDetails] = useState({
    issueId: null, // ID of the main issue entry
    specificIssueId: null, // ID of the specific issue within Allissues
    issueName: null, // Name of the issue type
    selectedStatus: null, // The status value ('closed', 'InProgress', 'passed')
  });

  // State to control the AlertDialog visibility
  const [openDialog, setOpenDialog] = useState(false);

  // Handler for when a radio button is clicked
  const handleStatusSelect = (issueId, specificIssueId, issueName, selectedStatus) => {
    setStatusChangeDetails({
      issueId,
      specificIssueId,
      issueName,
      selectedStatus,
    });
    // Open the dialog after selecting a status
    setOpenDialog(true);
  };

  // Handler for when the user confirms the status change in the dialog
  const handleContinue = () => {
 
    if(Object.values(statusChangeDetails).every((val) => val!==null)){ 
  dispatch(UpdateControlIssueSatus(statusChangeDetails)).then((response) => {   
        if (response.payload.success) {
           toast.success(response.payload.message); // Show success message
        } else {
            // Handle error (e.g., show an error message)
     
            toast.error(response.payload.message); // Show error message
            console.error("Error updating status:", response.payload.message);
        }

   
    })

    // Close the dialog
    setOpenDialog(false);
    setStatusChangeDetails({
      issueId: null,            
        specificIssueId: null,
        issueName: null,
        selectedStatus: null,
    });

    // You might want to refetch or update your local state after a successful update
  }}

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Control Issues</h2>
      <p className="text-gray-600 mb-4">List of all control issues</p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3   w-full">
        {filteredIndividualIssues && filteredIndividualIssues.length > 0 ? (
          filteredIndividualIssues.map((issue) => ( // Use issue._id as key if available, otherwise index is okay but less ideal
            <Card
              key={issue._id || issue.id || issue.index} // Use a unique ID if possible
              className="w-full max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden"
            >
              <CardHeader>
                {/* Displaying main issue type here */}
                <CardTitle>{issue.issue}</CardTitle>
                {/* Displaying main issue description here */}
                <CardDescription>{issue.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center">
                  <h1>User Information</h1>
                  <div className="flex flex-col gap-3 w-full">
                    <p className="text-gray-600 mb-2 flex gap-1">
                      <span>Full Name:</span>
                      <span>
                        {issue.student?.Fname || ''} {issue.student?.Mname || ''}{" "}
                        {issue.student?.Lname || ''}
                      </span>
                    </p>
                    <p className="text-gray-600 mb-2 flex gap-1">
                      <span>Id:</span> <span>{issue.student?.userName || 'N/A'}</span>
                    </p>
                    <p className="text-gray-600 mb-2">
                      Phone Number: {issue.student?.phonNum || 'N/A'}
                    </p>
                    <p className="text-gray-600 mb-2">
                      gender: {issue.student?.sex || 'N/A'}
                    </p>
                    <p className="text-gray-600 mb-2">
                      Block: {issue.student?.blockNum || 'N/A'}
                    </p>
                    <p className="text-gray-600 mb-2">
                      Dorm: {issue.student?.dormId || 'N/A'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 w-full mt-4"> {/* Added margin-top for separation */}
                    <h1>Registered by Proctor:</h1>
                    <div className="flex flex-col gap-3 w-full">
                      <p className="text-gray-600 mb-2 flex gap-1">
                        <span>Full Name:</span>
                        <span>
                          {issue.proctor.fName} {issue.proctor.mName}{" "}
                          {issue.proctor.lName}
                        </span>
                      </p>
                      <p className="text-gray-600 mb-2 flex gap-1">
                        <span>User Name:</span>
                        <span>{issue.proctor.userName} </span>
                      </p>
                      <p className="text-gray-600 mb-2">
                        Phone Number: {issue.proctor.phoneNum}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full mt-4"> {/* Added margin-top for separation */}
                    <h1>Issue Details:</h1>
                    {/* Iterate over the Allissues array for specific issue entries */}
                    {issue.Allissues && issue.Allissues.length > 0 ? (
                      issue.Allissues.map((iss) => ( // Use a unique ID for the key if possible
                        <div key={iss._id || iss.id || iss.index} className="flex flex-col gap-3 w-full border p-3 rounded"> {/* Added border/padding for clarity */}
                          {/* Use iss.issue, iss.status, etc. here if they are specific to this entry */}
                          {/* If issue, status, description in Allissues items are duplicates of the main issue, you might not need these */}
                           <p className="text-gray-600 mb-2">
                             Issue Type : {iss.issue || issue.issue} {/* Use specific if available, fallback to main */}
                           </p>
                          <p className="text-gray-600 mb-2">
                            Current Status: {iss.status}
                          </p>
                          <p className="text-gray-600 mb-2">
                            Reported Date: {iss.dateReported}
                          </p>
                           <p className="text-gray-600 mb-2">
                             Description: {iss.description || issue.description} {/* Use specific if available, fallback to main */}
                           </p>

                           
                           
                          {/* Status Change Section */}
                          {user.role === "studentDean"&&iss.status==='passed'&& (
                            <div className="flex flex-col gap-3 w-full mt-4 border-t pt-4"> {/* Added border-top */}
                              <h1>Change Status (Dean):</h1>
                              <div className="flex gap-2 items-center"> {/* Added items-center for alignment */}
                                <input
                                  type="radio"
                                  id={`closed-${iss._id}`} // Unique ID
                                  name={`status-${iss._id}`} // Group radio buttons by specific issue ID
                                  value='closed'
                                  checked={statusChangeDetails.specificIssueId === iss._id && statusChangeDetails.selectedStatus === 'closed'}
                                  onChange={() => handleStatusSelect(issue._id, iss._id, issue.issue, 'closed')}
                                />
                                <Label htmlFor={`closed-${iss._id}`}>Close Case</Label> {/* Link label to input */}
                              </div>

                              <div className="flex gap-2 items-center"> {/* Added items-center for alignment */}
                                <input
                                  type="radio"
                                   id={`inprogress-${iss._id}`} // Unique ID
                                  name={`status-${iss._id}`} // Group radio buttons by specific issue ID
                                  value='InProgress'
                                   checked={statusChangeDetails.specificIssueId === iss._id && statusChangeDetails.selectedStatus === 'InProgress'}
                                  onChange={() => handleStatusSelect(issue._id, iss._id, issue.issue, 'InProgress')}
                                />
                                <Label htmlFor={`inprogress-${iss._id}`}>Mark Inprogress</Label> {/* Link label to input */}
                              </div>
                              {/* Dean doesn't pass to dean */}

                            </div>
                          )} 
                           {user.role=== "proctorManager"&& iss.status==='open'&&  ( // Assuming the other role is Proctor or similar
                            <div className="flex flex-col gap-3 w-full mt-4 border-t pt-4"> {/* Added border-top */}
                              <h1>Change Status:</h1> {/* Role might be Proctor */}
                               <div className="flex gap-2 items-center"> {/* Added items-center for alignment */}
                                <input
                                  type="radio"
                                   id={`closed-${iss._id}`} // Unique ID
                                  name={`status-${iss._id}`} // Group radio buttons by specific issue ID
                                  value='closed'
                                   checked={statusChangeDetails.specificIssueId === iss._id && statusChangeDetails.selectedStatus === 'closed'}
                                  onChange={() => handleStatusSelect(issue._id, iss._id, issue.issue, 'closed')}
                                />
                                <Label htmlFor={`closed-${iss._id}`}>Close Case</Label> {/* Link label to input */}
                              </div>

                              <div className="flex gap-2 items-center"> {/* Added items-center for alignment */}
                                <input
                                  type="radio"
                                   id={`inprogress-${iss._id}`} // Unique ID
                                  name={`status-${iss._id}`} // Group radio buttons by specific issue ID
                                  value='InProgress'
                                   checked={statusChangeDetails.specificIssueId === iss._id && statusChangeDetails.selectedStatus === 'InProgress'}
                                  onChange={() => handleStatusSelect(issue._id, iss._id, issue.issue, 'InProgress')}
                                />
                                <Label htmlFor={`inprogress-${iss._id}`}>Mark Inprogress</Label> {/* Link label to input */}
                              </div>

                              <div className="flex gap-2 items-center"> {/* Added items-center for alignment */}
                                <input
                                  type="radio"
                                   id={`passed-${iss._id}`} // Unique ID
                                  name={`status-${iss._id}`} // Group radio buttons by specific issue ID
                                  value='passed'
                                   checked={statusChangeDetails.specificIssueId === iss._id && statusChangeDetails.selectedStatus === 'passed'}
                                  onChange={() => handleStatusSelect(issue._id, iss._id, issue.issue, 'passed')}
                                />
                                <Label htmlFor={`passed-${iss._id}`}>Pass to Student Dean</Label> {/* Link label to input */}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No specific issue entries found.</p>
                    )}
                  </div>
                </div>
              </CardContent>
              {/* CardFooter can be added here if needed */}
            </Card>
          ))
        ) : (
          <div className="flex text-center py-6 bg-white px-10 w-full rounded-md justify-center items-center"> {/* Added styling for centering */}
            <p>No reported issues found in this category.</p>
          </div>
        )}

        {/* AlertDialog for confirming status change */}
        <AlertDialog open={openDialog} onOpenChange={setOpenDialog}> {/* Corrected onOpenChange */}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Status Change?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will change the status of the issue "{statusChangeDetails.issueName}" to "{statusChangeDetails.selectedStatus}".
                Do you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleContinue}> {/* Call the handleContinue function on confirm */}
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
}