import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { registerBlock } from "@/store/blockSlice/index";
import img from "@/assets/unique/building.jpeg";
import RegisterCard from "@/components/common/RegisterCard";
import { RegisterBlock } from "@/config/data";

const initialFormData = {
  blockNum: "",
  capacity: "",
  foundIn: "",
  status: "",
  totalRoom: "",
  availableRoom: "",
  isSelectedForSpecialStud: "",
  isSelectedForDisableStud: "",
};

const RegisterBlockComp = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormData);

  const isFormValid = () =>
    Object.values(formData).every((item) => item !== "");

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (isFormValid()) {
        dispatch(registerBlock(formData));
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
        RegisterBlock={RegisterBlock}
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
