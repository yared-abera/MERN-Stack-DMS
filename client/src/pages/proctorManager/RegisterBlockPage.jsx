import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {RegisterBlock} from "@/config/data"
import CommonForm from "@/components/common/form"
import { motion } from "framer-motion";
import { useState } from "react";
const initialFormData=
  {
    blockNum : "",
    capacity: " ",
    foundIn:" ",
    status:" ",
    totalRoom:" ",
    availableRoom: " ",
    isSelectedForSpecialStud:" ",
    isSelectedForDisableStud: " ",

  }


const RegisterBlockComp = () => {
  const[formData,setFormData]=useState(initialFormData);
  const onSubmit=(event)=>{
     event.preventDefault();
  }

  function isFormValid() {
    return Object.values(formData).every((item) => item !== "");
  }
    return (
      <div className="border-2 border-blue-600 h-full">
         <motion.div
                      initial={{ x: "+100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "-100%" }}
                      transition={{ duration: 0.99, ease: "easeOut" }}
                      className=" m-auto md:w-1/2 p-6 rounded-2xl shadow-lg "
                    >  
      <Card >
        <CardHeader>
          <CardTitle>Fill the form for Register Block</CardTitle>
        </CardHeader>
        <CardContent>
         <CommonForm
            formControls={RegisterBlock}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            buttonText={"Register Block"}
            isBtnDisabled={!isFormValid()}
          />
        </CardContent>
      </Card>
       </motion.div>
      </div>
    );
  };

  export default RegisterBlockComp;
 