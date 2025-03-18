import { BlockDemoData } from "@/config/data";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { getAllocatedStudent, InsertAllocatedStudent } from "@/store/studentAllocation/allocateSlice";
import { GetAvaiableBlocks, UpdateBlock } from "@/store/blockSlice";

export default function AllocationLast({
  studAndBlockInfo,
   
}) {
  const { catagorizedStudentData, selectOption } = useSelector(
    (state) => state.Data
  );
  const { AvailebleBlocks } = useSelector((state) => state.block);
  
 
  // State for block data and allocated students
  const [updatedBlockData, setUpdatedBlockData] = useState(AvailebleBlocks.data);
  const [allocatedStudents, setAllocatedStudents] = useState([]);
  const [AllallocatedStudents, setAllAllocatedStudents] = useState([]);
  const dispatch=useDispatch()
 
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
    console.log(selectedStudentGroup,'selectedStudentGroup');
    
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
      console.log(groups,'groups');
      
    });
    return groups;
  }

  async function seniorStudentAllocation({ selectedStudentGroup, SelectedGender }) {
    const groups = groupStudentsByBatchAndDepartment(selectedStudentGroup);
    let currentBlockDataState = [...updatedBlockData];
    const newAllocatedStudents = [];
  
    // Determine the campus location based on gender
    const blockLocation = SelectedGender === "GenderMale" ? "maleArea" : "femaleArea";
    // Destructure block and floor selections from studAndBlockInfo
    // BlockNumber is an array and FloorNumber is an array of objects: { floor, block }
    const { BlockNumber: blockNumbers, FloorNumber: floorSelections } = studAndBlockInfo;
  
    for (const group of groups) {
      for (const stud of group) {
        let allocated = false;
        // Try each block one by one for the current student
        for (const blockNum of blockNumbers) {
          const allocationResult = AllocateSeniorStudent(
            stud,
            blockLocation,
            floorSelections,
            blockNum,
            currentBlockDataState
          );
  
          if (allocationResult) {
            const { updatedStudent, updatedBlock, blockIndex } = allocationResult;
            dispatch(InsertAllocatedStudent({updatedStudent})).then(data=>{
            if(data?.paylod?.success){
              dispatch(getAllocatedStudent() )
            }
              
            });
            // Update the specific block in state instead of all blocks
            currentBlockDataState[blockIndex] = updatedBlock;
           dispatch(UpdateBlock({updatedBlock})).then(data=>{
              if(data?.payload?.success){
                dispatch(GetAvaiableBlocks())
              }
           });
           
           
            newAllocatedStudents.push(updatedStudent);
            allocated = true;
            break; // Allocation successful – move to the next student
          }
        }
        if (!allocated) {
          console.warn(`Allocation failed for student: ${stud.Fname} ${stud.Lname}`);
        }
      }
    }
  
    // Update state after processing all students
    setUpdatedBlockData(currentBlockDataState);
    console.log(newAllocatedStudents, 'newAllocatedStudents');
    setAllocatedStudents(newAllocatedStudents);
  
    if (newAllocatedStudents.length > 0) {
      return toast.success(`Student ${studAndBlockInfo.studCategory} allocated successfully`);
    }
  }
  
  function AllocateSeniorStudent(
    stud,
    blockLocation,
    floorSelections,
    blockNum,
    currentBlockData
  ) {
    // Find the block index with the matching blockNum and location
    const blockIndex = currentBlockData.findIndex(
      (block) => block.blockNum === blockNum && block.location === blockLocation
    );
    if (blockIndex === -1) {
      console.warn(`Block ${blockNum} not found in ${blockLocation}`);
      return null;
    }
    const block = currentBlockData[blockIndex];
  
    // Look for a floor selection for this block (if any)
    const floorSelectionForBlock = floorSelections.find((fs) => fs.block === blockNum);
  
    // Create a flat list of dorms with extra info about their floor and index
    const allDorms = block.floors.flatMap((floor, floorIdx) =>
      floor.dorms.map((dorm, dormIdx) => ({
        ...dorm,
        floorIndex: floorIdx,
        originalDormIndex: dormIdx,
        floorNumber: floor.floorNumber,
      }))
    );
  
    // If a specific floor was selected, filter to dorms on that floor only
    const filteredDorms = floorSelectionForBlock
      ? allDorms.filter((d) => d.floorNumber === floorSelectionForBlock.floor)
      : allDorms;
  
    // Find the first available dorm (i.e. not full)
    const availableDorm = filteredDorms.find((d) => d.studentsAllocated < d.capacity);
    if (!availableDorm) {
      console.warn(`No available dorms in block ${blockNum}`);
      return null;
    }
  
    // Build the updated student allocation record
    const updatedStudent = {
      ...stud,
      block: block.blockNum, // use block id
      dorm: availableDorm.dorm_id || availableDorm.dormNumber, // use dorm id or number based on your schema
    };
  
    // Update only the affected block by incrementing the allocated count for the chosen dorm
    const updatedBlock = {
      ...block,
      floors: block.floors.map((floor, fIdx) => {
        if (fIdx === availableDorm.floorIndex) {
          return {
            ...floor,
            dorms: floor.dorms.map((dorm, dIdx) => {
              if (dIdx === availableDorm.originalDormIndex) {
                return {
                  ...dorm,
                  studentsAllocated: dorm.studentsAllocated + 1,
                };
              }
              return dorm;
            }),
          };
        }
        return floor;
      }),
    };
  
    return { updatedStudent, updatedBlock, blockIndex };
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
    const { BlockNumber: blockNumbers, FloorNumber: floorSelections } = studAndBlockInfo;
    const blockLocation =
      SelectedGender === "GenderMale" ? "maleArea" : "femaleArea";
  
    let allocationResult = null;
  
    // Iterate over each selected block in order
    for (const blockNum of blockNumbers) {
      // Find the block by blockNum and location
      const blockIndex = currentBlockData.findIndex(
        (block) => block.blockNum === blockNum && block.location === blockLocation
      );
      if (blockIndex === -1) {
        console.warn(`Block ${blockNum} not found in ${blockLocation}`);
        continue;
      }
      const block = currentBlockData[blockIndex];
       
      // Look for a floor selection specific to this block (if any)
      const floorSelectionForBlock = floorSelections.find(
        (fs) => fs.block === blockNum
      );
  
      // Flatten dorms from all floors in this block (keeping track of floor info)
      const allDorms = block.floors.flatMap((floor, floorIndex) =>
        floor.dorms.map((dorm, dormIndex) => ({
          ...dorm,
          floorIndex,
          originalDormIndex: dormIndex,
          floorNumber: floor.floorNumber,
        }))
      );
  
      // If a floor selection exists for this block, filter to that floor; otherwise, use all dorms.
      const filteredDorms = floorSelectionForBlock
        ? allDorms.filter((d) => d.floorNumber === floorSelectionForBlock.floor)
        : allDorms;
  
      // Find the first dorm with available capacity
      const availableDorm = filteredDorms.find(
        (d) => d.studentsAllocated < d.capacity
      );
      if (availableDorm) {
        allocationResult = {
          blockIndex,
          blockNum,
          ...availableDorm,
        };
        break; // Exit loop once a dorm is found
      }
    }
  
    if (!allocationResult) {
      console.warn("No available dorms in the selected blocks");
      return null;
    }
  
    const { blockIndex, floorIndex, originalDormIndex, dormNumber, blockNum } = allocationResult;
  
    // Create the updated student record
    const updatedStudent = {
      ...student,
      block: blockNum,
      dorm: dormNumber,
    };
  
    // Immutably update the currentBlockData: increment numberOfStudents in the chosen dorm
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
                      studentsAllocated: dorm.studentsAllocated + 1,
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
  
  // Fresh student allocation processing
  
  
  function freshStudentAllocation({selectedStudentGroup,SelectedGender}) {
     
     
    const unallocatedStudents = selectedStudentGroup.filter(
      (stud) => !allocatedStudents.some((a) => a.username === stud.username)
    );
  
    if (unallocatedStudents.length === 0) {
      toast.error("All students in this group are already allocated.");
      return;
    }
  
    const ArrangedStudent = OrderFreashStudent(selectedStudentGroup);
    console.log(ArrangedStudent, "ArrangedStudent");
    let currentBlockDataState = [...updatedBlockData];
    const newAllocatedStudents = [];
  
    for (const student of ArrangedStudent) {
      if (allocatedStudents.some((a) => a.username === stud.username)) {
        console.warn(`Student ${stud.id} already allocated, skipping.`);
        continue;
      }

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
       allocatedStudents(newAllocatedStudents)
       //allocatedStudents((prev) => [...prev, ...newAllocatedStudents]);
  if(newAllocatedStudents&&newAllocatedStudents.length>0){
    return toast.success(`Student ${studAndBlockInfo.studCategory} allocated successfully`)
  }
 
  }
 

  //Run allocation only when selectOption is "senior"
  useEffect(() => {

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
    if (selectOption === "senior") {
     seniorStudentAllocation({selectedStudentGroup,SelectedGender});
   
      // viewAllocatedStudent(allocatedStudents)

    } else if (selectOption === "fresh" || selectOption === "remedial") {
      freshStudentAllocation({selectedStudentGroup,SelectedGender});
      // viewAllocatedStudent(allocatedFreashStudents)
    }
   
  }, [selectOption, studAndBlockInfo]);

//   useEffect(()=>{ 
// dispatch(InsertAllocatedStudent(allocatedStudents))

//   },[allocatedStudents,selectOption ,studAndBlockInfo])
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
                  {stud.dorm} {stud.department} {stud.Stream}
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
              {allocatedStudents.map((stud, idx) => (
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
{/**
  
  const UpdatedBlock=block
    // Immutably update the block data structure:
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
                      studentsAllocated: dorm.studentsAllocated + 1,
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
    }); */}