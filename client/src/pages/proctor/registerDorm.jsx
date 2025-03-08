// components/DormRegistrationForm.js
import React, { useState, useEffect } from 'react';
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
  capacity: ""
};

const RegisterDormComp = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormData);
  const [formConfig, setFormConfig] = useState(RegisterDorm);
  const user = useSelector((state) => state.auth.user);
  const { list: blocks } = useSelector((state) => state.block);
  const proctorId = user?.id;
  console.log('proctorId',proctorId)
  // Fetch proctor's blocks when component mounts
  useEffect(() => {
    if(proctorId) dispatch(fetchProctorBlocks(proctorId));
  }, [dispatch, proctorId]);

  console.log('blocks',blocks)
  // Update form configuration when blocks change
  useEffect(() => {
    const updatedConfig = formConfig.map(field => {
      if(field.name === 'blockId') {
        return {
          ...field,
          options: blocks.map(block => ({
            id: block._id,
            label: `Block ${block.blockNum} (${block.location})`,
            floors: block.floors
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
    const totalFloors = selectedBlock?.floors?.length || 0;

    const updatedConfig = formConfig.map(field => {
      if(field.name === 'floorNumber') {
        return {
          ...field,
          options: Array.from({length: totalFloors}, (_, i) => ({
            id: i + 1,
            label: `Floor ${i + 1}`
          }))
        };
      }
      return field;
    });

    setFormConfig(updatedConfig);
  }, [formData.blockId]);

  const isFormValid = () => {
    return Object.values(formData).every(value => value !== "");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if(!isFormValid()) {
      alert("Please fill all fields");
      return;
    }

    await dispatch(registerDorm(formData));
    setFormData(initialFormData);
  };

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