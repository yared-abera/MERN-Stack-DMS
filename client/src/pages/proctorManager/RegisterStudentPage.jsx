import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const RegisterStudent = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      {/* Button to Open Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsOpen(true)}>Register Student</Button>
        </DialogTrigger>

        {/* Sliding Modal - Appears Below Header & Right of Sidebar */}
        <DialogContent className="   m-auto z-50">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-[400px]"
          >
            <DialogHeader>
              <DialogTitle>Register Student</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
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
    </div>
  );
};

export default RegisterStudent;
