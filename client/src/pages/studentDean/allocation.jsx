import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RadioButton } from "@/config/data";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";

export default function DormAllocation() {
  const [file, setFile] = useState(null);
  const inputRef = useRef();
  const [selectedValue, setSelectedValue] = useState("");

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
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleFile() {}

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
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
          <RadioGroup>
            {RadioButton.map((item) => (
              <div className="flex items-center space-x-2" key={item.id}>
                <input
                  type="radio"
                  value={item.value}
                  id={item.id}
                  checked={selectedValue === item.value}
                  onChange={handleChange}
                />
                <label htmlFor={item.id}>{item.label}</label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex-1 sm:m-3 md:m-6  flex    flex-col ">
          <div
            className="flex items-center h-[85%] flex-col justify-center dark:bg-blue-900 shadow-xl shadow-sky-950  border-solid dark:shadow-white"
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
                className="h-20  w-auto sm:p-3 md:p-4"
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

          <div className="flex items-end gap-4 justify-end mt-4">
            <Button
              onClick={handleFile}
              disabled={!file || selectedValue === ""}
            >
              Allocate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
