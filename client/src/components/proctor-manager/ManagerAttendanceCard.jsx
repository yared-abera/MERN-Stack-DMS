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

  return (
    <div className="h-full w-full bg-white p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {absentStudent && absentStudent.length > 0 &&
          absentStudent.map((warn) => (
            <Card key={warn._id} className="m-2">
              <CardHeader className="px-4 pt-4">
                <CardTitle className="text-lg font-medium">
                  {warn.student.Fname} {warn.student.Lname}
                </CardTitle>
              </CardHeader>

              <CardContent className="px-4 py-2 space-y-1">
                <p>
                  <strong>User Name:</strong> {warn.student.userName}
                </p>
                <p>
                  <strong>missed Day:</strong> {warn.count}
                </p>
              </CardContent>

              <CardFooter className="px-4 pb-4">
                <Button size="sm" onClick={() => openDialog(warn)}>
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Absence Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="mt-2 space-y-2">
              <DialogDescription>
                <p>
                  <strong>Name:</strong> {selected.student.Fname} {selected.student.Mname} {selected.student.Lname}
                </p>
                <p><strong>Email:</strong> {selected.student.email}</p>
                <p><strong>Role:</strong> {selected.student.role}</p>
                <p><strong>Sex:</strong> {selected.student.sex}</p>
                <p><strong>Phone Number:</strong> {selected.phoneNum||''}</p>
                <p><strong>Block:</strong> {selected.block}</p>
                <p><strong>Absence Count:</strong> {selected.count}</p>
                <p><strong>Threshold:</strong> {selected.threshold}</p>
                <p><strong>Message:</strong> {selected.message}</p>
                <p><strong>Type:</strong> {selected.type}</p>
                <p>
                 
                     <span>
                       
                       {Array.isArray(selected.student.absenceDates) && selected.student.absenceDates.length > 0
                         ?  
                           selected.student.absenceDates.map(formatLocalAbsenceDate).join(', ')
                         : 'No absences'  
                       }
                     </span>
                   </p>
              </DialogDescription>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
