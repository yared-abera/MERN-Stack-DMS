import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {RegisterBlock} from "@/config/data"
import CommonForm from "@/components/common/form"
const RegisterBlockComp = () => {
  


    return (
      <div className="border-2 border-blue-600 h-full">
       <div>
      <Card >
        <CardHeader>
          <CardTitle>Register Block</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input placeholder="Block Name" />
            <Input placeholder="Location" />
            <Input type="number" placeholder="Capacity" />
            <Button type="submit">Register Block</Button>
          </form>
         <CommonForm
            formControls={}
            formData={}
            setFormData={}
            onSubmit={}
            buttonText={}
            isBtnDisabled={}
          />
        </CardContent>
      </Card>
      </div>
      </div>
    );
  };

  export default RegisterBlockComp;
 