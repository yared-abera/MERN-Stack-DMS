import { motion } from "framer-motion"; // Import Framer Motion

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeedBackForUser } from "@/store/feedBack/feedBack";

const ViewFeedback = () => {
  const { user } = useSelector((state) => state.auth);
  const { AllFeedBack } = useSelector((state) => state.feedBack);
  const dispatch = useDispatch();

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  useEffect(() => {
    const sex = capitalizeFirstLetter(user.sex);
    dispatch(getFeedBackForUser(sex));
  }, [dispatch]);

  console.log(AllFeedBack, "AllFeedBack");

  // Define animation variants for the individual cards
  const itemVariants = {
    hidden: { opacity: 0, y: 20 }, // Start invisible and slightly below position
    visible: { opacity: 1, y: 0 }, // End visible at original position
  };

  // Define animation variants for the container to stagger the children
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      transition: {
        staggerChildren: 0.08, // Stagger the animation of each child by 0.08 seconds
      },
    },
  };

  // Assuming the component name is FeedbackCard based on the content
  return (
    <div className="w-full p-6 bg-gradient-to-br from-gray-100 to-blue-50 rounded-lg shadow-inner">
      {" "}
      {/* Enhanced main container style */}
      <div className="m-4 w-full">
        {" "}
        {/* Slightly adjusted margin */}
        {/* Apply motion to the grid container to enable staggering */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" // Increased gap
          variants={containerVariants}
          initial="hidden" // Initial state for the container
          animate="visible" // Animate to this state
        >
          {AllFeedBack &&
          AllFeedBack.success &&
          AllFeedBack.data &&
          AllFeedBack.data.length > 0 ? ( // Added null/undefined check for AllFeedBack.data
            AllFeedBack.data.map((stud, index) => (
              // Wrap each Card with motion.div for individual animation
              <motion.div
                key={stud._id || index} // Use unique _id if available, fallback to index
                variants={itemVariants} // Apply the item animation variants
                whileHover={{
                  scale: 1.03,
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                }} // Subtle scale and shadow on hover
                transition={{ type: "spring", stiffness: 400, damping: 17 }} // Smooth hover animation
                className="rounded-lg overflow-hidden" // Ensure border radius is applied and content doesn't overflow
              >
                <Card className="h-full flex flex-col bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out border border-gray-200">
                  {" "}
                  {/* Enhanced Card styling */}
                  <CardHeader className="border-b border-gray-200 pb-4">
                    {" "}
                    {/* Added bottom border to header */}
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {" "}
                      {/* Styled title */}
                      Student: {stud.userId?.Fname || ""}{" "}
                      {stud.userId?.Mname || ""}{" "}
                      {/* Added optional chaining ?. */}
                      {stud.userId?.Lname || ""}{" "}
                      {/* Added optional chaining ?. */}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow p-6 text-gray-700">
                    {" "}
                    {/* Added padding and gray text color */}
                    <p className="mb-2">
                      <span className="font-medium"> 🆔 User Name:</span>{" "}
                      {stud.userId?.userName || ""}
                    </p>{" "}
                    {/* Styled labels */}
                    <p className="mb-2">
                      <span className="font-medium"> 🏘️ Block:</span>{" "}
                      {stud.userId?.blockNum || ""}
                    </p>{" "}
                    {/* Styled labels */}
                    {/* Note: The field mapping here seems potentially incorrect based on the label "Create At". userId.dormId might be Dorm ID, not Create At */}
                    <p className="mb-2">
                      <span className="font-medium">Dorm ID:</span>{" "}
                      {stud.userId?.dormId || ""}
                    </p>{" "}
                    {/* Styled labels */}
                    <p className="mb-2">
                      <span className="font-medium"> 📅Created At:</span>{" "}
                      {stud.createdAt
                        ? new Date(stud.createdAt).toLocaleDateString()
                        : ""}
                    </p>{" "}
                    {/* Formatted date */}
                    <div className="w-auto mt-4 pt-4 border-t border-gray-200">
                      {" "}
                      {/* Styled message section */}
                      <p className="font-medium mb-1">Message:</p>{" "}
                      {/* Styled message label */}
                      <p className="italic text-gray-600 break-words">
                        {stud.description || "No message provided."}
                      </p>{" "}
                      {/* Styled message content, added break-words for long messages */}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            // Styled fallback message
            <div className="col-span-full text-center text-gray-600 p-8 italic bg-white rounded-md shadow">
              No Feedback is Found
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );

  
};
 
export default ViewFeedback;
