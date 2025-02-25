import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  RadioButton,
  RadioFileFormat,
  requiredSchema,
  StudDataSchema,
} from "@/config/data";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Papa from "papaparse";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
const data = requiredSchema;
const AllData = StudDataSchema;
 

// function DataChecker({
//   inputData,
//   setIsDataNotCorrect,
//   selectedValue,
//   ErrorViewr,
// }) {
//   const errors = [];

//   // Check for missing required fields
//   Object.keys(AllData).forEach((key) => {
//     if (!(key in inputData)) {
//       errors.push(`Missing required attribute: ${key}`);
//     }
//   });

//   // Validate user ID format
//   const regex = /^(NSR|SSR)\/\d{4}\/\d{2}$/;
//   const isUserNameValid = inputData.userName && regex.test(inputData.userName);
//   if (!isUserNameValid) {
//     errors.push(`Invalid ID: ${inputData.userName}`);
//   }

//   // Handle department for fresh students
//   if (selectedValue === "fresh") {
//     inputData.department = "Not yet";
//   }

//   // Validate field types
//   Object.entries(inputData).forEach(([key, value]) => {
//     if (key in data) {
//       const expectedType = data[key];
//       if (value === null || value === undefined) {
//         errors.push(`Missing value for ${key}`);
//       } else {
//         const actualType = value.constructor;
//         if (actualType !== expectedType) {
//           errors.push(`Invalid type for ${key}: Expected ${expectedType.name}`);
//         }
//       }
//     }
//   });

//   // Check for unexpected fields
//   Object.keys(inputData).forEach((key) => {
//     if (!(key in AllData)) {
//       errors.push(`Unexpected field: ${key}`);
//     }
//   });

//   // Update error state and pass errors to parent
//   setIsDataNotCorrect(errors.length > 0);
//   ErrorViewr(errors);

//   return null;
// }

