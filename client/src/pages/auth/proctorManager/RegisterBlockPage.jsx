import { useState, useCallback,useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { registerBlock,fetchAvailableProctors } from "@/store/blockSlice/index";
import img from "@/assets/unique/building.jpeg";
import RegisterCard from "@/components/common/RegisterCard";
import { RegisterBlock } from "@/config/data";

const initialFormData = {
  blockNum: "",
  foundIn: "",
  isSelectedForSpecialStud:"",
  totalFloors: "",
  proctorId: "",
};



const RegisterBlockComp = () => {
  const dispatch = useDispatch();
  const { availableProctors } = useSelector(state => state.block);
        console.log("availableProtors from regBlockComp",availableProctors);
        const newRegisterBlock=[...RegisterBlock,{
          label: "Assign Proctor",
          name: "proctorId",
          componentType: "select",
          options: availableProctors.map(proctor => ({
            id: proctor._id, // Use proctor's _id as the value
            label: `${proctor.fName} ${proctor.lName}`, // Combine fName and lName for the label
          })),
        },];
  useEffect(() => {
   dispatch(fetchAvailableProctors());
  }, [dispatch]);

  const [formData, setFormData] = useState(initialFormData);
   console.log(formData);
  const isFormValid = () => Object.values(formData).every((item) => item !== "");
  const generateFloors = (totalFloors) => {
    return Array.from({ length: parseInt(totalFloors) }, (_, index) => ({
      floorNumber: index + 1,
      floorStatus: "Available",
      dorms: [],
    }));
  };

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (isFormValid()) {
        const floors = generateFloors(formData.totalFloors);
        const newFormData = { ...formData, floors };
        console.log(newFormData,'from register Component')
        dispatch(registerBlock(newFormData));
      } else {
        alert("Please fill all fields");
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
