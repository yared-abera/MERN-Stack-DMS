// components/DormRegistrationForm.js
import React, { useState, useCallback, useEffect } from 'react';
import { registerDorm, updateDormStatus } from '@/store/dormSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProctorBlocks } from '@/store/blockSlice/index';
import RegisterCard from "@/components/common/RegisterCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import img from "@/assets/unique/building.jpeg";
import { toast } from 'sonner';
import axios from 'axios';

// Configuration for Dorm Registration form
 const RegisterDorm = [
  {
    label: "Select Block",
    name: "blockId",
    componentType: "select",
    options: [],
  },
  {
    label: "Select Floor",
    name: "floorNumber",
    componentType: "select",
    options: [],
  },
  {
    label: "Start Dorm Number",
    name: "startDormNumber",
    placeholder: "Enter Starting Dorm Number",
    type: "number",
    componentType: "input"
  },
  {
    label: "End Dorm Number",
    name: "endDormNumber",
    placeholder: "Enter Ending Dorm Number",
    type: "number",
    componentType: "input"
  },
  {
    label: "Capacity Per Dorm",
    name: "capacity",
    placeholder: "Enter Capacity Per Dorm",
    type: "number",
    componentType: "input"
  },
];

// Updated initial form data
const initialFormData = {
  blockId: "",
  floorNumber: "",
  startDormNumber: "",
  endDormNumber: "",
  capacity: ""
};

const RegisterDormComp = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormData);
  const [formConfig, setFormConfig] = useState(RegisterDorm);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [maintenanceDorms, setMaintenanceDorms] = useState(new Set());
  const [usedDorms, setUsedDorms] = useState(new Set());
  const [registeredFloors, setRegisteredFloors] = useState(new Set());
  const { list: blocks } = useSelector((state) => state.block);
  const [selectedBlockId, setSelectedBlockId] = useState('');
  const [selectedFloorNumber, setSelectedFloorNumber] = useState('');

  useEffect(() => {
      dispatch(fetchProctorBlocks());
  }, [dispatch]);

 // Update form configuration when blocks change
useEffect(() => {
  const updatedConfig = formConfig.map(field => {
    if(field.name === 'blockId') {
      return {
        ...field,
        options: blocks.map(block => ({
          id: block._id,
          label: `Block ${block.blockNum} (${block.location})`,
          value: block._id  
        }))
      };
    }
    return field;
  });
  
  setFormConfig(updatedConfig);
}, [blocks]);

