import { Dialog } from "@radix-ui/react-dialog";

import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";

 
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import HelperDialog from "./herlperDialog";
import { getAllocatedStudent } from "@/store/studentAllocation/allocateSlice";

export default function AllocationDialog({ selectedBlockANDFloor }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllocatedStudent());
  }, [dispatch]);
  const { userCalculatedValue } = useSelector((state) => state.Data);
  const { AllocatedStudent } = useSelector((state) => state.student);
  const { selectedStudent } = useSelector((state) => state.Data);
  console.log(selectedStudent, "selectedstudent");

  const { AvailebleBlocks } = useSelector((state) => state.block);
  const AllBlock = AvailebleBlocks.data;

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
  const [openDialog, setOPenDialog] = useState([]);

  const [studAndBlockInfo, setStudAndBlockInfo] = useState({
    studCategory: "",
    BlockNumber: [],
    FloorNumber: [],
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

  function HandleAllocation({ studentKey, blockNumbers, floorNumbers }) {
    setStudAndBlockInfo({
      studCategory: studentKey,
      BlockNumber: blockNumbers,
      FloorNumber: floorNumbers,
    });
  }

  function HandleViewDialog() {
   

    const students = AllocatedStudent.filter((stud) =>
      selectedStudent.some((student) => student.userName === stud.userName)
    );

    setOPenDialog(students);
  }

  const renderSelectdInfo = useCallback(
    (obj, path = []) => {
      let rows = [];
      Object.entries(obj).forEach(([key, value]) => {
        const newPath = [...path, key];
        if (Array.isArray(value) && value.length > 0) {
          const studentKey = newPath.join(" ");
          let totalCapacity = 0;
          const blockNumbers = [];
          const floorNumbers = []; // Changed to array

          // Loop through each selected item and aggregate info
          value.forEach((item) => {
            const currentFilteredBlock = AllBlock.find(
              (block) => block.blockNum === item.blockNumber
            );
            let capacity = 0;
            if (currentFilteredBlock) {
              if (item.floorNumber !== null) {
                const floorData = currentFilteredBlock.floors.find(
                  (f) => f.floorNumber === item.floorNumber
                );
                capacity = floorData ? floorData.totalAvailable : 0;
                floorNumbers.push({
                  // Changed to push object
                  floor: item.floorNumber,
                  block: item.blockNumber,
                });
              } else {
                capacity = currentFilteredBlock.totalAvailable;
              }
              blockNumbers.push(item.blockNumber);
            }
            totalCapacity += capacity;
          });

          // Get student count and status based on total capacity
          const numberOfStudents =
            userCalculatedValue[getStudentNumber(studentKey)];
          const status = getStudentStatus(
            totalCapacity,
            numberOfStudents,
            studentKey
          );

          rows.push(
            <Card key={studentKey} className="w-auto px-2">
              <CardHeader>
                <CardTitle>Selected Info</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Student Category: {studentKey}</p>
                <p>Selected Block: {Array.from(blockNumbers).join(", ")}</p>
                <p>
                  Selected Floor:{" "}
                  {floorNumbers.length > 0 // Changed to check array length
                    ? floorNumbers
                        .map(
                          (fb, index) => `Floor ${fb.floor}, Block ${fb.block}` // Modified to display floor and block
                        )
                        .join(", ")
                    : "Whole Block"}
                </p>
                <p>Number of Student: {numberOfStudents}</p>
                <p>Capacity: {totalCapacity}</p>
                <p>
                  Status: <ErrorAndWarnningHover status={status} />
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  size="sm"
                  disabled={status === "Error"}
                  onClick={() =>
                    HandleAllocation({ studentKey, blockNumbers, floorNumbers })
                  }
                >
                  Allocate
                </Button>{/**disabled={!(openDialog.length>0)} */}
                <Button 
                  onClick={() => HandleViewDialog()}
                >
                  View
                </Button>
              </CardFooter>
            </Card>
          );
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
        <h1 className="text-lg md:text-xl font-bold">
          Selectd block Information
        </h1>
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
              (studAndBlockInfo.BlockNumber?.length > 0 ||
              studAndBlockInfo.FloorNumber?.length > 0 ? (
                <AllocationLast studAndBlockInfo={studAndBlockInfo} />
              ) : null)}
          </div>

          <div>
            {openDialog && openDialog.length > 0 ? (
              <HelperDialog
                openDialog={openDialog}
                setOPenDialog={setOPenDialog}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
//  npx shadcn@latest add hover-card
