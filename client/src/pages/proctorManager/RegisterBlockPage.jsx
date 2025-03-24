import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerBlock, fetchAvailableProctors } from "@/store/blockSlice/index";
import img from "@/assets/unique/building.jpeg";
import RegisterCard from "@/components/common/RegisterCard";
import { RegisterBlock } from "@/config/data";
import { toast } from 'sonner';
 
const initialFormData = {
  blockNum: "",
  foundIn: "",
  isSelectedForSpecialStud: "",
  totalFloors: "",
  proctorId: "",
};

const RegisterBlockComp = () => {
  const dispatch = useDispatch();
  const { availableProctors } = useSelector(state => state.block);
  
  const newRegisterBlock = [...RegisterBlock, {
    label: "Assign Proctor",
    name: "proctorId",
    componentType: "select",
    options: availableProctors.map(proctor => ({
      id: proctor._id,
      label: `${proctor.fName} ${proctor.lName}`,
    })),
  }];

  useEffect(() => {
    dispatch(fetchAvailableProctors());
  }, [dispatch]);

  const [formData, setFormData] = useState(initialFormData);
  
  const isFormValid = () => Object.values(formData).every((item) => item !== "");
  
  const generateFloors = (totalFloors) => {
    return Array.from({ length: parseInt(totalFloors) }, (_, index) => ({
      floorNumber: index + 1,
      floorStatus: "Available",
      dorms: [],
    }));
  };

  const onSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!isFormValid()) {
        toast.error("Please fill all fields");
        return;
      }

      try {
        const floors = generateFloors(formData.totalFloors);
        const newFormData = { ...formData, floors };
        
        // Show promise toast
        toast.promise(
          dispatch(registerBlock(newFormData)).unwrap(),
          {
            loading: 'Registering block...',
            success: () => {
              setFormData(initialFormData);
              return 'Block registered successfully!';
            },
            error: (err) => err.message || 'Failed to register block'
          }
        );
        
      } catch (error) {
        toast.error(error.message || 'Failed to register block');
      }
    },
    [formData, dispatch]
  );

  return (
    <div
      className="border-2 border-blue-600 h-full"
      style={{
        backgroundImage: `url(${img})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <RegisterCard
        RegisterBlock={newRegisterBlock}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isFormValid={isFormValid}
        cardTitle="Fill the form for Register Block"
        buttonText="Register Block"
      />
    </div>
  );
};

export default RegisterBlockComp;
