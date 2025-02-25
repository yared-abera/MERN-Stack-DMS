import { Button } from "react-scroll";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { isErrorHappen } from "@/store/common/data";

const data = {
  Fname: String,
  Mname: String,
  Lname: String,
  email: String,
  userName: String,
  phoneNum: String,
  password: String,
  sex: String,
  role: String,
  batch: String,
  isSpecial: String,
  isDisable: String,
  address: String,
};

function ValidateData({
  inputData,
  setIsCorrect,
  showDetailError,
  ErrorViewer,
 
}) {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const errors = [];

  Object.keys(data).forEach((key) => {
    if (!(key in inputData)) {
      errors.push(`Missing required attribute: ${key}`);
    }
  });

  Object.entries(inputData).forEach(([key, value]) => {
    if (key in data) {
      const expectedType = data[key];
      let actualType = value?.constructor;

      if (actualType !== expectedType) {
        errors.push(`Invalid type for ${key}: Expected ${expectedType.name}`);
      }
    }
  });

  // 3. Check for unexpected fields
  Object.keys(inputData).forEach((key) => {
    if (!(key in data)) {
      errors.push(`Unexpected field: ${key}`);
    }
  });

  // 4. Validate email format
  if (inputData.email && !emailRegex.test(inputData.email)) {
    setIsCorrect(false);
    //errors.push(`Invalid email format: ${inputData.email}`);
    return (
      <p className="text-red-500 py-1 text-sm">
        Invalid email: {inputData.email}
      </p>
    );
  }
  if (errors.length > 0) {
    setIsCorrect(false);
    ErrorViewer({ errors });

    if (showDetailError) {
      return (
        <div className="mb-4">
          {errors.map((error, index) => (
            <p key={index} className="text-red-500 py-1 text-sm">
              {error}
            </p>
          ))}
        </div>
      );
    }
  }

  return null;
}

export default function DataChecker({
  dataFormat,
  setDataFormat,
  ErrorViewer,
  setFile,
}) {
  const [dialogOpen, setDialogOpen] = useState(true);

  const [isCorrect, setIsCorrect] = useState(true);
  const [showDetailError, setShowDetailerror] = useState(false);
   
  const ErrorStore=[]
  const dispatch = useDispatch();
  const DataLength = dataFormat.length - 1;

  function handleDialog() {
    setDialogOpen(false);
    setDataFormat('')
    setFile("");
  }

//   function ErrorViewer({ errors }) {
//     if (errors.length > 0) {
//       ErrorStore.push(...errors);
//     }
// }

console.log(ErrorStore,"ErrorStor from out side");


  return (
     
    <Dialog open={dialogOpen} onOpenChange={handleDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Validating the Input Data</DialogTitle>
          <DialogDescription>
            <div className="border-2 border-green-600 flex flex-col gap-1 w-full h-auto p-3 md:p-6">
              {dataFormat?.length > 0 &&
                dataFormat.map((data, index) => (
                  <ValidateData
                    key={index} // Add unique key prop
                    inputData={data}
                    setIsCorrect={setIsCorrect}
                    showDetailError={showDetailError}
                    ErrorViewer={ErrorViewer}
                    
                  />
                ))}

              {isCorrect ? (
                <p className="text-green-500 py-2">✅ Data entry is valid</p>
              ) : (
                <div className="flex-col justify-between">
                  <p className="text-red-500 py-1 text-sm">Error</p>

                  <Button
                    variant="outline"
                    onClick={() => setShowDetailerror(true)}
                    className="text-sky-100"
                  >
                    show Detail Error
                  </Button>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
    
  );
}
