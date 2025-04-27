import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    registerBlock,
    fetchAvailableProctors,
} from "@/store/blockSlice/index"; // Assuming this path is correct
import img from "../../assets/img/building1.jpg"; // Assuming this path is correct
// Removed RegisterCard import as it wasn't used
// Removed RegisterBlock import (config/data) as it wasn't used
import { toast } from "sonner";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const initialFormData = {
    blockNum: "",
    foundIn: "", // Will be set based on user gender
    isSelectedForSpecialStud: "", // 'Yes' or 'No'
    totalFloors: "",
    selectedProctorIds: [], // <-- Store selected proctor IDs here
};

const MAX_PROCTORS = 3; // Maximum number of proctors allowed

const RegisterBlockComp = () => {
    const dispatch = useDispatch();
    const { availableProctors, loading, error } = useSelector((state) => state.block); // Added loading/error states if needed
    const { user } = useSelector((state) => state.auth);
    const userGender = user?.sex; // Use optional chaining
     console.log(user, "user from RegisterBlockComp"); // Debugging line
     
    const [categorizedProctor, setCategorizedProctor] = useState([]);
    const [isProctorDialogOpen, setIsProctorDialogOpen] = useState(false);
    const [formData, setFormData] = useState(initialFormData);

    // Fetch available proctors on component mount
    useEffect(() => {
        dispatch(fetchAvailableProctors());
    }, [dispatch]);
console.log(availableProctors, "availableProctors"); // Debugging line
console.log(userGender, "userGender"); // Debugging line
    // Filter proctors based on user gender when availableProctors change
    useEffect(() => {
        if (availableProctors && availableProctors.length > 0 && userGender) {
            const proctors = availableProctors
                .filter((pro) => pro.sex.toUpperCase() === userGender.toUpperCase())
                .map((proctor) => ({
                    id: proctor._id, // Make sure this is the correct ID field from your API
                    email: proctor.email,
                    fName: proctor.fName,
                    lName: proctor.lName,
                }));
            setCategorizedProctor(proctors);
        } else {
            setCategorizedProctor([]); // Reset if no proctors or no gender
        }
    }, [availableProctors, userGender]);

    // Set the 'foundIn' field based on user gender
    useEffect(() => {
        if (userGender) {
            const derivedFoundInValue =
                userGender === "female" ? "femaleArea" : "maleArea";
            // Update formData safely
            setFormData((prevFormData) => ({
                ...prevFormData,
                foundIn: derivedFoundInValue,
                // Reset proctors if gender changes, as available proctors might change
                selectedProctorIds: [],
            }));
        } else {
            // Reset if gender becomes unknown
            setFormData((prevFormData) => ({
                ...prevFormData,
                foundIn: "",
                selectedProctorIds: [],
            }));
        }
    }, [userGender]); // Rerun only when userGender changes

    // --- Input Handlers ---
    const handleInputChange = useCallback((event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }, []);

    const handleSelectChange = useCallback((value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            isSelectedForSpecialStud: value,
        }));
    }, []);

    const handleCheckboxChange = useCallback((proctorId, checked) => {
        setFormData((prevFormData) => {
            const currentSelectedIds = prevFormData.selectedProctorIds;
            let newSelectedIds = [];

            if (checked) {
                // Add proctor if not already selected and limit not reached
                if (!currentSelectedIds.includes(proctorId) && currentSelectedIds.length < MAX_PROCTORS) {
                    newSelectedIds = [...currentSelectedIds, proctorId];
                } else {
                    // If limit reached or already selected, return previous state
                    if (currentSelectedIds.length >= MAX_PROCTORS) {
                       toast.warning(`You can select a maximum of ${MAX_PROCTORS} proctors.`);
                    }
                    return prevFormData; // No change needed
                }
            } else {
                // Remove proctor
                newSelectedIds = currentSelectedIds.filter((id) => id !== proctorId);
            }

            return {
                ...prevFormData,
                selectedProctorIds: newSelectedIds,
            };
        });
    }, []); // No dependencies needed as it uses functional state update

    // --- Form Validation ---
    const isFormValid = useCallback(() => {
        const { blockNum, totalFloors, isSelectedForSpecialStud, selectedProctorIds, foundIn } = formData;

        // Basic checks for non-empty fields
        if (!blockNum || !totalFloors || !isSelectedForSpecialStud || !foundIn) {
            return false;
        }

        // Check if totalFloors is a positive number
         if (isNaN(parseInt(totalFloors, 10)) || parseInt(totalFloors, 10) <= 0) {
             return false;
         }

        // Check if at least one proctor is selected (only if proctors are available for selection)
        if (categorizedProctor.length > 0 && selectedProctorIds.length === 0) {
            return false;
        }

        return true;
    }, [formData, categorizedProctor.length]); // Dependencies for validation

    // --- Floor Generation ---
    const generateFloors = (totalFloors) => {
        const floorCount = parseInt(totalFloors, 10);
        if (isNaN(floorCount) || floorCount <= 0) return []; // Handle invalid input
        return Array.from({ length: floorCount }, (_, index) => ({
            floorNumber: index + 1,
            floorStatus: "Available",
            dorms: [],
        }));
    };

    // --- Form Submission ---
    const onSubmit = useCallback(
        async (event) => {
            event.preventDefault();
            if (!isFormValid()) {
                toast.error("Please fill all fields correctly and select at least one proctor if available.");
                return;
            }

            try {
                const floors = generateFloors(formData.totalFloors);
                // Ensure selectedProctorIds is included in the data sent
                const dataToSend = {
                    ...formData,
                    totalFloors: parseInt(formData.totalFloors, 10), // Send as number
                    blockNum: parseInt(formData.blockNum, 10), // Send as number
                    floors,
                    // selectedProctorIds is already part of formData
                };

                console.log("Submitting Data:", dataToSend); // For debugging

                toast.promise(dispatch(registerBlock(dataToSend)).unwrap(), {
                    loading: "Registering block...",
                    success: () => {
                        setFormData(initialFormData); // Reset form on success
                         // Refetch proctors if registration affects availability (optional)
                         dispatch(fetchAvailableProctors());
                         
                    },
                    error: (err) => err.message || "Failed to register block",
                });
            } catch (error) {
                // Catch errors not handled by unwrap (e.g., validation before dispatch)
                toast.error(error.message || "Failed to register block");
                console.error("Submission Error:", error);
            }
        },
        [formData, dispatch, isFormValid] // Include isFormValid in dependencies
    );

    const handleOpenProctorDialog = () => {
        if (categorizedProctor.length === 0) {
            toast.info("No proctors available for your gender.");
            return;
        }
        setIsProctorDialogOpen(true);
    };

    return (
        <div
            className="h-full p-4 md:p-6" // Added padding
            style={{
                backgroundImage: `url(${img})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <form onSubmit={onSubmit}>
                <motion.div
                    initial={{ x: "+100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ duration: 0.99, ease: "easeOut" }}
                    className="m-auto md:w-1/2 p-6 rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm" // Added background for readability
                >
                    <Card className="bg-transparent border-none shadow-none"> {/* Made card transparent */}
                        <CardHeader>
                            <CardTitle>Register Block</CardTitle>
                            <CardDescription>
                                Enter block details and select proctors (max {MAX_PROCTORS}).
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4"> {/* Increased gap */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="blockNum">Block Number</Label>
                                        <Input
                                            id="blockNum"
                                            name="blockNum" // Added name attribute
                                            type="number" // Correct type
                                            placeholder="Enter Block Number"
                                            value={formData.blockNum}
                                            onChange={handleInputChange} // Added onChange
                                            min="1" // Basic validation
                                            required
                                        />
                                    </div>
                                     <div>
                                        <Label htmlFor="totalFloors">Total Floors</Label>
                                        <Input
                                            id="totalFloors"
                                            name="totalFloors" // Added name attribute
                                            type="number" // Correct type
                                            placeholder="Enter Number of Floors"
                                            value={formData.totalFloors}
                                            onChange={handleInputChange} // Added onChange
                                            min="1" // Basic validation
                                            required
                                        />
                                    </div>
                                </div>


                                <div>
                                    <Label htmlFor="foundIn">Found In (Area)</Label>
                                    <Input
                                        id="foundIn"
                                        name="foundIn"
                                        type="text" // Changed type to text
                                        placeholder="Auto-filled based on gender"
                                        value={formData.foundIn}
                                        readOnly // Make it read-only
                                        className="bg-muted" // Style as read-only
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="specialStudSelect">Is Block for Special Students?</Label>
                                    <Select
                                        value={formData.isSelectedForSpecialStud}
                                        onValueChange={handleSelectChange} // Added onValueChange
                                        name="isSelectedForSpecialStud"
                                        required
                                    >
                                        <SelectTrigger id="specialStudSelect" className="w-full md:w-[240px]">
                                            <SelectValue placeholder="Select Yes or No" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Yes">Yes</SelectItem>
                                            <SelectItem value="No">No</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Button
                                        type="button" // Important: Prevent form submission
                                        onClick={handleOpenProctorDialog} // Corrected handler call
                                        disabled={categorizedProctor.length === 0} // Disable if no proctors
                                        variant="outline"
                                    >
                                        Select Proctors ({formData.selectedProctorIds.length} selected)
                                    </Button>
                                     {categorizedProctor.length > 0 && formData.selectedProctorIds.length === 0 && (
                                        <p className="text-xs text-destructive mt-1">Please select at least one proctor.</p>
                                     )}
                                     {categorizedProctor.length === 0 && (
                                         <p className="text-xs text-muted-foreground mt-1">No proctors available for your gender.</p>
                                     )}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={!isFormValid()} className="w-full md:w-auto">
                                {loading ? "Registering..." : "Register Block"}
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </form>

            {/* Proctor Selection Dialog */}
            <Dialog
                open={isProctorDialogOpen}
                onOpenChange={setIsProctorDialogOpen} // Control dialog visibility
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Select Proctors (Max {MAX_PROCTORS})</DialogTitle>
                        <DialogDescription>
                            Choose up to {MAX_PROCTORS} proctors to assign to this block.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto"> {/* Added scroll */}
                        {categorizedProctor && categorizedProctor.length > 0 ? (
                            categorizedProctor.map((proctor) => {
                                const isChecked = formData.selectedProctorIds.includes(proctor.id);
                                const isDisabled =
                                    !isChecked && formData.selectedProctorIds.length >= MAX_PROCTORS;
                                return (
                                    <div
                                        key={proctor.id} // Added key prop
                                        className={`flex items-center space-x-3 p-2 rounded ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${isChecked ? 'bg-muted/50' : ''}`}
                                    >
                                        <Checkbox
                                            id={`proctor-${proctor.id}`}
                                            checked={isChecked}
                                            onCheckedChange={(checked) =>
                                                handleCheckboxChange(proctor.id, checked)
                                            }
                                            disabled={isDisabled} // Disable if max reached and not selected
                                        />
                                        <Label
                                            htmlFor={`proctor-${proctor.id}`}
                                            className={`flex-grow ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            {proctor.fName} {proctor.lName} ({proctor.email})
                                        </Label>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-muted-foreground">No available proctors found for your gender.</p>
                        )}
                    </div>
                     <DialogFooter>
                        <DialogClose asChild>
                           <Button type="button" variant="secondary">
                              Close
                           </Button>
                         </DialogClose>
                     </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RegisterBlockComp;