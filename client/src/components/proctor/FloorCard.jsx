import React, { useState } from 'react';
import { FaBed, FaDoorOpen, FaUsers, FaCheckCircle, FaUserGraduate } from 'react-icons/fa';
import { Button } from '../ui/button';
// Assuming you are using useDispatch from react-redux in the parent component
// import { useDispatch } from 'react-redux'; // Example import in parent
// And your updateDormStatus thunk
 
// Import Dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Import Alert Dialog components
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

// Import Select components (assuming shadcn/ui structure)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
 
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { updateDormStatus } from '@/store/dormSlice';


// Modify the component signature to accept dispatch as a prop
// Make sure to pass the dispatch function from your parent component
// Example in parent: <FloorCard floor={...} blockId={...} dispatch={useDispatch()} />
const FloorCard = ({ floor, blockId,  }) => { // Add dispatch prop
  // State for the main dorm details dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // State for the alert dialog confirming status change
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // State for the currently selected dorm in the dialog
  const [selectedDorm, setSelectedDorm] = useState(null);
  // State for the status the user wants to change to
  const [newStatus, setNewStatus] = useState(null);

  // State to hold the dorm ID being updated before the alert (still useful for the alert message)
  const [statusChangingDormId, setStatusChangingDormId] = useState(null);
const dispatch=useDispatch()

  // Function to handle opening the main dialog
  const handleViewDetailClick = () => {
    setIsDialogOpen(true);
    // Reset selected dorm when opening the dialog
    setSelectedDorm(null);
    setNewStatus(null);
  };

  // Function to handle selecting a dorm from the dropdown
  // This function only receives the dormId from the Select component
  const handleDormSelect = (dormId) => {
    const dorm = floor.dorms?.find(d => d._id === dormId); // Find dorm using the received dormId
    setSelectedDorm(dorm || null);
    // Reset newStatus when a new dorm is selected
    setNewStatus(null);
  };

  // Function to handle clicking the 'Update Status' button inside the dialog
  const handleStatusChangeClick = () => {
    if (selectedDorm && newStatus) {
      // Set the dorm ID for the alert message
      setStatusChangingDormId(selectedDorm._id); // Assuming dorms have an _id
      setIsAlertOpen(true);
    }
  };

  // Function to handle confirming the status change in the alert dialog
  const handleConfirmStatusChange = async () => { // Make it async because dispatching thunk returns a promise
    if (selectedDorm && newStatus && blockId && floor.floorNumber) { // Ensure all required values are available
      console.log(`Preparing to dispatch update for Block ID: ${blockId}, Floor Number: ${floor.floorNumber}, Dorm Number: ${selectedDorm.dormNumber}, Status: ${newStatus}`);
 
      try {
        // Dispatch the thunk with all required values
        await dispatch(updateDormStatus({
          blockId: blockId,
          floorNumber: floor.floorNumber,
          dormNumber: selectedDorm.dormNumber, // Use dormNumber from the selected dorm object
          status: newStatus,
        })).then(data=>{
     if(data.payload.success){
    toast.success("Status updated successfully!");
        }

        else{
          toast.error("Status update failed. Please try again.");
        }
})

        console.log("Dispatch successful (or pending)");
        // Close the alert dialog
        setIsAlertOpen(false);
        // Close the main dialog after successful update (optional, based on UX)
        setIsDialogOpen(false); // Close main dialog
        // You might need to re-fetch or update local state elsewhere
        // after the dispatch succeeds to reflect the change.
      } catch (error) {
        console.error("Error dispatching update:", error);
        // Handle errors, e.g., show a toast notification
        setIsAlertOpen(false); // Close alert even on error
      }
    } else {
        console.warn("Cannot dispatch update: Missing required data (dorm, new status, blockId, or floorNumber).");
        setIsAlertOpen(false); // Close alert if data is missing unexpectedly
    }
  };

  // Function to handle cancelling the status change in the alert dialog
  const handleCancelStatusChange = () => {
    // Close the alert dialog
    setIsAlertOpen(false);
    // Reset the state related to the potential change
    setStatusChangingDormId(null);
    setNewStatus(null);
  };


  // console.log("FloorCard Props:", floor); // Debug log - can keep or remove

  const availabilityColor = floor.floorStatus === "Available" ? "text-green-600" : "text-red-600";
  const availabilityBg = floor.floorStatus === "Available" ? "bg-green-100" : "bg-red-100";

  // Calculate student-related statistics
  const totalStudentsAllocated = floor.dorms?.reduce((sum, dorm) => sum + (dorm.studentsAllocated || 0), 0) || 0;
  const totalCapacity = floor.floorCapacity || 0;
  const occupancyRate = totalCapacity > 0 ? Math.round((totalStudentsAllocated / totalCapacity) * 100) : 0;

  // Define possible dorm statuses
  const dormStatuses = ["Available", "Full","MaintenanceIssue",'UnAvailable'];
 

  return (
    <div className="bg-white rounded-lg shadow-md p-3 transform hover:scale-105 transition-transform duration-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-bold text-gray-800">Floor {floor.floorNumber}</h3>
        <span className={`${availabilityColor} ${availabilityBg} px-2 py-0.5 rounded-full text-xs font-medium`}>
          {floor.floorStatus}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        {/* ... (existing floor stats) ... */}
        {/* Total Capacity */}
        <div className="flex items-center gap-1.5">
          <FaUsers className="text-blue-500 text-sm" />
          <div>
            <p className="text-xs text-gray-500">Capacity</p>
            <p className="font-semibold text-sm">{totalCapacity}</p>
          </div>
        </div>

        {/* Students Allocated */}
        <div className="flex items-center gap-1.5">
          <FaUserGraduate className="text-purple-500 text-sm" />
          <div>
            <p className="text-xs text-gray-500">Allocated</p>
            <p className="font-semibold text-sm">{totalStudentsAllocated}</p>
          </div>
        </div>

        {/* Available Beds */}
        <div className="flex items-center gap-1.5">
          <FaBed className="text-green-500 text-sm" />
          <div>
            <p className="text-xs text-gray-500">Available</p>
            <p className="font-semibold text-sm">{floor.totalAvailable || 0}</p>
          </div>
        </div>

        {/* Total Dorms */}
        <div className="flex items-center gap-1.5">
          <FaDoorOpen className="text-orange-500 text-sm" />
          <div>
            <p className="text-xs text-gray-500">Dorms</p>
            <p className="font-semibold text-sm">{floor.dorms?.length || 0}</p>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="flex items-center gap-1.5 col-span-2 mt-1">
          <FaCheckCircle className="text-blue-600 text-sm" />
          <div className="flex-grow">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">Occupancy</p>
              <p className="text-xs font-medium">{occupancyRate}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-0.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${occupancyRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Dorm Status Summary */}
        <div className="col-span-2 mt-1 pt-1 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Available: {floor.dorms?.filter(d => d.dormStatus === "Available").length || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Full: {floor.dorms?.filter(d => d.dormStatus === "Full").length || 0}</span>
            </div>
             <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-500"></span>
              <span>Unavailable: {floor.dorms?.filter(d => d.dormStatus === "UnAvailable").length || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span>Maintenance: {floor.dorms?.filter(d => d.dormStatus === "MaintenanceIssue").length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-4 flex justify-center'>
        {/* Use DialogTrigger to control the main dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className='bg-green-900/40 text-white' onClick={handleViewDetailClick}>View Detail</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Floor {floor.floorNumber} Dorm Details</DialogTitle>
              <DialogDescription>
                Select a dorm to view its details and update its status.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Dorm Selection Select */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="dormSelect" className="text-right">
                  Select Dorm
                </label>
                {/* Corrected onValueChange - it only passes the value (dorm._id) */}
                <Select onValueChange={handleDormSelect} value={selectedDorm ? selectedDorm._id : ""}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Choose a dorm" />
                  </SelectTrigger>
                  <SelectContent>
                    {floor.dorms?.map(dorm => (
                      <SelectItem key={dorm._id} value={dorm._id}>
                        Dorm {dorm.dormNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Display Selected Dorm Information */}
              {selectedDorm && (
                <div className="border p-4 rounded-md mt-2">
                  <h4 className="font-bold text-lg mb-2">Dorm {selectedDorm.dormNumber} Details</h4>
                  <p><strong>Capacity:</strong> {selectedDorm.capacity}</p>
                  <p><strong>Students Allocated:</strong> {selectedDorm.studentsAllocated}</p>
                  <p><strong>Available Beds:</strong> {selectedDorm.totalAvailable}</p>
                  <p><strong>Current Status:</strong> {selectedDorm.dormStatus}</p>

                  {/* Status Update Section */}
                  <div className="grid grid-cols-4 items-center gap-4 mt-4">
                    <label htmlFor="statusSelect" className="text-right">
                      Update Status
                    </label>
                     <Select onValueChange={setNewStatus} value={newStatus || selectedDorm.dormStatus}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        {dormStatuses.map(status => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="flex justify-end mt-4">
                     {/* Disable button if no status change or selected dorm */}
                     <Button
                       onClick={handleStatusChangeClick}
                       disabled={!selectedDorm || !newStatus || newStatus === selectedDorm.dormStatus||selectedDorm.dormStatus==='Full'}
                     >
                       Update Status
                     </Button>
                   </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Alert Dialog for Status Confirmation */}
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              {/* Use selectedDorm?.dormNumber for the message */}
              <AlertDialogDescription>
                This action will change the status of Dorm {selectedDorm?.dormNumber} to "{newStatus}".
                Are you sure you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelStatusChange}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmStatusChange}>Confirm Change</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
};

export default FloorCard;