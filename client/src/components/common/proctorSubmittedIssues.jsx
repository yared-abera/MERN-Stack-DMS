import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ExclamationTriangleIcon,
  BuildingOffice2Icon,
  HomeIcon,
  HashtagIcon,
  CalendarIcon,
  UserIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 120, 
      damping: 20 
    }
  },
  hover: { scale: 1.03 }
};

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 130, 
      damping: 20 
    }
  },
};

export default function ProctorSubmittedIssuesComponents({ proctorSubmitedIssue }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDorm, setSelectedDorm] = useState(null);

  const handleViewDetails = (dormData) => {
    setSelectedDorm(dormData);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getUserFullName = (user) => {
    if (!user) return "N/A";
    return `${user.fName || ""} ${user.mName || ""} ${user.LName || ""}`.trim() || "Unnamed User";
  };

  console.log("Proctor Submitted Issues:", proctorSubmitedIssue);

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      className="container mx-auto p-4"
    >
      <motion.div 
        variants={cardVariants}
        className="mb-12 text-center"
      >
        <h2 className="text-lg font-bold text-indigo-700 flex items-center justify-center gap-3">
          <ExclamationTriangleIcon className="h-8 w-8 text-rose-600" />
          <span>Active Maintenance Issues</span>
        </h2>
      </motion.div>

      {proctorSubmitedIssue.length === 0 ? (
        <motion.p 
          variants={cardVariants}
          className="text-center text-gray-500 italic py-12"
        >
          No active maintenance issues reported
        </motion.p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {proctorSubmitedIssue.map((block) =>
              block.floors.map((floor) =>
                floor.dorms.map((dorm, index) => (
                  <motion.div
                    key={dorm._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    whileHover="hover"
                    transition={{ delay: index * 0.1 }}
                    className="h-full"
                  >
                    <Card className="h-full flex flex-col border border-indigo-100 shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader className="bg-gradient-to-r from-amber-950 to-indigo-700 text-white rounded-lg p-4">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <HashtagIcon className="h-5 w-5" />
                            <span>Dorm {dorm.dormNumber}</span>
                          </div>
                          <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
                            Urgent
                          </span>
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="p-4 flex-grow">
                        <div className="space-y-3">
                          <div className="flex items-center text-indigo-900">
                            <BuildingOffice2Icon className="h-5 w-5 mr-2 flex-shrink-0" />
                            <span>Block {block.blockNum} • {block.location.replace('Area', '')}</span>
                          </div>
                          
                          <div className="flex items-center text-indigo-900">
                            <HomeIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                            <span>Floor {floor.floorNumber}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-indigo-50 p-2 rounded-lg">
                              <p className="text-xs text-indigo-600">Capacity</p>
                              <p className="font-semibold text-indigo-700">{dorm.capacity}</p>
                            </div>
                            <div className="bg-indigo-50 p-2 rounded-lg">
                              <p className="text-xs text-indigo-600">Available</p>
                              <p className="font-semibold text-indigo-700">{dorm.totalAvailable}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="p-0">
                        <button
                          onClick={() => handleViewDetails({
                            ...dorm,
                            blockNum: block.blockNum,
                            location: block.location,
                            floorNumber: floor.floorNumber,
                          })}
                          className="w-full px-4 py-3 bg-indigo-100 text-indigo-700 font-medium hover:bg-indigo-200 transition-colors flex items-center justify-center gap-2"
                        >
                          <DocumentTextIcon className="h-5 w-5" />
                          View Full Report
                        </button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              )
            )}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AnimatePresence>
          {isDialogOpen && (
            <DialogContent className="max-w-md rounded-xl p-6 border-indigo-100">
              <motion.div
                variants={dialogVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-indigo-700">
                    <ExclamationTriangleIcon className="h-6 w-6 text-rose-600" />
                    <span>Maintenance Details</span>
                  </DialogTitle>
                </DialogHeader>

                {selectedDorm && (
                  <Card className="border-indigo-100">
                    <CardContent className="p-0 space-y-4">
                      {/* Header Section */}
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold text-indigo-700 flex items-center gap-2">
                          <HashtagIcon className="h-5 w-5" />
                          Dorm {selectedDorm.dormNumber}
                        </h3>
                        <p className="text-sm mt-1 flex items-center gap-2 text-indigo-600">
                          <BuildingOffice2Icon className="h-4 w-4" />
                          Block {selectedDorm.blockNum} • {selectedDorm.location}
                        </p>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 p-4">
                        <div className="space-y-1 p-3 bg-indigo-50 rounded-lg">
                          <p className="text-xs text-indigo-600">Floor Number</p>
                          <p className="font-medium">{selectedDorm.floorNumber}</p>
                        </div>
                        <div className="space-y-1 p-3 bg-rose-50 rounded-lg">
                          <p className="text-xs text-rose-600">Status</p>
                          <p className="font-medium text-rose-700">{selectedDorm.dormStatus}</p>
                        </div>
                        <div className="space-y-1 p-3 bg-indigo-50 rounded-lg">
                          <p className="text-xs text-indigo-600">Capacity</p>
                          <p className="font-medium">{selectedDorm.capacity}</p>
                        </div>
                        <div className="space-y-1 p-3 bg-indigo-50 rounded-lg">
                          <p className="text-xs text-indigo-600">Available Beds</p>
                          <p className="font-medium">{selectedDorm.totalAvailable}</p>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="space-y-4 px-4 pb-4">
                        <div className="p-3 bg-indigo-50 rounded-lg">
                          <p className="text-xs text-indigo-600 mb-1">Reported By</p>
                          <p className="font-medium flex items-center gap-2">
                            <UserIcon className="h-4 w-4" />
                            {getUserFullName(selectedDorm.registerBy)}
                          </p>
                          <p className="text-xs mt-2 text-indigo-600">Report Date</p>
                          <p className="text-sm flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            {formatDate(selectedDorm.registerDate)}
                          </p>
                        </div>

                        <div className="p-3 bg-rose-50 rounded-lg">
                          <p className="text-xs text-rose-600 mb-2">Issue Description</p>
                          <p className="text-sm italic text-rose-700">
                            {selectedDorm.description || "No additional details provided"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>
    </motion.div>
  );
}