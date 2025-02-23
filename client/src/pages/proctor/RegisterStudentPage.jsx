import React from 'react';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setUpdateAllocation } from "../../store/common/sidebarSlice";
import { useDispatch, useSelector } from "react-redux";

const RegisterStudentPage = () => { 
  const dispatch = useDispatch();
  const openDialog = useSelector((state) => state.sidebar.updateAllocation);
  const [isOpen, setIsOpen] = useState(openDialog);

    useEffect(() => {
      setIsOpen(openDialog);
    }, [openDialog]);
  
    const handleOpenChange = (newOpenState) => {
      setIsOpen(newOpenState);
      if (!newOpenState) {
        dispatch(setUpdateAllocation(false)); 
      }
    };
  
  return (
    
      <AnimatePresence mode="wait">
         
        {isOpen && (
          <Dialog   open={isOpen} onOpenChange={handleOpenChange}>
          
            <DialogContent className="m-auto z-50   border-none">  
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-[400px]"
              >        
                <DialogHeader className="flex justify-center p-4">
                  <DialogTitle>Register Student</DialogTitle>
                </DialogHeader>
                <form className="space-y-6">
                  <Input placeholder="Student Name" />
                  <Input placeholder="Student ID" />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Block" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="block1">Block 1</SelectItem>
                      <SelectItem value="block2">Block 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" placeholder="Room Number" />
                  <Button type="submit" onClick={() => setIsOpen(false)}>
                    Register Student
                  </Button>
                </form> 
                    </motion.div>
            </DialogContent>
        
          </Dialog>
        )}
       
      </AnimatePresence>
      
    )
};

export default RegisterStudentPage;

 