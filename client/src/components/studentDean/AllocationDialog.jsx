import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { BlockDemoData } from "@/config/data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import AllocationLast from "./studentAllocation.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function AllocationDialog({ selectedBlockANDFloor }) {
  const { userCalculatedValue } = useSelector((state) => state.Data);
  const AllBlock = BlockDemoData;

  const [isStudentGetBlockState, setIsStudentGetBlockState] = useState({
    regular: {
      natural: {
        male: [],
        female: [],
      },
      social: {
        male: [],
        female: [],
      },
    },
    physicalDisable: {
      male: [],
      female: [],
    },
    scholar: {
      male: [],
      female: [],
    },
  });

  const [Errors, setErrors] = useState([]);

  const [studAndBlockInfo, setStudAndBlockInfo] = useState({
    studCategory: "",
    BlockNumber: "",
    FloorNumber: "",
  });
  const studentCategories = [
    {
      key: "maleNatural",
      option: "male",
      category: "natural",
      stateKey: "regular",
    },
    {
      key: "maleSocial",
      option: "male",
      category: "social",
      stateKey: "regular",
    },
    {
      key: "femaleNatural",
      option: "female",
      category: "natural",
      stateKey: "regular",
    },
    {
      key: "femaleSocial",
      option: "female",
      category: "social",
      stateKey: "regular",
    },
    {
      key: "maleDisabled",
      option: "male",
      category: "",
      stateKey: "physicalDisable",
    },
    {
      key: "femaleDisabled",
      option: "female",
      category: "",
      stateKey: "physicalDisable",
    },
    { key: "maleSpecial", option: "male", category: "", stateKey: "scholar" },
    {
      key: "femaleSpecial",
      option: "female",
      category: "",
      stateKey: "scholar",
    },
  ];
  useEffect(() => {
    const allErrors = [];

    // Fresh state object with empty arrays for each student category
    const updatedState = {
      regular: {
        natural: {
          male: [],
          female: [],
        },
        social: {
          male: [],
          female: [],
        },
      },
      physicalDisable: {
        male: [],
        female: [],
      },
      scholar: {
        male: [],
        female: [],
      },
    };

    // Define student categories and corresponding keys

    studentCategories.forEach(({ key, option, category, stateKey }) => {
      const studentCount = userCalculatedValue[key];

      // Gather all floor selections for this student category.
      // Each entry will have both a blockNumber and a floorNumber.
      const floorSelections = selectedBlockANDFloor.CheckedFloors.filter(
        (floor) =>
          floor.floorNumber &&
          floor.blockNumber &&
          floor.checkForKey === stateKey &&
          floor.checkForOption === option &&
          floor.checkForCategory === category
      ).map((floor) => ({
        blockNumber: floor.blockNumber,
        floorNumber: floor.floorNumber,
      }));

      // Gather all block selections for this student category.
      // For these, floorNumber is set to null.
      const blockSelections = selectedBlockANDFloor.CheckedBlocks.filter(
        (block) =>
          block.blockNumber &&
          block.checkForKey === stateKey &&
          block.checkForOption === option &&
          block.checkForCategory === category
      ).map((block) => ({
        blockNumber: block.blockNumber,
        floorNumber: null,
      }));

      // Combine both floor and block selections.
      const combinedSelections = [...floorSelections, ...blockSelections];

      // If there are selections and the student count is positive, update state.
      if (studentCount > 0 && combinedSelections.length > 0) {
        if (stateKey === "regular" && category) {
          updatedState[stateKey][category][option] = combinedSelections;
        } else {
          updatedState[stateKey][option] = combinedSelections;
        }
      } else if (studentCount === 0 && combinedSelections.length > 0) {
        // Log error if selections exist for a category with zero student count.
        allErrors.push(`No ${key} user but block/floor is chosen`);
      }
    });

    setIsStudentGetBlockState(updatedState);
    setErrors(allErrors);
  }, [userCalculatedValue, selectedBlockANDFloor]);

  const [viewDetailError, setViewDetailError] = useState(false);

  const filterCategoriesWithValues = (state) => {
    const filtered = {};
    for (const key in state) {
      const value = state[key];
      if (Array.isArray(value)) {
        if (value.length > 0) {
          filtered[key] = value;
        }
      } else if (typeof value === "object" && value !== null) {
        const nestedFiltered = filterCategoriesWithValues(value);
        if (Object.keys(nestedFiltered).length > 0) {
          filtered[key] = nestedFiltered;
        }
      }
    }
    return filtered;
  };

  function getStudentNumber(studentKey) {
    const parts = studentKey.split(" ");

    const stateKey = parts[0]; // First part is always stateKey (e.g., "regular")
    let option; // Second part is always option (e.g., "male")
    // Third part (if exists) is category
    let category;
    if (stateKey === "regular") {
      category = parts[1];
      option = parts[2];
    } else {
      option = parts[1];
    }

    // Find matching category entry
    const matchingCategory =
      stateKey === "regular"
        ? studentCategories.find(
            (item) =>
              item.stateKey === stateKey &&
              item.option === option &&
              item.category === category
          )
        : studentCategories.find(
            (item) => item.stateKey === stateKey && item.option === option
          );

    return matchingCategory?.key; // Return the key (e.g., "maleNatural")
  }

  function getStudentStatus(capacity, numberOfStudents, studentKey) {
    const errors = [];
    const difference = capacity - numberOfStudents;

    if (capacity < numberOfStudents) {
      return "Error";
    } else if (difference === 0) {
      return "Perfect";
    } else if (difference >= 1 && difference <= 10) {
      return "Good";
    } else {
      return "Warning";
    }
  }

  function ErrorAndWarnningHover({ status }) {
    if (status === "Error") {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className="text-red-700">Error</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                The selected block/floor is less than the number of student!!{" "}
                <b>Please ReSelect </b>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else if (status === "Warning") {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className="text-red-400">Warning</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Too many space will be free Consider it</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else if (status === "Perfect") {
      return <span className="text-green-700">Perfect</span>;
    } else {
      return <span className="text-green-700">Good</span>;
    }
  }

  function HandleAllocation({ studentKey, item }) {
    console.log(item, "item");

    setStudAndBlockInfo({
      studCategory: studentKey,
      BlockNumber: item.blockNumber,
      FloorNumber: item.floorNumber,
    });
  }

  function viewAllocatedStudent(student){

  }
  const renderSelectdInfo = useCallback(
    (obj, path = []) => {
      let rows = [];
      Object.entries(obj).forEach(([key, value]) => {
        const newPath = [...path, key];
        if (Array.isArray(value)) {
          if (value.length > 0) {
            const studentKey = newPath.join(" ");
            let totalCapacity = 0;
  
            // First pass: Calculate total capacity for all blocks in this category
            const itemsWithCapacity = value.map((item) => {
              const currentFilteredBlock = AllBlock.find(
                (block) => block.blockNum === item.blockNumber
              );
              let capacity = null;
              if (currentFilteredBlock) {
                capacity =
                  item.floorNumber !== null
                    ? currentFilteredBlock.floors.find(
                        (f) => f.floorNumber === item.floorNumber
                      )?.floorCapacity
                    : currentFilteredBlock.totalCapacity;
              }
              totalCapacity += capacity || 0; // Treat null as 0 in sum
              return { item, capacity };
            });
  
            // Get student count and status based on TOTAL capacity
            const numberOfStudents =
              userCalculatedValue[getStudentNumber(studentKey)];
            const status = getStudentStatus(
              totalCapacity,
              numberOfStudents,
              studentKey
            );
  
            // Second pass: Generate table rows with individual capacities but shared status
            itemsWithCapacity.forEach(({ item, capacity }) => {
              rows.push(
                <Card key={`${studentKey}-${item.blockNumber}-${item.floorNumber}`} className='w-auto px-2'>
                  <CardHeader>
                    <CardTitle>Selected Info</CardTitle>
                    
                  </CardHeader>
                  <CardContent>
                    <p>Student Category: {studentKey}</p>
                    <p>Selected Block: {item.blockNumber}</p>
                    <p>
                      Selected Floor:{" "}
                      {item.floorNumber !== null ? item.floorNumber : "whole Block"}
                    </p>
                    <p>Number of Student: {numberOfStudents}</p>
                    <p>
                      Capacity:{" "}
                      {item.floorNumber !== null
                        ? `floor capacity ${capacity}`
                        : `block capacity ${capacity}`}
                    </p>
                    <p>
                      Status: <ErrorAndWarnningHover status={status} />
                    </p>

                   
                  </CardContent>
                  <CardFooter className='flex justify-between'>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={status === "Error"}
                      onClick={() => HandleAllocation({ studentKey, item })}
                    >
                      Allocate
                    </Button>

                    <Button className='hidden'>View</Button>
                  </CardFooter>
                </Card>
              );
            });
          }
        } else if (typeof value === "object" && value !== null) {
          rows = rows.concat(renderSelectdInfo(value, newPath));
        }
      });
      return rows;
    },
    [AllBlock, userCalculatedValue, getStudentNumber, getStudentStatus]
  );
  
  const filteredState = filterCategoriesWithValues(isStudentGetBlockState);
  
  return (
    <div>
          <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold">Selectd block Information</h1>
         </div>   
      {Errors.length > 0 ? (
        <div className="flex flex-col gap-3 text-center">
          <p className="text-red-600">
            Block or Floor is Selected without a corresponding student
          </p>
          <div>
            <Button onClick={() => setViewDetailError(!viewDetailError)}>
              View Detail
            </Button>
          </div>
  
          {viewDetailError
            ? Errors.map((error, idx) => (
                <div key={idx} className="mt-3">
                  {error}
                </div>
              ))
            : null}
        </div>
      ) : (
        <div className="flex flex-col gap-1   ">
          <div className=" flex flex-wrap gap-3 m-4">
    {/* Call the helper function directly with the filteredState */}
    {renderSelectdInfo(filteredState)}
          </div>
      
  
          <div className="flex mt-3">
            {studAndBlockInfo &&
            Object.values(studAndBlockInfo).every((item) => item !== "") ? (
              <AllocationLast studAndBlockInfo={studAndBlockInfo} viewAllocatedStudent={viewAllocatedStudent} />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
  
}
