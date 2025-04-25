import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getFeedBackForStudent } from "@/store/feedBack/feedBack";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion"; // Import framer-motion
import { User, Calendar, MessageSquare } from "lucide-react"; // Import lucid icons

export default function MyCommnt({ isDialogOpen, HandleRemoveDialog, id }) {
  const [myComments, setMyComments] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFeedBackForStudent({ id })).then((data) => {
      console.log(data, "data"); // Keep console log for debugging if needed
      if (data?.payload.success) {
        setMyComments(data?.payload.data);
      }
    });
  }, [dispatch, id]); // Keep dependencies correct

  return (
    <Dialog open={isDialogOpen} onOpenChange={HandleRemoveDialog}>
      {/* Apply attractive background and text color to DialogContent */}
      <DialogContent className="max-w-2xl h-screen overflow-y-auto bg-gray-600/40 text-gray-100 p-6 rounded-lg shadow-xl">
        <DialogHeader>
          {/* Enhance title appearance */}
          <DialogTitle className="text-2xl font-bold text-blue-400 border-b border-gray-700 pb-4 mb-4">
            See My Comments
          </DialogTitle>
          {/* Description can remain or be styled */}
        </DialogHeader>
        <DialogDescription>
          {/* Use a responsive grid with slightly more space */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myComments && myComments.length > 0 ? (
              myComments.map((item, index) => (
                // Wrap each comment in motion.div for animation
                <motion.div
                  key={item._id}
                  className="bg-gray-800 p-5 rounded-lg shadow-lg border border-gray-700"
                  initial={{ opacity: 0, y: 20 }} // Initial state (hidden, slightly below)
                  animate={{ opacity: 1, y: 0 }} // Animate to (visible, original position)
                  transition={{ duration: 0.4, delay: index * 0.08 }} // Stagger animation
                >
                  {/* Add icons and improve text styling */}
                  <p className="text-sm text-gray-300 mb-1">
                    <User className="inline-block mr-2 h-4 w-4 text-blue-400" />{" "}
                    <span className="font-semibold text-gray-100">Full Name:</span> {item.userId.Fname}{" "}
                    {item.userId.Mname} {item.userId.Lname}
                  </p>
                   {/* Assuming Lname is intended for username display here */}
                  <p className="text-sm text-gray-300 mb-1">
                     <User className="inline-block mr-2 h-4 w-4 text-green-400" />
                     <span className="font-semibold text-gray-100">Username:</span> {item.userId.Lname}
                  </p>
                  {/* Format date slightly and add icon */}
                  <p className="text-sm text-gray-300 mb-3">
                    <Calendar className="inline-block mr-2 h-4 w-4 text-purple-400" />
                    <span className="font-semibold text-gray-100">Create Data :</span>{" "}
                    {new Date(item.createdAt).toLocaleDateString()} {/* Basic date formatting */}
                  </p>
                  {/* Add icon and style message */}
                  <p className="text-base text-gray-200">
                    <MessageSquare className="inline-block mr-2 h-4 w-4 text-yellow-400" />
                    <span className="font-semibold text-gray-100">Message:</span> {item.description}
                  </p>
                  {/* Use a darker separator */}
                  {/* <Separator className="my-4 bg-gray-600" /> */} {/* Separator might not be needed within each card */}
                </motion.div>
              ))
            ) : (
              // Display a message if no comments are available
              <div className="col-span-full text-center text-gray-400 p-8 bg-gray-800 rounded-lg">
                No comments found for this student.
              </div>
            )}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}