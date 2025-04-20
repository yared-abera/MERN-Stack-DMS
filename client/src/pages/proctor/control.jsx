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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DialogTitle } from "@radix-ui/react-dialog";
import { Checkbox } from "@/components/ui/checkbox";
 
export default function ProctorControl() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [students, setStudents] = useState([]);
  const [selectStudentIsOpen, setSelectStudentISopen] = useState(false);

  // Effect 1: Fetch students when the component mounts or user changes
  useEffect(() => {
    const proctorId = user?.id;
    if (proctorId) {
      dispatch(getStudentForProctor(proctorId)).then((action) => {
        const { payload } = action;
        if (payload?.success && Array.isArray(payload?.data)) {
          const fetchedStudents = payload.data;
          setStudents(fetchedStudents);
        }
      });
    }
    // Add user?.id to dependencies to refetch if the user changes
  }, [dispatch, user]);
  console.log(students);

  return (
    <div className="flex px-4 py-5 overflow-hidden">
      <motion.div
        initial={{ x: "+100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.99, ease: "easeOut" }}
        className="m-auto md:w-[70%] h-max p-6 rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm" // Added background for readability
      >
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader>
            <CardTitle>Contro System</CardTitle>
            <CardDescription>
              any type of wrong doing around dormitory is registerd and report
              to next
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Student By Id" />
                </SelectTrigger>
                <SelectContent>
                  {students &&
                    students.length > 0 &&
                    students.map((stud) => (
                      <SelectItem value="light">{}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>

        {/* <Dialog
          open={selectStudentIsOpen}
          onOpenChange={()=>setSelectStudentISopen(false)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select studen by Id</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
{
  students&&students.length>0?students.map(stud=>{
<div className=' flex items-center space-x-3 p-2 rounded'>
  
  <Label>{stud.userName} ({stud.Fname} {stud.Lname}) </Label>
</div>
    

  }):<p>No Student is Found</p>
}



            </div>
          </DialogContent>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </Dialog> */}
      </motion.div>
    </div>
  );
}
