// components/DormRegistrationForm.js
import React, { useState,useCallback, useEffect } from 'react';
import { registerDorm } from '@/store/dormSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProctorBlocks } from '@/store/blockSlice/index';
import RegisterCard from "@/components/common/RegisterCard";
import img from "@/assets/unique/building.jpeg";

// Configuration for Dorm Registration form
export const RegisterDorm = [
  {
    label: "Select Block",
    name: "blockId",
    componentType: "select",
    options: [], // Will be populated dynamically
  },
  {
    label: "Select Floor",
    name: "floorNumber",
    componentType: "select",
    options: [], // Will be populated dynamically
  },
  {
    label: "Dorm Number",
    name: "dormNumber",
    placeholder: "Enter Dorm Number",
    type: "text",
    componentType: "input"
  },
  {
    label: "Dorm Status",
    name: "status",
    componentType: "select",
    options: [
      { id: 'available', label: 'Available', value: 'available' },
      { id: 'maintenance', label: 'Under Maintenance', value: 'maintenance' },
      { id: 'used', label: 'Used By Other People', value: 'used' }
    ]
  },
  {
    label: "Capacity",
    name: "capacity",
    placeholder: "Enter Dorm Capacity",
    type: "number",
    componentType: "input"
  },
];

const initialFormData = {
  blockId: "",
  floorNumber: "",
  dormNumber: "",
  status: "available", // Default value
  capacity: ""
};

const RegisterDormComp = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormData);
  const [formConfig, setFormConfig] = useState(RegisterDorm);
  const { list: blocks } = useSelector((state) => state.block);
  
  // Fetch proctor's blocks when component mounts
  useEffect(() => {
      dispatch(fetchProctorBlocks());
  }, [dispatch]);

  console.log('formData', formData); // Add this to debug

  // Update form configuration when blocks change
  useEffect(() => {
    const updatedConfig = RegisterDorm.map(field => {
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

    const updatedConfig = RegisterDorm.map(field => {
      if(field.name === 'floorNumber') {
        return {
          ...field,
          options: floorOptions
        };
      }
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
  }, [formData.blockId, blocks]);

  const isFormValid = () => {
    return Object.values(formData).every(value => value !== "");
  };
 
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (isFormValid()) {
        console.log("formData from The register Dorm", formData);
        dispatch(registerDorm(formData));
      }
      else {
        alert("Please fill all fields");
      }
    },
    [formData, dispatch]
  );

  return (
    <div className="border-2 border-blue-600 h-full"
         style={{
           backgroundImage: `url(${img})`,
           backgroundPosition: "center",
           backgroundSize: "cover",
         }}>
      <RegisterCard
        RegisterBlock={formConfig}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isFormValid={isFormValid}
        cardTitle="Register New Dorm"
        buttonText="Register Dorm"
      />
    </div>
  );
};

export default RegisterDormComp;