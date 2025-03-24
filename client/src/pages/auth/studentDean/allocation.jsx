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
import { ArrowRight, FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
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
import AllocationPage from "@/components/studentDean/dormAllocation";
const data = requiredSchema;
const AllData = StudDataSchema;

export default function DormAllocation() {
  const [file, setFile] = useState(null);
  const inputRef = useRef();
  const validfileName = ["json", "csv"];
  const [selectedValue, setSelectedValue] = useState("");
  const [fileFormat, setFileFormat] = useState("");
  const [dataFormat, setDataFormat] = useState(null);
  const [isDataNotCorrect, setIsDataNotCorrect] = useState(false);
  const [errors, setErrors] = useState([]);
  const [validationTrigger, setValidationTrigger] = useState(false);
  const [showDetailError, setShowDetailError] = useState(false);
  const [navigateToAPage, setNavigateAPage] = useState(false);

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
    setErrors([]);
    setValidationTrigger(false);
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

  function handleDialog() {
    setIsDataNotCorrect(!isDataNotCorrect);
    setDataFormat("");
    setFile("");
  }

  useEffect(() => {
    if (dataFormat && dataFormat.length > 0 && selectedValue !== "gust") {
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
        const regex = /^(NSR|SSR)\/\d{4}\/\d{2}$/i;
        const isUserNameValid =
          inputData.userName && regex.test(inputData.userName.toUpperCase());
        if (!isUserNameValid) {
          errors.push(`Invalid ID: ${inputData.userName}`);
        }
        //

        const regexStream = /^(SOCIAL|NATURAL)/i;

        const isStreamCorrrect =
          inputData.stream && regexStream.test(inputData.stream.toUpperCase());

        if (!isStreamCorrrect) {
          errors.push(`Invalid Stream: ${inputData.stream}`);
        }
        // Handle department for fresh students
        if (selectedValue === "fresh") {
          inputData.department = "Not_yet";
          inputData.studCategory = "fresh";
        } else if (selectedValue === "senior") {
          if(inputData.department===''){
            errors.push(`department not found for ${inputData.userName}`)
          }
          inputData.studCategory = "senior";
          
        } else {
          inputData.department = "Not_yet";
          inputData.studCategory = "remedial";
        }

        const password=inputData.Fname+inputData.Lname[0]+'@123'
        inputData.password=password

        // Validate field types
        Object.entries(inputData).forEach(([key, value]) => {
          if (key in data) {
            const expectedType = data[key];
            if (value === null || value === undefined||'') {
              errors.push(`Missing value for ${key}`);
            }
            const actualType = value.constructor;
            if (actualType !== expectedType) {
              errors.push(
                `Invalid type for ${key}: Expected ${expectedType.name}`
              );
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

      if (hasErrors) {
        setIsDataNotCorrect(true);
      } else {
        setValidationTrigger(true);
      }

      setErrors(allErrors);
    }
  }, [dataFormat, selectedValue]);

  function HandleShowDetailError() {
    setShowDetailError(!showDetailError);
  }

  function handleAllocationPage() {
    setNavigateAPage(true);
  }
  useEffect(() => {
    if (validationTrigger) {
      toast("Data is valid");
    }
  }, [validationTrigger]);

  console.log(dataFormat, "dataFormat");

  return (
    <div className="  w-full overflow-hidden min-h-screen mt-20 flex flex-col ">
      {dataFormat && dataFormat.length > 0 && navigateToAPage ? (
        <AllocationPage dataFormat={dataFormat} selectedValue={selectedValue} />
      ) : (
        <div className="flex flex-col w-full">
          <Dialog open={isDataNotCorrect} onOpenChange={handleDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Error</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <div className="flex flex-col gap-2 ">
                  <p>Error On the validation of in put data</p>
                  <div>
                    <Button onClick={HandleShowDetailError}>
                      👁️Detail Error
                    </Button>
                  </div>

                  {showDetailError ? (
                    <div className="max-h-96 overflow-y-auto">
                      {errors.map((error, index) => (
                        <div key={index} className="text-red-500 py-1 text-sm">
                          {error}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
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
                  Select User Category
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

            <div className="flex-1 sm:m-3 md:m-6  flex flex-col md:flex-row  w-full gap-2    ">
              <div
                className="flex items-center w-full md:w-[80%] gap-2 p-3 md:py-6  flex-col justify-center dark:bg-blue-900 shadow-xl
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

              <div className="flex flex-col gap-1  mt-4  ">
                <Button
                  onClick={handleFile}
                  disabled={!file || selectedValue === "" || fileFormat === ""}
                >
                  {" "}
                  Verify
                </Button>

                <Button
                  className={!validationTrigger ? "hidden" : "inline-flex"}
                  onClick={handleAllocationPage}
                >
                  <span className="text-sm ">Allocation Page</span>{" "}
                  <ArrowRight />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
