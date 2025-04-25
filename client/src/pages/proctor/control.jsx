import { getStudentForProctor } from "@/store/studentAllocation/allocateSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming you have an Input component
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { reportStudentIssue } from "@/store/control/controlSclice";
import { toast } from "sonner";

// Updated initial form data - added comments for clarity
const initialFormData = {
  studId: "", // Student ID selected from the dropdown
  issue: "", // User input for the issue
  description: "", // User input for the description
  block: "", // Derived from selected student
  dorm: "", // Derived from selected student
  proctorId: "", // Derived from current user
};

export default function ProctorControl() {
  const dispatch = useDispatch();
  // Ensure auth state and user property exist
  const { user } = useSelector((state) => state.auth || {});
  const [students, setStudents] = useState([]);
  // const [selectStudentIsOpen, setSelectStudentISopen] = useState(false); // Removed - unused
  const [formData, setFormData] = useState(initialFormData);
  const [selectedStudent, setSelectedStudent] = useState(null); // Changed initial state to null

  // Effect 1: Fetch students and set proctorId in formData
  useEffect(() => {
    const proctorId = user?.id;
    if (proctorId) {
      // Set proctorId in form data immediately if user exists
      setFormData((prevFormData) => ({
        ...prevFormData,
        proctorId: proctorId,
      }));

      // Fetch students
      dispatch(getStudentForProctor(proctorId)).then((action) => {
        const { payload } = action;
        if (payload?.success && Array.isArray(payload?.data)) {
          const fetchedStudents = payload.data;
          setStudents(fetchedStudents);
        }
      });
    }
    // Add user?.id to dependencies to refetch if the user changes
    // Added setFormData because it's used inside the effect, though it's a stable ref
  }, [dispatch, user, setFormData]);

  // console.log(students); // Debugging line

  // Handle change for the student Select component
  function handleStudentSelectChange(value) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      studId: value, // Directly use the value passed by Select
    }));
  }

  // Handle change for text inputs (Issue, Description)
  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, // Use input name to update the corresponding key
    }));
  }

  // Effect 2: Find and set selected student details in state and formData
  useEffect(() => {
    if (formData.studId && students && students.length > 0) {
      const thisStudent = students.find((stud) => stud._id === formData.studId);
      setSelectedStudent(thisStudent || null); // Set student or null if not found

      // Update formData with derived student info (block, dorm)
      if (thisStudent) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          block: thisStudent.blockNum || "", // Ensure default to empty string
          dorm: thisStudent.dormId || "", // Ensure default to empty string
        }));
      } else {
         // If student not found (e.g., list changed), clear derived fields
         setFormData((prevFormData) => ({
            ...prevFormData,
            block: "",
            dorm: "",
          }));
      }
    } else {
        // If no student is selected, clear selected student and derived fields
        setSelectedStudent(null);
        setFormData((prevFormData) => ({
            ...prevFormData,
            studId: "", // Clear selected ID as well if somehow empty
            block: "",
            dorm: "",
          }));
    }
    // Dependencies: Trigger when selected student ID or the list of students changes
    // Added setFormData dependency as it's used inside, though stable
  }, [formData.studId, students, setFormData]);

  // Validation function - checks required user inputs and necessary derived fields
  function isFormValid() {
    const { studId, issue, description, block, dorm, proctorId } = formData;
    // Basic check: studId, issue, description must be non-empty strings.
    // Also check derived fields block, dorm, and proctorId are populated.
    return (
      studId !== "" &&
      issue !== "" &&
      description !== "" &&
      block !== "" && // Ensure block is populated after student selection
      dorm !== "" && // Ensure dorm is populated after student selection
      proctorId !== "" // Ensure proctorId is populated
    );
  }

  function handleSubmit(e) {
    e.preventDefault(); // Prevent default form submission
    if (isFormValid()) {
      console.log("Submitting form data:", formData);
      // TODO: Dispatch action to submit control/issue data
    dispatch(reportStudentIssue(formData)).then(data=>{
      console.log(data.payload,"response from components");
      if(data.payload.success){
        toast.success(`${data?.payload?.message}`)
      }
      else{
        toast.error(`${data.payload.message}`)
      }
    })
      // Reset form or handle success/error feedback
       
      
    } else {
      console.log("Form is not valid.");
      // Optional: Show user error messages
    }
  }

  // Helper to check if student details can be displayed
  const canDisplayStudentDetails = selectedStudent !== null;


  return (
    // Outer container: Added a subtle background gradient for extra appeal
    // Removed overflow-hidden here, as the motion div handles it better
    <div className="flex min-h-screen py-10 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <motion.div
            // Framer Motion: Added opacity animation for a smoother entry
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            // Adjusted transition for a slightly different feel
            transition={{ duration: 0.7, ease: "easeInOut" }}
            // Adjusted padding and shadow, slightly enhanced background opacity
            className="m-auto w-[95%] md:w-[70%] lg:w-[50%] xl:w-[40%] h-max p-8 rounded-2xl shadow-2xl bg-card/90 backdrop-blur-md border border-border/50"
        >
            <form onSubmit={handleSubmit}>
                {/* Card: Kept border-none shadow-none to let the motion div's styling dominate */}
                <Card className="border-none shadow-none bg-transparent">
                    <CardHeader className="pb-6 text-center"> {/* Added padding bottom, centered text */}
                        <CardTitle className="text-3xl font-bold text-primary">Control System</CardTitle> {/* Made title larger and bolder */}
                        <CardDescription className="text-sm text-muted-foreground mt-2"> {/* Subtle description styling */}
                            Register any type of wrong doing around dormitory and report
                            to next level.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6"> {/* Added padding top */}
                        {/* Student Select Section */}
                        <div className="flex flex-col gap-4 mb-8"> {/* Increased gap and margin bottom */}
                             <Label htmlFor="student-select" className="sr-only">Select Student By Id</Label> {/* sr-only is fine */}
                            {/* Conditional rendering for Select */}
                            {students && students.length > 0 ? (
                                <Select
                                    value={formData.studId}
                                    onValueChange={handleStudentSelectChange}
                                >
                                    <SelectTrigger id="student-select" className="w-full">
                                        <SelectValue placeholder="Select Student By Id" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {students.map((stud) => (
                                            <SelectItem key={stud._id} value={stud._id}>
                                                {stud.userName} ({stud.Fname} {stud.Lname})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                // Handle empty state - maybe show a disabled select or a message
                                <div className="text-muted-foreground text-center py-4 border rounded-md">
                                    No students available or loading...
                                </div>
                            )}
                        </div>

                        {/* Student details section - conditionally render based on selection */}
                        {canDisplayStudentDetails && (
                            <motion.div
                                // Added subtle animation for the details section appearance
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col gap-4 pt-4 border-t border-border-muted" // Added top padding and border
                            >
                                <h1 className="text-xl font-semibold text-foreground pb-2 border-b border-dashed border-border-muted"> {/* Added separator */}
                                    User Information
                                </h1>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Made it two columns on medium screens */}
                                    {/* Using Shadcn Input component */}
                                    <div>
                                        <Label htmlFor="fname">First Name</Label>
                                        <Input
                                            id="fname"
                                            type="text"
                                            value={selectedStudent?.Fname || ''}
                                            disabled
                                            className="mt-2 disabled:opacity-80 disabled:cursor-not-allowed" // Increased top margin, added disabled styles
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="mname">Middle Name</Label>
                                        <Input
                                            id="mname"
                                            type="text"
                                            value={selectedStudent?.Mname || ''}
                                            disabled
                                            className="mt-2 disabled:opacity-80 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="lname">Last Name</Label>
                                        <Input
                                            id="lname"
                                            type="text"
                                            value={selectedStudent?.Lname || ''}
                                            disabled
                                            className="mt-2 disabled:opacity-80 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="username">User Name</Label>
                                        <Input
                                            id="username"
                                            type="text"
                                            value={selectedStudent?.userName || ''}
                                            disabled
                                            className="mt-2 disabled:opacity-80 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="block">Block Number</Label>
                                        <Input
                                            id="block"
                                            type="text"
                                            value={selectedStudent?.blockNum || ''}
                                            disabled
                                            className="mt-2 disabled:opacity-80 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="dorm">Dorm Number</Label>
                                        <Input
                                            id="dorm"
                                            type="text"
                                            value={selectedStudent?.dormId || ''}
                                            disabled
                                            className="mt-2 disabled:opacity-80 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Issue and Description Inputs */}
                        <div className="flex flex-col gap-4 pt-6 mt-6 border-t border-border-muted"> {/* Added top padding, margin, and border */}
                            <h1 className="text-xl font-semibold text-foreground pb-2 border-b border-dashed border-border-muted"> {/* Added separator */}
                                Report Details
                            </h1> {/* Changed heading text */}
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <Label htmlFor="issue">Enter Issue</Label>
                                    <Input
                                        id="issue"
                                        name="issue"
                                        type="text"
                                        value={formData.issue}
                                        onChange={handleInputChange}
                                        placeholder="Enter The issue (max 15 chars)" // Clarified placeholder
                                        maxLength={15}
                                        className="mt-2" // Increased top margin
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description">Enter Description</Label>
                                    <Textarea // Using Textarea is good
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Enter The issue description (max 50 chars)" // Clarified placeholder
                                        maxLength={50}
                                        className="mt-2 min-h-[100px]" // Increased top margin, set minimum height
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="mt-8 flex justify-end"> {/* Increased margin top, aligned button to end */}
                        <Button type="submit" disabled={!isFormValid()}>
                            Submit Report
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </motion.div>
    </div>
);
  // return (
  //   <div className="flex px-4 py-5 overflow-hidden">
  //     <motion.div
  //       initial={{ x: "+100%" }}
  //       animate={{ x: 0 }}
  //       exit={{ x: "-100%" }}
  //       transition={{ duration: 0.99, ease: "easeOut" }}
  //       className="m-auto md:w-[70%] h-max p-6 rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm"
  //     >
  //       <form onSubmit={handleSubmit}>
  //         <Card className="  border-none shadow-none">
  //           <CardHeader>
  //             <CardTitle>Control System</CardTitle>
  //             <CardDescription>
  //               Register any type of wrong doing around dormitory and report
  //               to next level.
  //             </CardDescription>
  //           </CardHeader>
  //           <CardContent>
  //             <div className="flex gap-2 mb-4"> {/* Added margin bottom */}
  //               <Label htmlFor="student-select" className="sr-only">Select Student By Id</Label>
  //               {
  //                 students&&students.length>0&&<Select
  //                 value={formData.studId}
  //                 onValueChange={handleStudentSelectChange} // Corrected handler
  //               >
  //                 <SelectTrigger id="student-select" className="w-full">
  //                   <SelectValue placeholder="Select Student By Id" />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   {students &&
  //                     students.length > 0 ? (
  //                     students.map((stud) => (
  //                       <SelectItem key={stud._id} value={stud._id}>
  //                         {stud.userName} ({stud.Fname} {stud.Lname})
  //                       </SelectItem>
  //                     ))
  //                   ) : (
  //                      <SelectItem value="" disabled>No students available</SelectItem> // Handle empty state
  //                   )}
  //                 </SelectContent>
  //               </Select>}
  //             </div>
  //             {/* Student details section - conditionally render based on selection */}
  //             {canDisplayStudentDetails && (
  //               <div className="flex flex-col gap-3">
  //                 <h1 className="text-xl md:text-2xl font-bold ">User Information</h1>
  // <div className="grid grid-cols-1 gap-4 mt-4"> {/* Increased gap */}
  //                 {/* Using Shadcn Input component */}
  //                 <div>
  //                     <Label htmlFor="fname">First Name</Label>
  //                     <Input
  //                         id="fname"
  //                         type="text"
  //                         value={selectedStudent?.Fname || ''} // Use optional chaining and default to empty string
  //                         disabled
  //                         className="mt-1" // Add spacing
  //                     />
  //                 </div>
  //                  <div>
  //                     <Label htmlFor="mname">Middle Name</Label>
  //                     <Input
  //                         id="mname"
  //                         type="text"
  //                         value={selectedStudent?.Mname || ''}
  //                         disabled
  //                         className="mt-1"
  //                     />
  //                 </div>
  //                 <div>
  //                     <Label htmlFor="lname">Last Name</Label>
  //                     <Input
  //                         id="lname"
  //                         type="text"
  //                         value={selectedStudent?.Lname || ''}
  //                         disabled
  //                         className="mt-1"
  //                     />
  //                 </div>
  //                  <div>
  //                     <Label htmlFor="username">User Name</Label>
  //                     <Input
  //                         id="username"
  //                         type="text"
  //                         value={selectedStudent?.userName || ''}
  //                         disabled
  //                         className="mt-1"
  //                     />
  //                 </div>
  //                  <div>
  //                     <Label htmlFor="block">Block Number</Label>
  //                     <Input
  //                         id="block"
  //                         type="text"
  //                         value={selectedStudent?.blockNum || ''}
  //                         disabled
  //                         className="mt-1"
  //                     />
  //                 </div>
  //                  <div>
  //                     <Label htmlFor="dorm">Dorm Number</Label>
  //                     <Input
  //                         id="dorm"
  //                         type="text"
  //                         value={selectedStudent?.dormId || ''}
  //                         disabled
  //                         className="mt-1"
  //                     />
  //                 </div>

  //               </div>
  //               </div>
              
  //             )}

  //             {/* Issue and Description Inputs */}
  //             <div className="flex flex-col gap-2">
  //               <h1 className="text-lg font-bold "> What happen?</h1>
  //             <div className="grid grid-cols-1 gap-4 mt-6"> {/* Added margin top and gap */}
                 
  //                <div>
  //                    <Label htmlFor="issue">Enter Issue</Label>
  //                    <Input
  //                        id="issue"
  //                        name="issue" // Added name attribute
  //                        type="text"
  //                        value={formData.issue}
  //                        onChange={handleInputChange} // Added handler
  //                        placeholder="Enter The issue max character 15"
  //                        maxLength={15} // Added max length attribute
  //                        className="mt-1"
  //                    />
  //                </div>
  //                <div>
  //                    <Label htmlFor="description">Enter Description</Label>
  //                    {/* Using Textarea for description might be better */}
  //                    <Textarea
  //                        id="description"
  //                        name="description" // Added name attribute
  //                        value={formData.description}
  //                        onChange={handleInputChange} // Added handler
  //                        placeholder="Enter The issue description max character 50"
  //                        maxLength={50} // Added max length attribute
  //                        className="mt-1"
  //                    />
  //                </div>
  //            </div>
  //             </div>
              

  //           </CardContent>
  //           <CardFooter className="mt-4"> {/* Added margin top */}
  //             <Button type="submit" disabled={!isFormValid()}>
  //               Submit
  //             </Button>
  //           </CardFooter>
  //         </Card>
  //       </form>
  //     </motion.div>
  //   </div>
  // );
}


 
