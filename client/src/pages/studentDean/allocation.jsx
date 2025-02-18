import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UploadCloudIcon } from "lucide-react";
import { useRef } from "react";

export default function DormAllocation() {
    const inputRef=useRef()
  return (
    <div className="  w-full overflow-hidden h-screen mt-20 flex flex-col ">
      <div className="flex place-content-center m-4">
        <h1 className="sm:text-lg md:text-2xl font-bold ">
          Student Dorm Allocation
        </h1>
      </div>

      <div className="flex-1 flex flex-col border-solid shadow-md shadow-sky-900 m-1 ">
        <div className="w-1/2  flex items-center flex-col justify-center sm:mt-3 p-3 md:mt-6 gap-3  ">
          <h1 className=" sm:text-lg md:text-2xl font-bold ">
            Select Student Category
          </h1>
          <RadioGroup defaultValue="option-one">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Remedial" id="option-one" />
              <Label htmlFor="option-one">Remedial Student</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Freash" id="option-two" />
              <Label htmlFor="option-two">Freash Student</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="have_department" id="option-two" />
              <Label htmlFor="have_department">After Having department</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex-1 sm:m-3 md:m-6  flex    flex-col ">
         <div className="flex items-center h-[85%] flex-col justify-center dark:bg-blue-900 shadow-xl shadow-sky-950 border-solid dark:shadow-white">

        
          <Label>Upload File </Label>
          <Input
            id="file_upload"
            type="file"
            className="hidden "
            ref={inputRef}
          />
          <Label htmlFor='file_upload' className='h-20  w-auto sm:p-3 md:p-4'>
          <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2"></UploadCloudIcon>
          <span>Drag and drop or click to upload File</span>
          </Label>
          </div>
          
       <div className="flex items-end gap-4 justify-end mt-4">
       <Button>
            Allocate
        </Button>
        <Button>
            Remove 
        </Button>
       </div>
        </div>

      </div>
    </div>
  );
}
