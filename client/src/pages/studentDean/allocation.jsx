"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup } from "@/components/ui/radio-group"
import { RadioButton, RadioFileFormat, requiredSchema } from "@/config/data"
import { ArrowRight, FileIcon, UploadCloudIcon, XIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import Papa from "papaparse"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import AllocationPage from "@/components/studentDean/dormAllocation"

// Assuming requiredSchema looks something like:
// const requiredSchema = {
//   Fname: String,
//   Lname: String,
//   userName: String, // e.g., NSR/1234/14
//   email: String,
//   stream: String, // NATURAL or SOCIAL
//   // ... other required fields with their types (String, Number, Boolean)
//   password: String,
//   batch: Number,
//   studCategory: String,
//   role: String,
//   department: String, // Only for fresh/remedial
//   college: String, // Only for senior
//   dorm: Number,    // Only for senior
//   block: Number,   // Only for senior
//   address: String, // Only for senior
//   phoneNum: String // Only for senior
// };

const baseSchema = requiredSchema // Use the imported schema directly

export default function DormAllocation() {
  const [file, setFile] = useState(null)
  const inputRef = useRef()
  const validfileName = ["json", "csv"]
  const [selectedValue, setSelectedValue] = useState("") // 'senior', 'fresh', 'remedial'
  const [fileFormat, setFileFormat] = useState("") // 'csv', 'json'
  const [parsedData, setParsedData] = useState([]) // Data directly from file parse
  const [processedData, setProcessedData] = useState([]) // Data after initial processing & modifications
  const [isDataNotCorrect, setIsDataNotCorrect] = useState(false)
  const [errors, setErrors] = useState([])
  const [validationTrigger, setValidationTrigger] = useState(false) // Indicates successful validation
  const [showDetailError, setShowDetailError] = useState(false)
  const [navigateToAPage, setNavigateAPage] = useState(false)

  const generateRandomNumber = () => {
    // Simple random number, consider a more robust unique ID approach if needed
    return Math.floor(Math.random() * 100)
  }

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
        resetState(); // Reset when a new file is selected
        setFile(selectedFile);
    }
  }
  function handleDragOver(e) {
    e.preventDefault()
  }
  function handleOnDrop(e) {
    e.preventDefault()
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) {
        resetState(); // Reset when a new file is dropped
        setFile(dropped);
    }
  }

  function resetState() {
    setFile(null)
    setParsedData([])
    setProcessedData([])
    setErrors([])
    setIsDataNotCorrect(false)
    setValidationTrigger(false)
    setNavigateAPage(false)
    setShowDetailError(false)
     // Clear the actual input element value
     if (inputRef.current) {
        inputRef.current.value = ""
      }
  }

  function handelRemoveImage() {
    resetState()
  }

  function handleVerifyClick() { // Renamed from handleFile for clarity
    if (!file || !selectedValue || !fileFormat) {
        toast.error("Please select category, format, and file.");
        return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase(); // Handle cases like .CSV

    if (!validfileName.includes(ext)) {
        toast.error("Invalid file type. Only CSV and JSON are allowed.");
        resetState(); // Clear invalid file
        return;
    }

    if (ext !== fileFormat) {
      toast.error(`File type (${ext.toUpperCase()}) does not match selected format (${fileFormat.toUpperCase()})`);
      // Optionally reset file or just prevent processing
      // resetState();
      return
    }

    // Reset validation state before parsing
    setErrors([])
    setIsDataNotCorrect(false)
    setValidationTrigger(false)
    setProcessedData([]) // Clear previous processed data

    const parseConfig = {
        header: true,
        skipEmptyLines: true,
        complete: ({ data, errors: parseErrors }) => {
            if (parseErrors.length > 0) {
                console.error("Parsing errors:", parseErrors);
                toast.error(`Error parsing ${fileFormat.toUpperCase()}: ${parseErrors[0].message}`);
                setParsedData([]); // Ensure no partial data is processed
                return;
            }
            if (data.length === 0) {
                 toast.warning(`The ${fileFormat.toUpperCase()} file is empty or contains only headers.`);
                 setParsedData([]);
                 return;
            }
            setParsedData(data) // Trigger the first useEffect
            toast.success(`${fileFormat.toUpperCase()} parsed successfully. Processing...`)
        },
        error: (err) => {
            toast.error(`${fileFormat.toUpperCase()} parsing error: ${err.message}`);
            setParsedData([]);
        },
    };

    if (ext === "csv") {
      Papa.parse(file, parseConfig)
    } else if (ext === "json") {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result)
          const dataArray = Array.isArray(parsed) ? parsed : [parsed] // Ensure array

           if (dataArray.length === 0) {
                 toast.warning(`The ${fileFormat.toUpperCase()} file is empty.`);
                 setParsedData([]);
                 return;
            }

          // Simulate PapaParse complete structure for consistency
          parseConfig.complete({ data: dataArray, errors: [] });
        } catch (jsonError) {
          console.error("JSON Parsing Error:", jsonError);
          toast.error(`JSON parsing error: ${jsonError.message}`)
          setParsedData([]);
        }
      }
       reader.onerror = (err) => {
            console.error("File Reading Error:", err);
            toast.error("Error reading file.");
            setParsedData([]);
       };
      reader.readAsText(file)
    }
  }

  const handleChange = (e, type) => {
    // Reset dependent states if category or format changes after a file was processed
    if (processedData.length > 0 || parsedData.length > 0 || errors.length > 0) {
        setProcessedData([]);
        setErrors([]);
        setIsDataNotCorrect(false);
        setValidationTrigger(false);
    }

    if (type === "category") setSelectedValue(e.target.value)
    else setFileFormat(e.target.value)
  }

  function handleDialogClose() { // Changed from handleDialog for clarity
    setIsDataNotCorrect(false)
    // Keep errors visible until a new validation happens or file is removed
    // Don't reset file or data here, let user fix and re-verify
  }

  // --- EFFECT 1: Process and Modify Data ---
  // Runs when raw parsed data or the selected category changes.
  // Responsible for adding defaults, category-specific fields, generating email/password/batch.
  useEffect(() => {
    if (!Array.isArray(parsedData) || parsedData.length === 0 || !selectedValue) {
        setProcessedData([]); // Clear processed data if inputs are invalid/missing
        return;
    }

    console.log("EFFECT 1: Processing parsed data for category:", selectedValue);

    const dataWithModifications = parsedData.map((item) => {
        const processedItem = { ...item }; // Start with parsed data

        // 1. Ensure all base schema attributes exist with default values
        Object.keys(baseSchema).forEach((key) => {
            if (!(key in processedItem) || processedItem[key] === null || processedItem[key] === undefined) {
                // Set default based on expected type
                if (baseSchema[key] === String) {
                    processedItem[key] = "";
                } else if (baseSchema[key] === Number) {
                    processedItem[key] = 0;
                } else if (baseSchema[key] === Boolean) {
                    processedItem[key] = false;
                } else {
                    processedItem[key] = null; // Default for unknown types
                }
            }
        });

        // 2. Add/Override category-specific fields
        processedItem.studCategory = selectedValue;
        processedItem.role = "Student"; // Assuming role is always Student

        if (selectedValue === "senior") {
            // Ensure senior-specific fields exist (using defaults if needed)
            processedItem.college = processedItem.college || "";
            processedItem.dorm = Number.parseInt(processedItem.dorm, 10) || 0;
            processedItem.block = Number.parseInt(processedItem.block, 10) || 0;
            processedItem.address = processedItem.address || "";
            processedItem.phoneNum = processedItem.phoneNum || "";
            // Remove fields not applicable to seniors if they exist
            delete processedItem.department;
        } else if (selectedValue === "fresh" || selectedValue === "remedial") {
            processedItem.department = "Not_yet";
            // Remove fields not applicable to fresh/remedial if they exist
             delete processedItem.college;
             delete processedItem.dorm;
             delete processedItem.block;
             delete processedItem.address;
             delete processedItem.phoneNum;
        }

        // 3. Generate Email if missing or invalid format (basic check)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!processedItem.email || typeof processedItem.email !== 'string' || !emailRegex.test(processedItem.email)) {
            const sanitizedFname = (processedItem.Fname || "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
            const sanitizedLname = (processedItem.Lname || "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
            const randomNumber = generateRandomNumber(); // Consider a better unique identifier
            if (sanitizedFname && sanitizedLname) {
                 processedItem.email = `${sanitizedFname}.${sanitizedLname}${randomNumber}@student.example.com`; // Use a consistent domain
            } else {
                 processedItem.email = `student${randomNumber}@student.example.com`; // Fallback if names are missing
            }
        }

         // 4. Generate Password if missing
       
            const firstName = (processedItem.Fname).trim();
            const lastName = (processedItem.Lname).trim();
            const firstLetterOfLastName = lastName[0]  
             // Ensure password complexity if needed, this is very basic
            if (firstName && firstLetterOfLastName) {
                 processedItem.password = `${firstName}${firstLetterOfLastName}@123`;
            }else{
              processedItem.password = "12345"
            }
        

        // 5. Extract Batch from userName (if valid format)
        const idRegex = /^(NSR|SSR)\/(\d{4})\/(\d{2})$/i;
        const match = typeof processedItem.userName === 'string' ? processedItem.userName.toUpperCase().match(idRegex) : null;
        if (match) {
            const yearDigits = match[3]; // The 'YY' part
            processedItem.batch = 2000 + parseInt(yearDigits, 10);
        } else {
             // If ID is invalid or missing, batch might be 0 or need another source
             // Keep the default 0 set earlier, or handle as an error in validation
             processedItem.batch = processedItem.batch || 0; // Keep existing or default
        }

        return processedItem;
    });

    setProcessedData(dataWithModifications); // Trigger the validation effect

  }, [parsedData, selectedValue]); // Re-process if parsed data or category changes


  // --- EFFECT 2: Validate Processed Data ---
  // Runs only when processedData changes.
  // Responsible *only* for checking data against rules and setting error/success states.
  // Does NOT modify the data itself.
  useEffect(() => {
    if (!Array.isArray(processedData) || processedData.length === 0) {
        // No data to validate, ensure validation state is reset
        setErrors([]);
        setIsDataNotCorrect(false);
        setValidationTrigger(false);
        return;
    }

    console.log("EFFECT 2: Validating processed data...");

    const validationErrors = [];
    let dataIsValid = true;

    processedData.forEach((item, index) => {
        const itemErrors = [];
        const itemNumber = index + 1; // For user-friendly error messages

        // --- Validation Checks ---

        // Check required fields (using baseSchema keys as the source of truth)
        Object.keys(baseSchema).forEach((key) => {
            // Skip fields not relevant to the current selectedValue
            if (selectedValue === 'senior' && key === 'department') return;
            if ((selectedValue === 'fresh' || selectedValue === 'remedial') &&
                ['college', 'dorm', 'block', 'address', 'phoneNum'].includes(key)) return;

             // Check for null, undefined, or empty string for String type
            if (baseSchema[key] === String && (item[key] === null || item[key] === undefined || item[key] === "")) {
                 itemErrors.push(`Row ${itemNumber}: Missing required field '${key}'.`);
            }
             // Check for null/undefined for Number/Boolean (allow 0 and false)
             else if ((baseSchema[key] === Number || baseSchema[key] === Boolean) && (item[key] === null || item[key] === undefined)) {
                  itemErrors.push(`Row ${itemNumber}: Missing required field '${key}'.`);
             }
        });

        // Validate userName format
        const idRegex = /^(NSR|SSR)\/\d{4}\/\d{2}$/i;
        if (!item.userName || typeof item.userName !== 'string' || !idRegex.test(item.userName)) {
            itemErrors.push(`Row ${itemNumber}: Invalid ID format for '${item.userName || "empty"}'. Expected NSR/####/## or SSR/####/##.`);
        }

        // Validate Email format (more strict)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
         if (!item.email || typeof item.email !== 'string' || !emailRegex.test(item.email)) {
             itemErrors.push(`Row ${itemNumber}: Invalid email format for '${item.email || "empty"}'.`);
         }

        // Validate Stream
         const streamRegex = /^(SOCIAL|NATURAL)$/i;
         if (!item.stream || typeof item.stream !== 'string' || !streamRegex.test(item.stream)) {
             itemErrors.push(`Row ${itemNumber}: Invalid Stream '${item.stream || "empty"}'. Expected NATURAL or SOCIAL.`);
         }

         // Validate Data Types (check against baseSchema)
         Object.entries(item).forEach(([key, value]) => {
             if (key in baseSchema) {
                 const expectedType = baseSchema[key];
                 const actualType = typeof value; // Use typeof for basic JS types
                 let typeMatch = false;

                 if (expectedType === String && actualType === 'string') typeMatch = true;
                 // Allow numbers or strings that can be parsed as numbers for Number type
                 else if (expectedType === Number && (actualType === 'number' || (actualType === 'string' && !isNaN(Number(value))))) typeMatch = true;
                 else if (expectedType === Boolean && actualType === 'boolean') typeMatch = true;

                 // Handle null/undefined - already checked by required field validation if applicable
                 if (value === null || value === undefined) {
                     // Don't flag type error if already flagged as missing required field
                 } else if (!typeMatch) {
                     // Avoid duplicate missing field errors
                     const isMissing = (expectedType === String && value === "") || ((expectedType === Number || expectedType === Boolean) && value === null);
                     if (!isMissing) {
                        itemErrors.push(`Row ${itemNumber}: Invalid type for '${key}'. Expected ${expectedType.name}, got ${actualType}. Value: ${value}`);
                     }
                 }
             }
         });

        // Add more specific validations as needed (e.g., phone number format, password complexity)


        if (itemErrors.length > 0) {
            dataIsValid = false;
            validationErrors.push(...itemErrors);
        }
    });

    setErrors(validationErrors);
    setIsDataNotCorrect(!dataIsValid);
    setValidationTrigger(dataIsValid); // Set trigger only if validation passes

    if (dataIsValid) {
        toast.success("Data validation successful!");
    } else {
        toast.error("Validation failed. Please check the errors.");
    }

  }, [processedData]); // Only re-validate when processedData changes


  // --- Effect 3: Trigger toast on successful validation ---
  // This is fine as it only depends on validationTrigger and shows a message
  useEffect(() => {
    if (validationTrigger) {
      // Toast moved to the end of the validation effect for better timing
      // toast("Data is valid and ready for allocation.")
    }
  }, [validationTrigger])

  function HandleShowDetailError() {
    setShowDetailError(!showDetailError)
  }
  function handleAllocationPage() {
    if (validationTrigger && processedData.length > 0) {
       setNavigateAPage(true)
    } else {
        toast.error("Cannot proceed. Data is not validated or is empty.");
    }
  }

  console.log("parsedData:", parsedData); // Raw data from file
  console.log("processedData:", processedData); // Data after modifications
  console.log("Errors:", errors);
  console.log("isDataNotCorrect:", isDataNotCorrect);
  console.log("validationTrigger:", validationTrigger);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      {/* Conditional Rendering: Show AllocationPage or Upload/Setup Form */}
      {navigateToAPage && processedData?.length > 0 ? (
        // Pass the final, validated data to the allocation page
        <AllocationPage dataFormat={processedData} selectedValue={selectedValue} />
      ) : (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Error Dialog */}
          <Dialog open={isDataNotCorrect} onOpenChange={handleDialogClose}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-red-600">Validation Error</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <div className="space-y-4">
                  <p>The uploaded data has issues. Please review the errors and correct the source file before re-uploading.</p>
                  <Button variant="outline" onClick={HandleShowDetailError}>
                    {showDetailError ? "Hide" : "Show"} Error Details ({errors.length})
                  </Button>
                  {showDetailError && (
                    <ul className="max-h-64 overflow-y-auto list-disc list-inside text-sm text-red-500 border border-red-200 p-3 rounded-md bg-red-50">
                      {errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                       {errors.length === 0 && <li>No specific errors listed.</li>}
                    </ul>
                  )}
                </div>
              </DialogDescription>
               {/* Optionally add an OK button */}
               {/* <DialogFooter> <Button onClick={handleDialogClose}>OK</Button> </DialogFooter> */}
            </DialogContent>
          </Dialog>

          {/* Header */}
          <div className="bg-blue-600 p-6">
            <h1 className="text-2xl font-bold text-white">Student Dorm Allocation Data Upload</h1>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Step 1: Category & Format */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Selection */}
               <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                 <h2 className="text-lg font-semibold mb-4 text-gray-800">1. Select Student Category</h2>
                 <RadioGroup value={selectedValue} onValueChange={(value) => handleChange({ target: { value } }, 'category')} className="space-y-2">
                    {RadioButton.map((opt) => (
                      <div key={opt.id} className="flex items-center space-x-2">
                         <input
                             id={`cat-${opt.id}`} // Ensure unique ID
                             type="radio"
                             value={opt.value}
                             checked={selectedValue === opt.value}
                             onChange={(e) => handleChange(e, "category")}
                             className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                           />
                         <label htmlFor={`cat-${opt.id}`} className="text-gray-700 select-none">
                           {opt.label}
                         </label>
                       </div>
                    ))}
                 </RadioGroup>
                  {selectedValue && (
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => handleChange({ target: { value: '' } }, 'category')}>
                      Clear Selection
                    </Button>
                  )}
               </div>
               {/* Format Selection */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">2. Select File Format</h2>
                  <RadioGroup value={fileFormat} onValueChange={(value) => handleChange({ target: { value } }, 'type')} className="space-y-2">
                    {RadioFileFormat.map((opt) => (
                      <div key={opt.id} className="flex items-center space-x-2">
                        <input
                          id={`fmt-${opt.id}`} // Ensure unique ID
                          type="radio"
                          value={opt.value}
                          checked={fileFormat === opt.value}
                          onChange={(e) => handleChange(e, "type")}
                          className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                          disabled={!selectedValue} // Disable until category is chosen
                        />
                        <label htmlFor={`fmt-${opt.id}`} className={`text-gray-700 select-none ${!selectedValue ? 'text-gray-400' : ''}`}>
                          {opt.label}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                  <p className={`mt-4 text-sm ${!selectedValue ? 'text-gray-400' : 'text-gray-500'}`}>
                      {fileFormat ? `Selected: .${fileFormat.toUpperCase()}` : "Choose the format of your upload file."}
                  </p>
                </div>
            </div>

            {/* Step 2: File Upload */}
             <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
               <h2 className="text-lg font-semibold mb-4 text-gray-800">3. Upload File</h2>
                 <div className="flex flex-col md:flex-row items-center gap-6">
                   <div
                     onDragOver={handleDragOver}
                     onDrop={handleOnDrop}
                     className={`flex-1 border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition text-center
                       ${!selectedValue || !fileFormat ? 'border-gray-300 bg-gray-100 cursor-not-allowed' : 'border-blue-300 hover:bg-blue-50 cursor-pointer'}`}
                     onClick={() => (selectedValue && fileFormat && inputRef.current?.click())} // Only allow click if prerequisites met
                   >
                     <Input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept={fileFormat === 'csv' ? '.csv' : fileFormat === 'json' ? '.json' : ''} // Set accept based on selection
                        disabled={!selectedValue || !fileFormat}
                      />
                     {!file ? (
                       <>
                         <UploadCloudIcon className={`w-12 h-12 mb-2 ${!selectedValue || !fileFormat ? 'text-gray-400' : 'text-blue-400'}`} />
                         <span className={`text-gray-600 ${!selectedValue || !fileFormat ? 'text-gray-400' : ''}`}>
                             {selectedValue && fileFormat ? `Drag & drop ${fileFormat.toUpperCase()} file or click to upload` : "Select category and format first"}
                           </span>
                       </>
                     ) : (
                       <div className="flex items-center space-x-4 bg-white p-3 rounded border border-gray-300 max-w-full overflow-hidden">
                         <FileIcon className="w-8 h-8 text-green-500 flex-shrink-0" />
                         <span className="font-medium text-gray-800 truncate" title={file.name}>{file.name}</span>
                         <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handelRemoveImage(); }}> {/* Prevent click propagation */}
                           <XIcon className="w-5 h-5 text-gray-500 hover:text-red-600" />
                         </Button>
                       </div>
                     )}
                   </div>

                   {/* Step 3: Actions */}
                   <div className="flex flex-col space-y-4 items-center md:items-start">
                      <Button
                        onClick={handleVerifyClick}
                        disabled={!file || !selectedValue || !fileFormat || processedData.length > 0 || isDataNotCorrect} // Disable if file missing, already processed, or has errors
                        className="w-48 bg-blue-600 hover:bg-blue-700"
                        aria-label="Verify Uploaded File"
                        >
                          {processedData.length > 0 ? "Data Loaded" : "Verify File"}
                      </Button>
                      <Button
                        onClick={handleAllocationPage}
                        disabled={!validationTrigger || processedData.length === 0} // Enable only after successful validation
                        className="w-48 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700"
                        aria-label="Proceed to Dorm Allocation"
                       >
                         <span>Go to Allocation</span>
                         <ArrowRight className="w-5 h-5"/>
                      </Button>
                      {isDataNotCorrect && (
                         <p className="text-red-500 text-sm text-center md:text-left">Validation Failed. Fix errors and re-upload.</p>
                      )}
                       {validationTrigger && (
                         <p className="text-green-600 text-sm text-center md:text-left">Validation Successful. Proceed to Allocation.</p>
                      )}
                   </div>
                 </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}