export default function DormAllocation() {
   const [file, setFile] = useState(null);
  const inputRef = useRef();
  const validfileName = ["json", "csv"];
  const [selectedValue, setSelectedValue] = useState("");
  const [fileFormat, setFileFormat] = useState("");
  const [dataFormat, setDataFormat] = useState(null);
  const [isDataNotCorrect, setIsDataNotCorrect] = useState(false);
  const [errors, setErrors] = useState([]);
  const [validationTrigger, setValidationTrigger] = useState(true);



  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  }
  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleOnDrop(event) {
    event.preventDefault();
    const dropedFile = event.dataTransfer.files?.[0];
    if (dropedFile) {
      setFile(dropedFile);
    }
  }

  function handelRemoveImage(event) {
    setFile(null);
    setDataFormat("");
    setErrors([])
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

 
   

  function handleFile() {
    const fileExtension = file.name.split(".")[1];
    if (fileExtension !== fileFormat) {
      toast.error("File format does not match selected type");
      return;
    }

    if (!validfileName.includes(fileExtension)) {
      setFile(null);
      setSelectedValue("");
      toast.error("Invalid file type");
      return;
    }

    if (fileExtension === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setDataFormat(results.data);
          toast.success("CSV data parsed successfully");
        },
        error: (error) => {
          console.error("CSV parsing error:", error);
          toast.error("Error parsing CSV file");
        },
      });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target.result);
          if (!Array.isArray(parsedData)) {
            toast.warning("JSON data wrapped in array");
            setDataFormat([parsedData]);
          } else {
            setDataFormat(parsedData);
          }
          toast.success("JSON data parsed successfully");
        } catch (error) {
          console.error("JSON parsing error:", error);
          toast.error("Error parsing JSON file");
        }
      };
      reader.readAsText(file);
    }
  }
  const handleChange = (event, text) => {
    if (text === "category") {
      setSelectedValue(event.target.value);
    } else {
      setFileFormat(event.target.value);
    }
  };

  function handleDialog(){
    setIsDataNotCorrect(!isDataNotCorrect)
    setDataFormat('')
    setFile('')
  }


  useEffect(() => {
    if ( dataFormat && dataFormat.length>0) {
      const allErrors = [];
      let hasErrors = false;

      dataFormat.forEach((inputData) => {
        const errors = [];

        // Check for missing required fields
        Object.keys(AllData).forEach((key) => {
          if (!(key in inputData)) {
            errors.push(`Missing required attribute: ${key}`);
          }
        });

        // Validate user ID format
        const regex = /^(NSR|SSR)\/\d{4}\/\d{2}$/;
        const isUserNameValid = inputData.userName && regex.test(inputData.userName);
        if (!isUserNameValid) {
          errors.push(`Invalid ID: ${inputData.userName}`);
        }

        // Handle department for fresh students
        if (selectedValue === "fresh") {
          inputData.department = "Not_yet";
          inputData.studCategory="freash"
        } else if(selectedValue==='seniour'){
          inputData.studCategory="seniour"
           
        }
        else{
           inputData.department = "Not_yet";
          inputData.studCategory="remadial"
        }
        
        
        

        // Validate field types
        Object.entries(inputData).forEach(([key, value]) => {
          if (key in data) {
            const expectedType = data[key];
            if (value === null || value === undefined) {
              errors.push(`Missing value for ${key}`);
            }
            const actualType = value.constructor;
              if (actualType !== expectedType) {
                errors.push(`Invalid type for ${key}: Expected ${expectedType.name}`);
              }
            
          }
        });

        // Check for unexpected fields
        Object.keys(inputData).forEach((key) => {
          if (!(key in AllData)) {
            errors.push(`Unexpected field: ${key}`);
          }
        });

        if (errors.length > 0) {
          hasErrors = true;
          allErrors.push(...errors);
        }
      });

      setErrors(allErrors);
      setIsDataNotCorrect(hasErrors);
      setValidationTrigger(false);
    }
  }, [ dataFormat, selectedValue]);


  function showDetailError(){
   return  <div className="max-h-96 overflow-y-auto">
   {errors.map((error, index) => (
     <div key={index} className="text-red-500 py-1 text-sm">
       {error}
     </div>
   ))}
 </div>
  }
  console.log(isDataNotCorrect, "isDataNotCorrect");
  console.log(errors, "errors");
  return (
    <div className="  w-full overflow-hidden min-h-screen mt-20 flex flex-col ">
      <Dialog open={isDataNotCorrect} onOpenChange={handleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <p>Error On the validation of in put data</p>
            <Button onClick={showDetailError}>👁️Detail Error</Button>
          </DialogDescription>
        </DialogContent>
      </Dialog>
      

      <div className="flex place-content-center m-4">
        <h1 className="sm:text-lg md:text-2xl font-bold ">
          Student Dorm Allocation
        </h1>
      </div>

      <div className="flex-1 h-full flex flex-col border-solid shadow-md shadow-sky-900 m-1 ">
        <div className="w-full  flex flex-col md:flex-row gap-1">
          <div className="w-1/2  flex items-center flex-col justify-center sm:mt-3 p-3 md:mt-6 gap-3  ">
            <h1 className=" sm:text-lg md:text-2xl font-bold ">
              Select Student Category
            </h1>
            <RadioGroup>
              {RadioButton.map((item) => (
                <div className="flex items-center space-x-2" key={item.id}>
                  <input
                    type="radio"
                    value={item.value}
                    id={item.id}
                    checked={selectedValue === item.value}
                    onChange={(e) => handleChange(e, "category")}
                  />
                  <label htmlFor={item.id}>{item.label}</label>
                </div>
              ))}
            </RadioGroup>
            <Button
              className="text-sm"
              variant="outline"
              onClick={() => setSelectedValue("")}
            >
              Clear
            </Button>
          </div>

          <div className="w-1/2 flex flex-col sm:mt-3 p-3 md:mt-6 gap-3 ">
            <p>
              <span className="text-red-500 text-base"> Notice :</span> Only
              .csv and .json file are accepted for student Dorm Allocation{" "}
              <span className="text-xl">🔐</span>
            </p>
            <h1 className="text-lg font-semibold">Select file Format</h1>
            <RadioGroup>
              {RadioFileFormat.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center w-1/2 space-x-2"
                >
                  <Input
                    type="radio"
                    value={item.value}
                    id={item.id}
                    checked={fileFormat === item.value}
                    onChange={(e) => handleChange(e, "type")}
                    className="w-4"
                  />
                  <Label htmlFor={item.id}>{item.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="flex-1 sm:m-3 md:m-6  flex  w-full gap-2    ">
    

          <div
            className="flex items-center  w-[85%] gap-2 py-3 md:py-6  flex-col justify-center dark:bg-blue-900 shadow-xl
            shadow-sky-950    dark:shadow-white"
            onDragOver={handleDragOver}
            onDrop={handleOnDrop}
          >
            <Label>Upload File </Label>
            <Input
              id="file_upload"
              type="file"
              className="hidden "
              onChange={handleFileChange}
              ref={inputRef}
            />
            {!file ? (
              <Label
                htmlFor="file_upload"
                className="h-auto w-auto sm:p-3 md:p-4 border-2 border-blue-500 rounded-md"
              >
                <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2"></UploadCloudIcon>
                <span>Drag and drop or click to upload File</span>
              </Label>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileIcon className="w-8 text-primary h-8 mr-2" />
                </div>
                <p className="text-sm font-medium">{file.name}</p>
                <Button
                  variant="ghost "
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={handelRemoveImage}
                >
                  <XIcon className="w-4 h-4" />
                  <span className="sr-only">Remove File</span>
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-col  justify-around mt-4">
            <Button
              onClick={handleFile}
              disabled={!file || selectedValue === "" || fileFormat === ""}
            >
              {" "}
              Verify
            </Button>

          
          </div>
        </div>
      </div>
     
    </div>
  );
}
