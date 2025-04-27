import React, { useState, useCallback, useEffect } from "react";
import { registerDorm, updateDormStatus } from "@/store/dormSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchProctorBlocks } from "@/store/blockSlice/index";
// Removed: import RegisterCard from "@/components/common/RegisterCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import img from "@/assets/unique/building.jpeg";
import { toast } from "sonner";
// Removed: import axios from "axios"; // Assuming axios is used within thunks
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // Added: Import Input component
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

// Configuration for Dorm Registration form - Kept as it helps structure options logic
 const RegisterDorm = [
  { label: "Select Block", name: "blockId", componentType: "select", options: [] },
  { label: "Select Floor", name: "floorNumber", componentType: "select", options: [] },
  { label: "Start Dorm Number", name: "startDormNumber", placeholder: "Enter Starting Dorm Number", type: "number", componentType: "input" },
  { label: "End Dorm Number", name: "endDormNumber", placeholder: "Enter Ending Dorm Number", type: "number", componentType: "input" },
  { label: "Capacity Per Dorm", name: "capacity", placeholder: "Enter Capacity Per Dorm", type: "number", componentType: "input" },
];

// Updated initial form data
const initialFormData = { blockId: "", floorNumber: "", startDormNumber: "", endDormNumber: "", capacity: "" };

const RegisterDormComp = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormData);
  const [formConfig, setFormConfig] = useState(RegisterDorm);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [maintenanceDorms, setMaintenanceDorms] = useState(new Set());
  const [usedDorms, setUsedDorms] = useState(new Set());
  // Removed: const [registeredFloors, setRegisteredFloors] = useState(new Set());
  const { list: blocks } = useSelector((state) => state.block);
  // Removed: const [selectedBlockId, setSelectedBlockId] = useState(""); // Not strictly needed now formData handles this
  // Removed: const [selectedFloorNumber, setSelectedFloorNumber] = useState(""); // Not strictly needed now formData handles this
  const { user } = useSelector((state) => state.auth);
  // Added a check for user and user.id existence
  const userId = user?.id;

  // New state for per-dorm descriptions
  const [descriptions, setDescriptions] = useState({});
  const [loading, setLoading] = useState(false); // Added: Loading state for submit button

  // Removed: const[unRegisterdDorms,setUnRegisteredDorms]=useState([])
  // Removed: const [registeredDorms, setRegisteredDorms] = useState([]); // Removed: State to track registered dorms

  useEffect(() => {
      dispatch(fetchProctorBlocks());
  }, [dispatch]);

  // Effect to update Block options when blocks data changes
useEffect(() => {
    const updatedConfig = formConfig.map((field) => {
      if (field.name === "blockId") {
      return {
        ...field,
          options: blocks.map((block) => ({ id: block._id, label: `Block ${block.blockNum} (${block.location})`, value: block._id })),
      };
    }
    return field;
  });
  setFormConfig(updatedConfig);
  }, [blocks]); // Depend on blocks

  // Effect to update Floor options when blockId changes in formData
