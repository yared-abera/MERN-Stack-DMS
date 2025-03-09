import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CommonForm from "./form";
import { motion } from "framer-motion";
export default function RegisterCard({RegisterBlock, formData, setFormData, onSubmit, isFormValid,cardTitle,buttonText}) {
  return (
    <motion.div
                      initial={{ x: "+100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "-100%" }}
                      transition={{ duration: 0.99, ease: "easeOut" }}
                      className=" m-auto md:w-1/2 p-6 rounded-2xl shadow-lg  "
                    >  
      <Card className=" border-none">
        <CardHeader>
          <CardTitle>{cardTitle}</CardTitle>
        </CardHeader>
        <CardContent>
         <CommonForm
            formControls={RegisterBlock}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            buttonText={buttonText}
            isBtnDisabled={!isFormValid()}
          />
        </CardContent>
      </Card>
       </motion.div>
  )
}
