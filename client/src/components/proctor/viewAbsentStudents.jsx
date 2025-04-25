 // Assuming you have these component imports from shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription, // Added CardDescription
  CardContent,
  // CardFooter // Not needed for this structure
} from "@/components/ui/card";

// Keep your other imports
import { getStudentForProctor } from "@/store/studentAllocation/allocateSlice"; // Unused in this specific component snippet, but keep if part of larger file
import { useEffect, useState } from "react"; // Unused in this specific component snippet, but keep if part of larger file
import { useDispatch, useSelector } from "react-redux"; // Unused in this specific component snippet, but keep if part of larger file
// Keep Table imports if used elsewhere in the file
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Unused in this specific component snippet, but keep if part of larger file
import { Button } from "@/components/ui/button"; // Unused in this specific component snippet, but keep if part of larger file
import { toast } from "sonner"; // Unused in this specific component snippet, but keep if part of larger file
import { addAttendance } from "@/store/attendance/attendance-Slice"; // Unused in this specific component snippet, but keep if part of larger file


export default function AbsentStudentOnProctor({ absentStudent }) {
    console.log(absentStudent, "absentStudent prop received");

    // Helper function to format an ISO date string
    const formatLocalAbsenceDate = (dateString) => {
      if (!dateString) return '';

      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          console.warn("Invalid date string received:", dateString);
          return 'Invalid Date';
        }
        return date.toLocaleDateString();
      } catch (error) {
        console.error("Error formatting date:", dateString, error);
        return 'Error';
      }
    };

    return (
        // Outer container: Added padding, centered content area, background
        <div className="w-full py-8 bg-gradient-to-b from-background to-muted/20">
           {/* Content wrapper: Added max width, horizontal centering, spacing */}
           <div className="max-w-6xl mx-auto px-4">
             {/* Section Header */}
             <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 text-muted-foreground">
                Recently Absent Students
             </h1>

             {/* Cards Container: Used flex wrap and gap for responsive layout */}
             <div className="flex flex-wrap -m-2 justify-center"> {/* Negative margin counteracts child margin */}
                {Array.isArray(absentStudent) && absentStudent.length > 0 ? (
                    absentStudent.map((stud, index) => (
                        // Individual Student Card
                        // Added margin (p-2 inside flex-wrap container), background, shadow, rounded corners
                        // Added responsive width classes
                        <Card key={index} className="m-2 w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.3%-1rem)] lg:w-[calc(25%-1rem)] bg-card border border-border/60 shadow-md hover:shadow-lg transition-shadow duration-200">
                            {/* Card Header: Added padding bottom */}
                            <CardHeader className="pb-4">
                                {/* Card Title: Student Name */}
                                <CardTitle className="text-lg font-semibold text-foreground">{stud.Fname} {stud.Lname}</CardTitle>
                                {/* Card Description: Username */}
                                {stud.userName && <CardDescription className="text-sm text-muted-foreground mt-1">{stud.userName}</CardDescription>}
                            </CardHeader>
                            {/* Card Content: Padding and layout for details */}
                            <CardContent className="pt-4 border-t border-border/60"> {/* Added top padding and border */}
                                {/* Details Grid: Responsive grid for key-value pairs */}
                                <div className="grid grid-cols-1 gap-2 text-sm">

                                     {/* Middle Name - Display if available */}
                                     {stud.Mname && (
                                         <div>
                                             <span className="font-semibold">Middle Name:</span> <span className="text-muted-foreground">{stud.Mname}</span>
                                         </div>
                                     )}

                                    {/* Number of Absent */}
                                    <div>
                                        <span className="font-semibold">Absences Count:</span> <span className="text-muted-foreground">{stud.absenceDates ? stud.absenceDates.length : 0}</span>
                                    </div>

                                    {/* Absent Dates */}
                                    <div>
                                        <span className="font-semibold">Absent Dates:</span>
                                        {/* Display dates, wrapping if necessary */}
                                        <span className="text-muted-foreground block mt-1"> {/* Use block and margin top for long lists */}
                                            {Array.isArray(stud.absenceDates) && stud.absenceDates.length > 0
                                                ? stud.absenceDates.map(formatLocalAbsenceDate).join(', ')
                                                : 'No absences reported'
                                            }
                                        </span>
                                    </div>

                                </div>
                            </CardContent>
                             {/* CardFooter could be added here if needed for actions */}
                        </Card>
                    ))
                ) : (
                    // Message when no absent students are found
                    <div className="w-full text-center py-8 text-muted-foreground text-lg">
                        No absent students found.
                    </div>
                )}
             </div> {/* End Cards Container */}
           </div> {/* End Content Wrapper */}
        </div> // End Outer Container
    );
}