useEffect(() => {
    const selectedBlock = blocks.find((b) => b._id === formData.blockId);
    const floorOptions = selectedBlock?.floors?.map((floor) => ({ id: floor.floorNumber.toString(), label: `Floor ${floor.floorNumber}`, value: floor.floorNumber.toString() })) || [];

    setFormConfig(prevConfig =>
      prevConfig.map((field) => {
        if (field.name === "floorNumber") {
          return { ...field, options: floorOptions };
    }
    return field;
      })
    );
  }, [formData.blockId, blocks]); // Depend on formData.blockId and blocks

  // Modified handlers to directly accept value from Select component
  const handleBlockChange = (value) => {
    setFormData({ ...formData, blockId: value, floorNumber: "" });
  };

  const handleFloorChange = (value) => {
    setFormData({ ...formData, floorNumber: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isFormValid = () => {
    const requiredFields = ["blockId", "floorNumber", "startDormNumber", "endDormNumber", "capacity"];
    const allFieldsFilled = requiredFields.every((fieldName) => formData[fieldName] !== "");

    const start = parseInt(formData.startDormNumber);
    const end = parseInt(formData.endDormNumber);
    const capacity = parseInt(formData.capacity);

    const validNumbers = !isNaN(start) && !isNaN(end) && !isNaN(capacity) && capacity > 0;
    const validRange = validNumbers ? end >= start : false;

    return allFieldsFilled && validNumbers && validRange;
  };


  const handleStatusClick = (status) => {
    if (!isFormValid()) {
      toast.error("Please fill all required fields correctly first");
      return;
    }
    setSelectedStatus(status);
    setDialogOpen(true);
  };

  const toggleDormExclusion = (dormNum) => {
    const setUpdater = selectedStatus === "maintenance" ? setMaintenanceDorms : setUsedDorms;
    const currentSet = selectedStatus === "maintenance" ? maintenanceDorms : usedDorms;

    setUpdater((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dormNum)) {
        newSet.delete(dormNum);
        // Also remove description if deselected
        setDescriptions((d) => {
          const copy = { ...d
          };
          delete copy[dormNum];
          return copy;
        });
      } else {
        newSet.add(dormNum);
      }
      return newSet;
    });
  };


  const handleDescriptionChange = (dormNum) => (e) => {
    const value = e.target.value;
    setDescriptions((prev) => ({ ...prev, [dormNum]: value }));
  };

  const handleSaveExclusions = async () => {
    try {
      // No longer updating status here, status is set during registration
      // This button is now just to confirm selections before registration
      // The actual status update logic is handled in onSubmit
      toast.info(`Dorms selected as ${selectedStatus}. Proceed to registration.`);
      setDialogOpen(false);
    } catch (error) {
      // Removed actual update logic from here, so error handling changes
      console.error("Error saving exclusions:", error);
      // toast.error("Failed to save exclusion status"); // Removed as update no longer happens here
      setDialogOpen(false); // Still close dialog
    }
  };

  const getDormStatus = (dormNum) => {
    if (maintenanceDorms.has(dormNum)) return "Under Maintenance";
    if (usedDorms.has(dormNum)) return "Used By Other People";
    return null; // Available dorms aren't marked in these sets
  };

  const getDormRange = () => {
    const start = parseInt(formData.startDormNumber);
    const end = parseInt(formData.endDormNumber);
    // Check if start and end are valid numbers and start <= end before generating range
    if (!isNaN(start) && !isNaN(end) && start <= end) {
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
    return []; // Return empty array if range is invalid
  };

console.log(maintenanceDorms ,"MaintenanceIssue"); // Debugging line to check state

 
  const onSubmit = async (e) => {
      e.preventDefault();
      
      if (!isFormValid()) {
          toast.error("Please fill all fields correctly before registering.");
          return;
        }

        if (!userId) {
           toast.error("User not authenticated. Cannot register dorms.");
        return;
      }

        setLoading(true); // Start loading

        const start = parseInt(formData.startDormNumber);
        const end = parseInt(formData.endDormNumber);
        const capacity = parseInt(formData.capacity);

        const succeededDorms = []; // Local array to track successfully registered dorms
        const failedDorms = []; // Local array to track failed dorm registrations

        for (let dormNum = start; dormNum <= end; dormNum++) {
          const dormStatus = maintenanceDorms.has(dormNum) ? "MaintenanceIssue" : usedDorms.has(dormNum) ? "UnAvailable" : "Available";
          const dormData = {
            blockId: formData.blockId,
            floorNumber: formData.floorNumber,
            dormNumber: dormNum.toString(),
            capacity: capacity,
            status: dormStatus, // Use derived status
            description: descriptions[dormNum] || "",
            registerBy: userId, // Correctly using userId
          };

          console.log(`Attempting to register dorm ${dormNum} with data:`, dormData);

          // Dispatch action and handle promise result
          const response = await dispatch(registerDorm(dormData));

          if (registerDorm.fulfilled.match(response)) { // Check if the specific thunk action was fulfilled
            console.log(`Dorm ${dormNum} registered successfully`, response.payload);
            succeededDorms.push(dormNum); // Add to success list
          } else {
            console.error(`Failed to register dorm ${dormNum}:`, response.error || response.payload);
            failedDorms.push(dormNum); // Add to failure list
            // Optionally show a toast for each failure if desired, but one final toast is often better
            // toast.error(`Failed to register dorm ${dormNum}`);
          }
        }

        setLoading(false); // End loading

        // Show final toasts based on local lists
        if (succeededDorms.length > 0 && failedDorms.length === 0) {
          toast.success(`Dorms ${succeededDorms.join(', ')} registered successfully`);
          // Optional: Reset form and exclusion states after full success
          setFormData(initialFormData);
          setMaintenanceDorms(new Set());
          setUsedDorms(new Set());
          setDescriptions({});
        } else if (succeededDorms.length > 0 && failedDorms.length > 0) {
          toast.warning(`Registered dorms ${succeededDorms.join(', ')}. Failed to register dorms ${failedDorms.join(', ')}. Check console for details.`);
          // Optional: Reset only succeeded dorms from exclusion sets? Or leave them?
          // For now, let's clear exclusions only on full success for simplicity.
        }
        else if (failedDorms.length > 0 && succeededDorms.length === 0) {
          toast.error(`Failed to register all dorms (${failedDorms.join(', ')}). Check console for details.`);
        } else {
           // This case should ideally not happen if form is valid and loop runs
            toast.info("No dorms were attempted for registration.");
         }
      };


  const getBlockOptions = () => {
    const field = formConfig.find(f => f.name === "blockId");
    return field ? field.options : [];
  }

  const getFloorOptions = () => {
    const field = formConfig.find(f => f.name === "floorNumber");
    return field ? field.options : [];
  }


  return (
    <>
      <div className="border-2 border-blue-600 min-h-screen py-8" style={{ backgroundImage: `url(${img})`, backgroundPosition: "center", backgroundSize: "cover" }}>
        {/* Removed the empty div that previously wrapped RegisterCard */}

        <form onSubmit={onSubmit}>
          <motion.div
            initial={{ x: "+100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.99, ease: "easeOut" }}
            className="m-auto md:w-1/2 p-6 rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm"
          >
            <Card className="bg-transparent border-none shadow-none">
              <CardHeader>
                <CardTitle>Register Dorms</CardTitle>
                <CardDescription>
                  Enter dorm details and select statuses for specific dorms.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6"> {/* Increased gap */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Block Select */}
                    <div>
                      <Label htmlFor="blockId">Select Block</Label>
                      <Select
                        value={formData.blockId}
                        onValueChange={handleBlockChange} // Pass value directly
                        name="blockId"
                        required
                      >
                        <SelectTrigger id="blockId" className="w-full">
                          <SelectValue placeholder="Select Block" />
                        </SelectTrigger>
                        <SelectContent>
                          {getBlockOptions().map((option) => (
                            <SelectItem key={option.id} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Floor Select */}
                    <div>
                      <Label htmlFor="floorNumber">Select Floor</Label>
                      <Select
                        value={formData.floorNumber}
                        onValueChange={handleFloorChange} // Pass value directly
                        name="floorNumber"
                        required
                        disabled={!formData.blockId} // Disable until block is selected
                      >
                        <SelectTrigger id="floorNumber" className="w-full">
                          <SelectValue placeholder="Select Floor" />
                        </SelectTrigger>
                        <SelectContent>
                           {getFloorOptions().map((option) => (
                             <SelectItem key={option.id} value={option.value}>
                               {option.label}
                             </SelectItem>
                           ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Dorm Number and Capacity Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <Label htmlFor="startDormNumber">Start Dorm Number</Label>
                        <Input
                            id="startDormNumber"
                            name="startDormNumber"
                            type="number" // Corrected type
                            placeholder="Enter Starting Dorm Number" // Corrected placeholder
                            value={formData.startDormNumber}
                            onChange={handleInputChange} // Use generic handler
                            required
                            min="1" // Added basic validation
                        />
                    </div>
                    <div>
                        <Label htmlFor="endDormNumber">End Dorm Number</Label>
                        <Input
                            id="endDormNumber"
                            name="endDormNumber"
                            type="number" // Corrected type
                            placeholder="Enter Ending Dorm Number" // Corrected placeholder
                            value={formData.endDormNumber}
                            onChange={handleInputChange} // Use generic handler
                            required
                             min={formData.startDormNumber || "1"} // Added basic validation
                        />
                    </div>
                  </div>

                   <div>
                        <Label htmlFor="capacity">Capacity Per Dorm</Label>
                        <Input
                            id="capacity"
                            name="capacity"
                            type="number" // Corrected type
                            placeholder="Enter Capacity Per Dorm" // Corrected placeholder
                            value={formData.capacity}
                            onChange={handleInputChange} // Use generic handler
                            required
                            min="1" // Added basic validation
                        />
                    </div>

                  {/* Status Buttons */}
                  <div className="flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-4 mt-4 p-4">
                    <Button variant="destructive" type="button" onClick={() => handleStatusClick("maintenance")} disabled={!isFormValid()}>
                      Under Maintenance ({maintenanceDorms.size})
                    </Button>
                    <Button variant="destructive" type="button" onClick={() => handleStatusClick("used")} disabled={!isFormValid()}>
                      Used By Other People ({usedDorms.size})
                    </Button>
                  </div>

                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={!isFormValid() || loading} className="w-full">
                  {loading ? "Registering..." : "Register Dorms"} {/* Corrected button text */}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </form>
      </div>

      {/* Dialog for status selection */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select {selectedStatus === "maintenance" ? "Maintenance" : "Used"} Dorms</DialogTitle>
            <DialogDescription>Select the dorms that are {selectedStatus === "maintenance" ? "under maintenance" : "used by other people"}.</DialogDescription> {/* Clarified description */}
          </DialogHeader>

          {getDormRange().length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 max-h-[400px] overflow-y-auto">
            {getDormRange().map((dormNum) => {
              const currentStatus = getDormStatus(dormNum);
              // A dorm is disabled in this dialog if it's already marked with the *other* status
              const isDisabled = currentStatus && currentStatus !== (selectedStatus === "maintenance" ? "Under Maintenance" : "Used By Other People");
              const isChecked = (selectedStatus === "maintenance" && maintenanceDorms.has(dormNum)) || (selectedStatus === "used" && usedDorms.has(dormNum));

  return (
                <div key={dormNum} className={`border p-2 rounded-md shadow-sm ${isDisabled ? 'bg-gray-100' : ''}`}> {/* Added disabled styling */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`dorm-${dormNum}`}
                      checked={isChecked}
                      disabled={isDisabled}
                      onCheckedChange={() => toggleDormExclusion(dormNum)} // Simpler handler call
                    />
                    <label htmlFor={`dorm-${dormNum}`} className={`text-sm ${isDisabled ? "text-gray-400" : "text-gray-700"} flex-grow cursor-pointer`}> {/* Added flex-grow and cursor */}
                      Dorm {dormNum}
                      {isDisabled && <span className="ml-1 text-xs text-red-500">({currentStatus})</span>}
                    </label>
                  </div>
                  {isChecked && (
                    <div className="mt-2">
                      <Label htmlFor={`description-${dormNum}`}>Description</Label>
                      <Textarea
                        id={`description-${dormNum}`}
                        name={`description-${dormNum}`}
                        value={descriptions[dormNum] || ''}
                        onChange={handleDescriptionChange(dormNum)}
                        placeholder="Enter issue (max 50 chars)"
                        maxLength={50}
                        className="mt-1"
      />
    </div>
                  )}
                </div>
              );
            })}
          </div>
          ) : (
             <div className="text-center text-gray-500">Please enter a valid range of dorm numbers.</div>
          )}


          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)} type="button">Cancel</Button> {/* Added type="button" */}
            <Button onClick={handleSaveExclusions} type="button">Done Selecting</Button> {/* Changed text, added type="button" */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegisterDormComp;