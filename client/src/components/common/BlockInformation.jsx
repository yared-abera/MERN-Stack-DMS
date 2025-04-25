import { getAllBlock } from "@/store/blockSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion"; // Import Framer Motion

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  // Import Dialog components
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger, // Keep DialogTrigger if you want, but we'll use manual control
} from "@/components/ui/dialog";
import {
  // Import Select components
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import { Calendar, User } from "lucide-react";

// Define animation variants for the individual cards
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Define animation variants for the container to stagger the children
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    transition: {
      staggerChildren: 0.08, // Stagger the animation of each child
    },
  },
};

export default function BlockInformations({ ThisCategoryBlock, isLoading }) {
  // State for Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);

  // State for selected floor and dorm within the dialog
  const [selectedFloorIndex, setSelectedFloorIndex] = useState(null);
  const [selectedDormIndex, setSelectedDormIndex] = useState(null);

  // Function to open the dialog and set the selected block
  const handleViewDetail = (block) => {
    setSelectedBlock(block);
    setSelectedFloorIndex(null); // Reset floor selection when opening a new block
    setSelectedDormIndex(null); // Reset dorm selection when opening a new block
    setDialogOpen(true);
  };

  // Function to calculate fill percentage and color
  const getCapacityFillStyle = (available, capacity) => {
    if (capacity === 0) return { width: "0%", backgroundColor: "#d1d5db" }; // Gray if no capacity
    const percentage = (available / capacity) * 100;
    let color = "#22c55e"; // Green (default high availability)

    if (percentage <= 25) {
      color = "#ef4444"; // Red (low availability)
    } else if (percentage <= 60) {
      // User requested color change around 60% gap of 25%
      color = "#f59e0b"; // Yellow (medium availability)
    } else {
      color = "#22c55e"; // Green (high availability > 60%)
    }

    return { width: `${percentage}%`, backgroundColor: color };
  };

  // Get selected floor object
  const selectedFloor = selectedBlock?.floors?.[selectedFloorIndex] || null;

  // Get selected dorm object
  const selectedDorm = selectedFloor?.dorms?.[selectedDormIndex] || null;

  // console.log(AllBlock, "AllBlock"); // Keep logs if needed for debugging
  console.log(ThisCategoryBlock, "ThisCategoryBlock"); // Keep logs if needed for debugging
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handles null, undefined, or empty string
    try {
      // Attempt to create a Date object from the string
      const date = new Date(dateString);

      // Check if the date is valid after parsing
      if (isNaN(date.getTime())) {
        console.error("Invalid date string:", dateString);
        return "Invalid Date";
      }

      // Options for formatting the date and time
      const options = {
        year: "numeric",
        month: "long", // e.g., "April"
        day: "numeric", // e.g., "21"
        hour: "2-digit", // e.g., "06 PM"
        minute: "2-digit", // e.g., "17"
        // Optional: add timezone if needed
        // timeZoneName: 'short',
      };

      // Format the date using the user's locale
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      // Catch potential errors during date parsing or formatting
      console.error("Error formatting date:", dateString, error);
      return "Invalid Date";
    }
  };
  return (
    <div className="flex flex-col overflow-hidden min-h-screen  bg-gray-100 dark:bg-slate-700/40 p-6">
      {" "}
      {/* Adjusted padding */}
      <div className="flex flex-col gap-4 mb-6">
        {" "}
        {/* Added margin-bottom */}
        <h1 className="text-2xl font-bold text-gray-800">
          Block Information
        </h1>{" "}
        {/* Styled title */}
        {/* Apply motion to the grid container */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {isLoading ? (
            <div className="col-span-full text-center text-gray-600 p-8">
              Loading blocks...
            </div>
          ) : ThisCategoryBlock && ThisCategoryBlock.length > 0 ? (
            ThisCategoryBlock.map((block, index) => (
              <motion.div
                key={block._id || index}
                variants={itemVariants}
                whileHover={{
                  scale: 1.03,
                  rotate: -1,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                  rotate: { type: "spring", velocity: 15 },
                }}
                className="rounded-xl overflow-hidden h-full"
              >
                <Card className="h-full flex flex-col bg-gradient-to-br from-green-500 to-purple-600 shadow-xl hover:shadow-2xl transition-all duration-300 border-0">
                  <CardHeader className="px-6 pt-6 pb-4 border-b border-white/10">
                    <CardTitle className="text-xl font-bold text-white">
                      Block {block.blockNum}
                      <span className="block text-sm font-normal mt-1 text-indigo-100">
                        {block.location}
                      </span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-grow px-6 py-4 space-y-2 text-indigo-50">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Floors</span>
                      <span className="font-bold text-white">
                        {block.totalFloors}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Status</span>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          block.status === "Available"
                            ? "bg-green-100 text-green-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {block.status}
                      </span>
                    </div>

                    {/* Animated Capacity Bar */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-indigo-100">
                          Availability
                        </span>
                        <span className="font-bold text-white">
                          {block.totalAvailable}/{block.totalCapacity}
                        </span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={getCapacityFillStyle(
                            block.totalAvailable,
                            block.totalCapacity
                          )}
                          transition={{ duration: 1.5, type: "spring" }}
                          style={{
                            background: `linear-gradient(90deg, 
                      ${
                        block.totalAvailable / block.totalCapacity > 0.6
                          ? "#4ade80"
                          : block.totalAvailable / block.totalCapacity > 0.25
                          ? "#facc15"
                          : "#f87171"
                      }, 
                      ${
                        block.totalAvailable / block.totalCapacity > 0.6
                          ? "#22d3ee"
                          : block.totalAvailable / block.totalCapacity > 0.25
                          ? "#fb923c"
                          : "#ef4444"
                      })`,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="px-6 pb-6 pt-4 border-t border-white/10">
                    <Button
                      onClick={() => handleViewDetail(block)}
                      size="sm"
                      className="w-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
                    >
                      <span className="mr-2">🔍</span>
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600 text-lg italic p-8 bg-white rounded-md shadow">
              No Blocks Found for your category.
            </div>
          )}
        </motion.div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[700px] p-8 max-h-[90vh] overflow-y-auto dark:bg-slate-50 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold  text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Block {selectedBlock?.blockNum || ""} Details
            </DialogTitle>
          </DialogHeader>

          {selectedBlock && (
            <div className="mt-4 space-y-8 text-gray-700">
              {/* Block Summary */}
              <div className="pb-6 border-b border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">📍</span>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Location
                      </p>
                      <p className="font-semibold">{selectedBlock.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-500">🏷️</span>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Status
                      </p>
                      <p
                        className={`font-semibold ${
                          selectedBlock.status === "Available"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedBlock.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">🏢</span>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Floors
                      </p>
                      <p className="font-semibold">
                        {selectedBlock.totalFloors}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-500">👥</span>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Capacity
                      </p>
                      <p className="font-semibold">
                        {selectedBlock.totalCapacity}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Block proctors
                    </p>
                    <div className="flex flex-col gap-1">
                      {selectedBlock.assignedProctors &&
                      selectedBlock.assignedProctors.length > 0 ? (
                        selectedBlock.assignedProctors.map((pro) => (
                          <div key={pro._id}>
                            <Label className="font-semibold">
                              {" "}
                              Full name : {pro.fName} {pro.mName} {pro.lName}
                            </Label>{" "}
                          </div>
                        ))
                      ) : (
                        <p className="font-semibold text-gray-400">
                          email: {pro.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
                    <p className="text-xl font-bold text-indigo-600 mb-4 font-sans">
                      Block Registration Details
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-gray-700 font-medium w-48">
                          Special Student Block:
                        </span>
                        <span
                          className={`font-semibold ${
                            selectedBlock.isSelectedForSpecial
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {selectedBlock.isSelectedForSpecial ? "Yes" : "No"}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="text-gray-700 font-medium w-48">
                          Registered By:
                        </span>
                        <span className="text-gray-900 font-medium">
                          {selectedBlock.registerBy || "N/A"}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="text-gray-700 font-medium w-48">
                          Registration Date:
                        </span>
                        <span className="text-gray-900 font-medium">
                          <p className="font-semibold">
                            {formatDate(selectedBlock.registerDate)}
                          </p>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floors Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Floor Details
                </h3>

                {selectedBlock.floors?.length > 0 ? (
                  selectedBlock.floors.map((floor, floorIndex) => (
                    <div
                      key={floorIndex}
                      className="border p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Floor Number</p>
                          <p className="font-semibold text-lg">
                            #{floor.floorNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              floor.floorStatus === "Available"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {floor.floorStatus}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Capacity</p>
                          <p className="font-semibold">{floor.floorCapacity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Available</p>
                          <p className="font-semibold text-blue-600">
                            {floor.totalAvailable}
                          </p>
                        </div>
                      </div>

                      {/* Dorm Selection */}
                      {floor.dorms?.length > 0 ? (
                        <div className="pt-4 border-t border-gray-100">
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Select Dormitory
                          </label>
                          <Select
                            onValueChange={(value) => {
                              const dormIndex = floor.dorms.findIndex(
                                (d) => d.dormNumber === value
                              );
                              setSelectedFloorIndex(floorIndex);
                              setSelectedDormIndex(dormIndex);
                            }}
                            value={
                              selectedFloorIndex === floorIndex &&
                              selectedDormIndex !== null
                                ? floor.dorms[selectedDormIndex].dormNumber
                                : ""
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose a dorm..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg">
                              {floor.dorms.map((dorm, dormIndex) => (
                                <SelectItem
                                  key={dormIndex}
                                  value={dorm.dormNumber}
                                  className="hover:bg-gray-50"
                                >
                                  <span className="flex justify-between w-full">
                                    <span>Dorm {dorm.dormNumber}</span>
                                    <span
                                      className={`text-sm ${
                                        dorm.dormStatus === "Full"
                                          ? "text-red-500"
                                          : "text-green-500"
                                      }`}
                                    >
                                      ({dorm.dormStatus})
                                    </span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 text-center py-3">
                          No dorms available on this floor
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-gray-500">
                      No floor information available
                    </p>
                  </div>
                )}
              </div>

              {/* Selected Dorm Details */}
              {selectedDorm && (
                <div className="pt-6 mt-6 border-t border-gray-100">
                  <div className="bg-blue-50/30 p-5 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Dorm {selectedDorm.dormNumber} Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Total Capacity</p>
                        <p className="font-semibold">{selectedDorm.capacity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Available Beds</p>
                        <p className="font-semibold text-green-600">
                          {selectedDorm.totalAvailable}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Allocated Students
                        </p>
                        <p className="font-semibold">
                          {selectedDorm.studentsAllocated}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Current Status</p>
                        <p
                          className={`font-semibold ${
                            selectedDorm.dormStatus === "Full"
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {selectedDorm.dormStatus}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