// Update floor options when block is selected
useEffect(() => {
  const selectedBlock = blocks.find(b => b._id === formData.blockId);
  const floorOptions = selectedBlock?.floors?.map(floor => ({
    id: floor.floorNumber.toString(),
    label: `Floor ${floor.floorNumber}`,
      value: floor.floorNumber.toString()
  })) || [];

  const updatedConfig = formConfig.map(field => {
    if(field.name === 'floorNumber') {
      return {
        ...field,
        options: floorOptions
      };
    }
    return field;
  });

  setFormConfig(updatedConfig);
}, [formData.blockId]);

  // Handle block selection change
  const handleBlockChange = (e) => {
    const blockId = e.target.value;
    setSelectedBlockId(blockId);
    setFormData({
      ...formData,
      blockId,
      floorNumber: '' // Reset floor when block changes
    });
  };

  // Handle floor selection change
  const handleFloorChange = (e) => {
    const floorNumber = e.target.value;
    setSelectedFloorNumber(floorNumber);
    setFormData({
      ...formData,
      floorNumber
    });
  };

  const isFormValid = () => {
    const allFieldsFilled = Object.values(formData).every(value => value !== "");
    const validRange = parseInt(formData.endDormNumber) >= parseInt(formData.startDormNumber);
    return allFieldsFilled && validRange;
  };

  const handleStatusClick = (status) => {
    if (!isFormValid()) {
      toast.error("Please fill all fields first");
      return;
    }
    setSelectedStatus(status);
    setDialogOpen(true);
  };

  const toggleDormExclusion = (dormNum) => {
    if (selectedStatus === 'maintenance') {
      setMaintenanceDorms(prev => {
        const newSet = new Set(prev);
        if (newSet.has(dormNum)) {
          newSet.delete(dormNum);
        } else {
          newSet.add(dormNum);
        }
        return newSet;
      });
    } else if (selectedStatus === 'used') {
      setUsedDorms(prev => {
        const newSet = new Set(prev);
        if (newSet.has(dormNum)) {
          newSet.delete(dormNum);
        } else {
          newSet.add(dormNum);
        }
        return newSet;
      });
    }
  };

  const handleSaveExclusions = async () => {
    try {
      const dormsToUpdate = selectedStatus === 'maintenance' ? maintenanceDorms : usedDorms;
      const status = selectedStatus === 'maintenance' ? 'Under Maintenance' : 'Used By Other People';

      // Update each dorm's status
      for (const dormNum of dormsToUpdate) {
        await dispatch(updateDormStatus({
          blockId: formData.blockId,
          floorNumber: formData.floorNumber,
          dormNumber: dormNum.toString(),
          status: status
        }));
      }

      toast.success(`Selected dorms marked as ${status}`);
      setDialogOpen(false);
      
      // Don't clear the selections after saving
      // This allows users to see which dorms are marked
    } catch (error) {
      console.error('Error updating dorm status:', error);
      toast.error('Failed to update dorm status');
    }
  };

  const getDormStatus = (dormNum) => {
    if (maintenanceDorms.has(dormNum)) return "Under Maintenance";
    if (usedDorms.has(dormNum)) return "Used By Other People";
    return null;
  };

  const getDormRange = () => {
    const start = parseInt(formData.startDormNumber);
    const end = parseInt(formData.endDormNumber);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const onSubmit = async (e) => {
      e.preventDefault();
    
    // Validate form data
    if (!formData.blockId || !formData.floorNumber || !formData.startDormNumber || !formData.endDormNumber || !formData.capacity) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const start = parseInt(formData.startDormNumber);
      const end = parseInt(formData.endDormNumber);
      
      if (isNaN(start) || isNaN(end) || start > end) {
        toast.error('Invalid dorm range');
        return;
      }

      // Check if any dorm in the range already exists
      const existingDorms = [];
      const promises = [];
      
      for (let dormNum = start; dormNum <= end; dormNum++) {
        // Skip dorms that are in maintenance or already used
        if (maintenanceDorms.has(dormNum) || usedDorms.has(dormNum)) {
          continue;
        }

        const dormData = {
          blockId: formData.blockId,
          floorNumber: formData.floorNumber,
          dormNumber: dormNum.toString(),
          capacity: parseInt(formData.capacity),
          status: "Available" // Set default status to Available
        };

        // Check if this dorm already exists
        try {
          const response = await axios.get(
            `http://localhost:9000/api/dorm/${formData.blockId}/floors/${formData.floorNumber}/dorms/${dormNum}`,
            { withCredentials: true }
          );
          
          if (response.data && response.data.exists) {
            existingDorms.push(dormNum);
          } else {
            promises.push(dispatch(registerDorm(dormData)));
          }
        } catch (error) {
          // If the error is 404 (not found), the dorm doesn't exist, so we can register it
          if (error.response && error.response.status === 404) {
            promises.push(dispatch(registerDorm(dormData)));
          } else {
            console.error(`Error checking dorm ${dormNum}:`, error);
          }
        }
      }

      if (existingDorms.length > 0) {
        toast.error(`Dorms ${existingDorms.join(', ')} already exist on this floor. Please choose different dorm numbers.`);
        return;
      }

      if (promises.length === 0) {
        toast.error('No dorms available to register');
        return;
      }

      await Promise.all(promises);
      toast.success('Dorms registered successfully');
      
      // Reset form but keep the block and floor selections
      setFormData({
        blockId: selectedBlockId,
        floorNumber: selectedFloorNumber,
        startDormNumber: '',
        endDormNumber: '',
        capacity: ''
      });
      
      // Clear maintenance and used dorms after successful registration
      setMaintenanceDorms(new Set());
      setUsedDorms(new Set());
    } catch (error) {
      console.error('Error registering dorms:', error);
      toast.error(error.message || 'Failed to register dorms');
    }
  };
 
  return (
    <>
    <div className="border-2 border-blue-600 min-h-screen"
        style={{
          backgroundImage: `url(${img})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        >
        <div className="flex flex-col space-y-4">
      <RegisterCard
        RegisterBlock={formConfig}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isFormValid={isFormValid}
        cardTitle="Register New Dorm"
            buttonText="Register Available Dorms"
            onBlockChange={handleBlockChange}
            onFloorChange={handleFloorChange}
          />
          
          {/* Status Selection Buttons */}
          <div className="flex justify-center space-x-4 p-4">
            <Button 
              variant="destructive"
              onClick={() => handleStatusClick("maintenance")}
            >
              Under Maintenance ({maintenanceDorms.size})
            </Button>
            <Button 
              variant="destructive"
              onClick={() => handleStatusClick("used")}
            >
              Used By Other People ({usedDorms.size})
            </Button>
          </div>
        </div>
      </div>

      {/* Dialog for selecting dorms to exclude */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Select {selectedStatus === "maintenance" ? "Maintenance" : "Used"} Dorms
            </DialogTitle>
            <DialogDescription>
              Select the dorms that are {selectedStatus === "maintenance" ? "under maintenance" : "used by other people"}. 
              These dorms will not be registered in the system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-4 gap-4 mt-4 max-h-[400px] overflow-y-auto">
            {getDormRange().map((dormNum) => {
              const currentStatus = getDormStatus(dormNum);
              const isDisabled = currentStatus && currentStatus !== (selectedStatus === 'maintenance' ? 'Under Maintenance' : 'Used By Other People');
              const isChecked = (selectedStatus === 'maintenance' && maintenanceDorms.has(dormNum)) ||
                               (selectedStatus === 'used' && usedDorms.has(dormNum));
              
              return (
                <div key={dormNum} className="flex items-center space-x-2">
                  <Checkbox
                    id={`dorm-${dormNum}`}
                    checked={isChecked}
                    disabled={isDisabled}
                    onCheckedChange={() => !isDisabled && toggleDormExclusion(dormNum)}
                    className="h-5 w-5 border-2 border-blue-500"
                  />
                  <label 
                    htmlFor={`dorm-${dormNum}`} 
                    className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-700'}`}
                  >
                    Dorm {dormNum}
                    {isDisabled && (
                      <span className="ml-1 text-xs text-red-500">
                        ({currentStatus})
                      </span>
                    )}
                  </label>
                </div>
              );
            })}
    </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveExclusions}>
              Save Selection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegisterDormComp;