import { BlockDemoData } from "@/config/data";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { toast } from "sonner";

export default function AllocationLast({
  studAndBlockInfo,
  viewAllocatedStudent,
}) {
  const { catagorizedStudentData, selectOption } = useSelector(
    (state) => state.Data
  );

  // State for block data and allocated students
  const [updatedBlockData, setUpdatedBlockData] = useState(BlockDemoData);
  const [allocatedStudents, setAllocatedStudents] = useState([]);
  const [allocatedFreashStudents, setAllocatedFreashStudents] = useState([]);

  // Updated IdentifyStudent function for proper parsing
  function IdentifyStudent({ studAndBlockInfo }) {
    const studentKey = studAndBlockInfo.studCategory;
    const parts = studentKey.split(" ");
    const stateKey = parts[0];

    const gender = stateKey === "regular" ? parts[2] : parts[1];
    const SelectedGender = gender === "male" ? "GenderMale" : "GenderFemale";
    let StudCategory;
    let Stream = null;

    if (stateKey === "physicalDisable") {
      StudCategory = "disabled";
    } else if (stateKey === "scholar") {
      StudCategory = "special";
    } else if (stateKey === "regular") {
      // For regular, the stream is parts[1]
      const streamType = parts[1];
      StudCategory = gender === "male" ? "RegularMale" : "RegularFemale";
      Stream = streamType === "natural" ? "NaturalStream" : "SoctiaStream";
    }
    return { SelectedGender, StudCategory, Stream };
  }

  function getSameBatchAndDepartment({ student, selectedStudentGroup }) {
    const { batch, department } = student;
    return selectedStudentGroup.filter(
      (stud) => stud.batch === batch && stud.department === department
    );
  }

  function groupStudentsByBatchAndDepartment(selectedStudentGroup) {
    const processed = new Set();
    const groups = [];

    selectedStudentGroup.forEach((student) => {
      const key = `${student.batch}-${student.department}`;
      if (!processed.has(key)) {
        const sameGroup = getSameBatchAndDepartment({
          student,
          selectedStudentGroup,
        });
        if (sameGroup.length > 0) {
          sameGroup.sort((a, b) =>
            (a.Fname || "")
              .toUpperCase()
              .localeCompare((b.Fname || "").toUpperCase())
          );
          groups.push(sameGroup);
          processed.add(key);
        }
      }
    });
    return groups;
  }

  function AllocateSeniorStudent(
    stud,
    SelectedGender,
    studAndBlockInfo,
    currentBlockData
  ) {
    const blockLocation =
      SelectedGender === "GenderMale" ? "boys_Campus" : "girls_Campus";
    const { BlockNumber, FloorNumber } = studAndBlockInfo;

    // Find block index
    const blockIndex = currentBlockData.findIndex(
      (block) =>
        block.blockNum === BlockNumber && block.location === blockLocation
    );
    if (blockIndex === -1) {
      console.warn(`Block ${BlockNumber} not found in ${blockLocation}`);
      return null;
    }

    const block = currentBlockData[blockIndex];
    // Determine if we have a matching floor; if not, search all floors
    const searchAllFloors = !block.floors.some(
      (f) => f.floorNumber === FloorNumber
    );

    // Flatten dorms from all floors
    const allDorms = block.floors.flatMap((floor, floorIdx) =>
      floor.dorms.map((dorm, dormIdx) => ({
        ...dorm,
        floorIndex: floorIdx,
        originalDormIndex: dormIdx,
        floorNumber: floor.floorNumber,
      }))
    );

    // Filter dorms by floor if available; otherwise, search in all floors
    const filteredDorms = searchAllFloors
      ? allDorms
      : allDorms.filter((d) => d.floorNumber === FloorNumber);

    // Find the first available dorm
    const availableDorm = filteredDorms.find(
      (d) => d.numberOfStudents < d.capacity
    );
    if (!availableDorm) {
      console.warn(`No available dorms in block ${BlockNumber}`);
      return null;
    }

    const { floorIndex, originalDormIndex, dormNumber } = availableDorm;

    // Create the updated student allocation
    const updatedStudent = {
      ...stud,
      block: BlockNumber,
      dorm: dormNumber,
    };

    // Immutably update the block data structure
    const newBlockData = currentBlockData.map((blockItem, idx) => {
      if (idx === blockIndex) {
        return {
          ...blockItem,
          floors: blockItem.floors.map((floor, fIdx) => {
            if (fIdx === floorIndex) {
              return {
                ...floor,
                dorms: floor.dorms.map((dorm, dIdx) => {
                  if (dIdx === originalDormIndex) {
                    return {
                      ...dorm,
                      numberOfStudents: dorm.numberOfStudents + 1,
                    };
                  }
                  return dorm;
                }),
              };
            }
            return floor;
          }),
        };
      }
      return blockItem;
    });

    return { updatedStudent, newBlockData };
  }

  // Process allocation for senior students
  async function seniorStudentAllocation() {
    const { SelectedGender, StudCategory, Stream } = IdentifyStudent({
      studAndBlockInfo,
    });
    let selectedStudentGroup;
    if (StudCategory === "RegularMale" || StudCategory === "RegularFemale") {
      selectedStudentGroup =
        catagorizedStudentData[SelectedGender][StudCategory][Stream];
    } else {
      selectedStudentGroup =
        catagorizedStudentData[SelectedGender][StudCategory];
    }

    if (!selectedStudentGroup || selectedStudentGroup.length === 0) {
      console.warn("No students available for allocation");
      return;
    }

    if (checkBlockAndDormExist(selectedStudentGroup)) {
      return;
    }

    const groups = groupStudentsByBatchAndDepartment(selectedStudentGroup);
    let currentBlockDataState = [...updatedBlockData];
    const newAllocatedStudents = [];

    for (const group of groups) {
      for (const stud of group) {
        const allocationResult = AllocateSeniorStudent(
          stud,
          SelectedGender,
          studAndBlockInfo,
          currentBlockDataState
        );
        if (allocationResult) {
          const { updatedStudent, newBlockData } = allocationResult;
          newAllocatedStudents.push(updatedStudent);
          currentBlockDataState = newBlockData;
        } else {
          console.warn(
            `Allocation failed for student: ${stud.Fname} ${stud.Lname}`
          );
        }
      }
    }
    // Update state once after processing all students
    setUpdatedBlockData(currentBlockDataState);
    //setAllocatedStudents(newAllocatedStudents);
    setAllocatedStudents((prev) => [...prev, ...newAllocatedStudents]);

    if(newAllocatedStudents&&newAllocatedStudents.length>0){
      return toast.success(`Student ${studAndBlockInfo.studCategory} allocated successfully`)
    }
  }

  function OrderFreashStudent(selectedStudentGroup) {
    return [...selectedStudentGroup].sort((a, b) =>
      (a.Fname || "").toUpperCase().localeCompare((b.Fname || "").toUpperCase())
    );
  }
  function AllocateFreashStudent(
    student,
    SelectedGender,
    studAndBlockInfo,
    currentBlockData
  ) {
    const { BlockNumber, FloorNumber } = studAndBlockInfo;
    const blockLocation =
      SelectedGender === "GenderMale" ? "boys_Campus" : "girls_Campus";

    // Find the matching block by block number and location
    const blockIndex = currentBlockData.findIndex(
      (block) =>
        block.blockNum === BlockNumber && block.location === blockLocation
    );
    if (blockIndex === -1) {
      console.warn(`Block ${BlockNumber} not found in ${blockLocation}`);
      return null;
    }

    const block = currentBlockData[blockIndex];

    // Determine whether the specified floor exists in this block.
    const hasMatchingFloor = block.floors.some(
      (floor) => floor.floorNumber === FloorNumber
    );
    // If not, search in all floors; otherwise, filter to the given floor.
    const searchAllFloors = !hasMatchingFloor;

    // Flatten dorms with additional metadata
    const allDorms = block.floors.flatMap((floor, floorIndex) =>
      floor.dorms.map((dorm, dormIndex) => ({
        ...dorm,
        floorIndex,
        originalDormIndex: dormIndex,
        floorNumber: floor.floorNumber,
      }))
    );

    const filteredDorms = searchAllFloors
      ? allDorms
      : allDorms.filter((dorm) => dorm.floorNumber === FloorNumber);

    // Find the first dorm that has available capacity
    const availableDorm = filteredDorms.find(
      (dorm) => dorm.numberOfStudents < dorm.capacity
    );
    if (!availableDorm) {
      console.warn(`No available dorms in block ${BlockNumber}`);
      return null;
    }

    const { floorIndex, originalDormIndex, dormNumber } = availableDorm;

    // Create the updated student allocation record.
    const updatedStudent = {
      ...student,
      block: BlockNumber,
      dorm: dormNumber,
    };

    // Immutably update the block data: increase numberOfStudents in the chosen dorm.
    const newBlockData = currentBlockData.map((blockItem, idx) => {
      if (idx === blockIndex) {
        return {
          ...blockItem,
          floors: blockItem.floors.map((floor, fIdx) => {
            if (fIdx === floorIndex) {
              return {
                ...floor,
                dorms: floor.dorms.map((dorm, dIdx) => {
                  if (dIdx === originalDormIndex) {
                    return {
                      ...dorm,
                      numberOfStudents: dorm.numberOfStudents + 1,
                    };
                  }
                  return dorm;
                }),
              };
            }
            return floor;
          }),
        };
      }
      return blockItem;
    });

    return { updatedStudent, newBlockData };
  }




  function checkBlockAndDormExist(selectedStudentGroup) {
    const hasDormAndBlock = selectedStudentGroup.every(
      (stud) => stud.block !== null && stud.dorm !== null
    );
    if (hasDormAndBlock) {
      toast.error("Student has already allocated");
      return true;
    }
    return false;
  }
  
  function freshStudentAllocation() {
    const { SelectedGender, StudCategory, Stream } = IdentifyStudent({
      studAndBlockInfo,
    });
    let selectedStudentGroup;
    if (StudCategory === "RegularMale" || StudCategory === "RegularFemale") {
      selectedStudentGroup =
        catagorizedStudentData[SelectedGender][StudCategory][Stream];
    } else {
      selectedStudentGroup =
        catagorizedStudentData[SelectedGender][StudCategory];
    }
  
    if (!selectedStudentGroup || selectedStudentGroup.length === 0) {
      console.warn("No students available for allocation");
      return;
    }
  
    // Abort allocation if all students have already been allocated
    if (checkBlockAndDormExist(selectedStudentGroup)) {
      return;
    }
  
    const ArrangedStudent = OrderFreashStudent(selectedStudentGroup);
    console.log(ArrangedStudent, "ArrangedStudent");
    let currentBlockDataState = [...updatedBlockData];
    const newAllocatedStudents = [];
  
    for (const student of ArrangedStudent) {
      const allocatedFreash = AllocateFreashStudent(
        student,
        SelectedGender,
        studAndBlockInfo,
        currentBlockDataState
      );
      if (allocatedFreash) {
        const { updatedStudent, newBlockData } = allocatedFreash;
        newAllocatedStudents.push(updatedStudent);
        currentBlockDataState = newBlockData;
      } else {
        console.warn(
          `Allocation failed for student: ${student.Fname} ${student.Lname}`
        );
      }
    }


       // Update state once after processing all students
       setUpdatedBlockData(currentBlockDataState);
       setAllocatedFreashStudents((prev) => [...prev, ...newAllocatedStudents]);
  if(newAllocatedStudents&&newAllocatedStudents.length>0){
    return toast.success(`Student ${studAndBlockInfo.studCategory} allocated successfully`)
  }
 
  }
  
//   function chechBlockAndDormExist(selectedStudentGroup){
// const hasDormAndBlock = selectedStudentGroup.every(
//       (stud) => stud.block !== "" && stud.dorm !== ""
//     );
//     if (hasDormAndBlock) {
//       toast.error("Student has already allocated");
//     }

//     return

//   }
//   function freshStudentAllocation() {
//     const { SelectedGender, StudCategory, Stream } = IdentifyStudent({
//       studAndBlockInfo,
//     });
//     let selectedStudentGroup;
//     if (StudCategory === "RegularMale" || StudCategory === "RegularFemale") {
//       selectedStudentGroup =
//         catagorizedStudentData[SelectedGender][StudCategory][Stream];
//     } else {
//       selectedStudentGroup =
//         catagorizedStudentData[SelectedGender][StudCategory];
//     }

//     if (!selectedStudentGroup || selectedStudentGroup.length === 0) {
//       console.warn("No students available for allocation");
//       return;
//     }
   

//     chechBlockAndDormExist(selectedStudentGroup)
    

//     const ArrangedStudent = OrderFreashStudent(selectedStudentGroup);
//     console.log(ArrangedStudent, "ArrangedStudent");
//     let currentBlockDataState = [...updatedBlockData];
//     const newAllocatedStudents = [];

//     for (const student of ArrangedStudent) {
//       const allocatedFreash = AllocateFreashStudent(
//         student,
//         SelectedGender,
//         studAndBlockInfo,
//         currentBlockDataState
//       );
//       if (allocatedFreash) {
//         const { updatedStudent, newBlockData } = allocatedFreash;
//         newAllocatedStudents.push(updatedStudent);
//         currentBlockDataState = newBlockData;
//       } else {
//         console.warn(
//           `Allocation failed for student: ${student.Fname} ${student.Lname}`
//         );
//       }
//     }

//     // Update state once after processing all students
//     setUpdatedBlockData(currentBlockDataState);
//     //setAllocatedStudents(newAllocatedStudents);
//     setAllocatedFreashStudents((prev) => [...prev, ...newAllocatedStudents]);
//   }

  // Run allocation only when selectOption is "senior"
  useEffect(() => {
    if (selectOption === "senior") {
      seniorStudentAllocation();
    } else if (selectOption === "fresh" || selectOption === "remedial") {
      freshStudentAllocation();
    }
  }, [selectOption, studAndBlockInfo]);

  return (
    <div>
      {selectOption === "senior" ? (
        <div>
          <h3>Senior Allocation Completed</h3>
          <div>
            <h4>Allocated Students:</h4>
            <ul>
              {allocatedStudents.map((stud, idx) => (
                <li key={idx}>
                  {stud.Fname} {stud.Lname} - Block: {stud.block}, Dorm:{" "}
                  {stud.dorm}
                </li>
              ))}
              
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <h3>Freash Allocation Completed</h3>
          <div>
            <h4>Allocated Students:</h4>
            <ul>
              {allocatedFreashStudents.map((stud, idx) => (
                <li key={idx}>
                  {stud.Fname} {stud.Lname} - Block: {stud.block}, Dorm:{" "}
                  {stud.dorm}
                </li>
              ))}
            </ul>
           
          </div>
        </div>
      )}
    </div>
  );
}
