import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion } from 'framer-motion'; // Import Framer Motion
 
export default function AttendanceCard({ absentStudent }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const openDialog = (warning) => {
    setSelected(warning);
    setDialogOpen(true);
  };

  const formatLocalAbsenceDate = (dateString) => {
    if (!dateString) return ''; // Return empty string for invalid or null input

    try {
      // Create a Date object from the ISO string
      const date = new Date(dateString);

      // Check if the date object is valid
      if (isNaN(date.getTime())) {
        console.warn("Invalid date string received:", dateString);
        return 'Invalid Date'; // Or some other indicator
      }

      // Use toLocaleDateString() to get the local date part (e.g., 4/18/2025)
      // You can pass options for specific formatting if needed, but this gives the default local format.
      return date.toLocaleDateString();

    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return 'Error'; // Handle parsing errors
    }
  };





  

// Define animation variants for the individual cards (can reuse from previous example)
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Define animation variants for the container to stagger the children (can reuse)
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    transition: {
      staggerChildren: 0.08 // Stagger the animation of each child
    }
  }
};


 

  return (
    <div className="h-full w-full p-6 bg-gradient-to-br from-blue-50 to-yellow-50 rounded-lg shadow-inner"> {/* Soft, warm background for absence warnings */}
      {/* Apply motion to the grid container to enable staggering */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" // Increased gap
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Check if absentStudent exists and has items */}
        {absentStudent && absentStudent.length > 0 ? (
          absentStudent.map((warn, index) => (
            // Wrap each Card with motion.div for individual animation
            <motion.div
              key={warn._id || index} // Use unique _id if available, fallback to index
              variants={itemVariants}
              whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }} // Subtle scale/shadow on hover
              transition={{ type: "spring", stiffness: 400, damping: 17 }} // Smooth hover animation
              className="rounded-lg overflow-hidden" // Ensure rounded corners are visible
            >
              <Card className="h-full flex flex-col bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out border border-red-200"> {/* Enhanced Card styling, subtle red border */}
                <CardHeader className="px-6 pt-6 pb-4 border-b border-red-200"> {/* Adjusted padding, added bottom border */}
                  <CardTitle className="text-xl font-semibold text-red-700"> {/* Styled title, red color for warning */}
                     {/* Use optional chaining just in case */}
                    {warn.student?.Fname || ""} {warn.student?.Lname || ""}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-grow px-6 py-4 space-y-2 text-gray-700"> {/* Adjusted padding, text color, space-y */}
                  <p><span className="font-medium">User Name:</span> {warn.student?.userName || ""}</p> {/* Styled label */}
                  <p><span className="font-medium">Missed Days:</span> <span className="text-red-600 font-bold">{warn.count}</span></p> {/* Styled count */}
                </CardContent>

                <CardFooter className="px-6 pb-6 pt-4 border-t border-gray-200"> {/* Adjusted padding, added top border */}
                  {/* Keep button size and onClick logic */}
                  <Button
                     size="sm"
                     onClick={() => openDialog(warn)}
                     className="bg-red-500 hover:bg-red-600 text-white" // Styled button color
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        ) : (
           // Styled fallback message
          <div className="col-span-full text-center text-gray-600 p-8 italic bg-white rounded-md shadow">
            No absent students found for this criteria.
          </div>
        )}
      </motion.div>

      {/* Dialog component - Functionality remains unchanged */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px] p-6"> {/* Styled dialog content padding/width */}
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">Student Absence Details</DialogTitle> {/* Styled title */}
          </DialogHeader>
          {selected && (
            <div className="mt-4 space-y-3 text-gray-700"> {/* Styled details container */}
              <DialogDescription className="text-base space-y-2"> {/* Adjusted text size and spacing */}
                <p>
                  <span className="font-semibold">Name:</span> {selected.student?.Fname || ""} {selected.student?.Mname || ""} {selected.student?.Lname || ""}
                </p>
                <p><span className="font-semibold">User Name:</span> {selected.student?.userName || ""}</p> {/* Added Username here too */}
                <p><span className="font-semibold">Email:</span> {selected.student?.email || ""}</p> {/* Use optional chaining */}
                <p><span className="font-semibold">Role:</span> {selected.student?.role || ""}</p> {/* Use optional chaining */}
                <p><span className="font-semibold">Sex:</span> {selected.student?.sex || ""}</p> {/* Use optional chaining */}
                {/* Using optional chaining on phoneNum and block as they are directly on 'selected' */}
                <p><span className="font-semibold">Phone Number:</span> {selected.phoneNum || ""}</p>
                <p><span className="font-semibold">Block:</span> {selected.block || ""}</p>
                <p><span className="font-semibold">Absence Count:</span> <span className="text-red-600 font-bold">{selected.count || 0}</span></p>
                <p><span className="font-semibold">Threshold:</span> {selected.threshold || 0}</p>
                <p><span className="font-semibold">Message:</span> <span className="italic">{selected.message || "No message."}</span></p>
                <p><span className="font-semibold">Type:</span> {selected.type || ""}</p>
                 {/* Styled Absence Dates List */}
                <div className="border-t border-gray-200 pt-3 mt-3">
                   <p className="font-semibold mb-1">Absence Dates:</p>
                   <p className="text-sm text-gray-600">
                     {Array.isArray(selected.student?.absenceDates) && selected.student.absenceDates.length > 0
                       ?
                         selected.student.absenceDates.map(formatLocalAbsenceDate).join(', ')
                       : 'No absences recorded.'
                     }
                   </p>
                </div>
              </DialogDescription>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
  // return (
  //   <div className="h-full w-full bg-white p-4">
  //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  //       {absentStudent && absentStudent.length > 0 &&
  //         absentStudent.map((warn) => (
  //           <Card key={warn._id} className="m-2">
  //             <CardHeader className="px-4 pt-4">
  //               <CardTitle className="text-lg font-medium">
  //                 {warn.student.Fname} {warn.student.Lname}
  //               </CardTitle>
  //             </CardHeader>

  //             <CardContent className="px-4 py-2 space-y-1">
  //               <p>
  //                 <strong>User Name:</strong> {warn.student.userName}
  //               </p>
  //               <p>
  //                 <strong>missed Day:</strong> {warn.count}
  //               </p>
  //             </CardContent>

  //             <CardFooter className="px-4 pb-4">
  //               <Button size="sm" onClick={() => openDialog(warn)}>
  //                 View Details
  //               </Button>
  //             </CardFooter>
  //           </Card>
  //         ))}
  //     </div>

  //     <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  //       <DialogContent>
  //         <DialogHeader>
  //           <DialogTitle>Student Absence Details</DialogTitle>
  //         </DialogHeader>
  //         {selected && (
  //           <div className="mt-2 space-y-2">
  //             <DialogDescription>
  //               <p>
  //                 <strong>Name:</strong> {selected.student.Fname} {selected.student.Mname} {selected.student.Lname}
  //               </p>
  //               <p><strong>Email:</strong> {selected.student.email}</p>
  //               <p><strong>Role:</strong> {selected.student.role}</p>
  //               <p><strong>Sex:</strong> {selected.student.sex}</p>
  //               <p><strong>Phone Number:</strong> {selected.phoneNum||''}</p>
  //               <p><strong>Block:</strong> {selected.block}</p>
  //               <p><strong>Absence Count:</strong> {selected.count}</p>
  //               <p><strong>Threshold:</strong> {selected.threshold}</p>
  //               <p><strong>Message:</strong> {selected.message}</p>
  //               <p><strong>Type:</strong> {selected.type}</p>
  //               <p>
                 
  //                    <span>
                       
  //                      {Array.isArray(selected.student.absenceDates) && selected.student.absenceDates.length > 0
  //                        ?  
  //                          selected.student.absenceDates.map(formatLocalAbsenceDate).join(', ')
  //                        : 'No absences'  
  //                      }
  //                    </span>
  //                  </p>
  //             </DialogDescription>
  //           </div>
  //         )}
  //       </DialogContent>
  //     </Dialog>
  //   </div>
  // );

