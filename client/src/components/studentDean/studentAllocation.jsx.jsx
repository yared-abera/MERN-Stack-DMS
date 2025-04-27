import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "sonner";
import {
  getAllocatedStudent,
  InsertAllocatedStudent,
} from "@/store/studentAllocation/allocateSlice";
import { GetAvaiableBlocks, UpdateBlock } from "@/store/blockSlice";
import { SelectedStudentData } from "@/store/common/data";

export default function AllocationLast({ studAndBlockInfo }) {
  const { catagorizedStudentData, selectOption } = useSelector(
    (state) => state.Data
  );
  const { AvailebleBlocks } = useSelector((state) => state.block);

  // State for block data and allocated students
  const [updatedBlockData, setUpdatedBlockData] = useState(
    AvailebleBlocks.data
  );
  const [allocatedStudents, setAllocatedStudents] = useState([]);
 
  const dispatch = useDispatch();
  console.log(selectOption,'selectOption')

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
    console.log(selectedStudentGroup, "selectedStudentGroup");

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
      console.log(groups, "groups");
    });
    return groups;
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
    const floorSelectionForBlock = floorSelections.find(
      (fs) => fs.block === blockNum
    );

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

    const availableDorm = filteredDorms.find(
      (d) => d.studentsAllocated < d.capacity&&d.dormStatus==='Available'
    );
    if (!availableDorm) {
      console.warn(`No available dorms in block ${blockNum}`);
      return null;
    }

    // Build the updated student allocation record
    const updatedStudent = {
      ...stud,
      block: block.blockNum, // use block id
      dorm: availableDorm.dormNumber, // use dorm id or number based on your schema
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

 

  async function seniorStudentAllocation({
    selectedStudentGroup,
    SelectedGender,
  }) {
    const groups = groupStudentsByBatchAndDepartment(selectedStudentGroup);
    let currentBlockDataState = [...updatedBlockData];
    const newAllocatedStudents = [];
  
    const blockLocation = SelectedGender === "GenderMale" ? "maleArea" : "femaleArea";
    const { BlockNumber: blockNumbers, FloorNumber: floorSelections } = studAndBlockInfo;
  
    let allAllocationsSuccessful = true;
  
    // Process groups sequentially
    for (const group of groups) {
      // Process students sequentially within group
      for (const stud of group) {
        let allocated = false;
  
        // Try blocks in order until successful
        for (const blockNum of blockNumbers) {
          const allocationResult = AllocateSeniorStudent(
            stud,
            blockLocation,
            floorSelections,
            blockNum,
            currentBlockDataState
          );
        
          if (!allocationResult) continue;
          
            
            const { updatedStudent, updatedBlock, blockIndex } = allocationResult;
         
         
          try {
          
  
            // Wait for block update to complete
            const updateResult = await dispatch(UpdateBlock({ updatedBlock }));
            
            if (!updateResult.payload?.success) { // Fixed typo: 'sucess' -> 'success'
              allAllocationsSuccessful = false;
              toast.error(`Block update failed for ${updatedStudent.Fname}`);
              continue; // Try next block
            }
            else{

                 // Wait for insertion to complete
                 const insertResult = await dispatch(InsertAllocatedStudent({ updatedStudent }));
            
                 if (!insertResult.payload?.success) {
                   allAllocationsSuccessful = false;
                   toast.error(`${updatedStudent.Fname} ${updatedStudent.userName} ${insertResult.payload?.message}`);
                   continue; // Try next block
                 }
     

            }


           
            // Update local state only after successful backend updates
            currentBlockDataState[blockIndex] = updatedBlock;
            newAllocatedStudents.push(updatedStudent);
            dispatch(getAllocatedStudent());
            dispatch(GetAvaiableBlocks()); // Fixed typo: 'GetAvaiableBlocks'
  
            allocated = true;
            break; // Exit block loop on success
          } catch (error) { 
            allAllocationsSuccessful = false;
            toast.error(`Error allocating ${updatedStudent.Fname}: ${error.message}`);
          }
        }
  
        if (!allocated) {
          allAllocationsSuccessful = false;
          console.warn(`Allocation failed for: ${stud.Fname} ${stud.Lname}`);
        }
      }
    }
  
    // Update state after all allocations
    setUpdatedBlockData(currentBlockDataState);
    setAllocatedStudents(newAllocatedStudents);
  
    if (allAllocationsSuccessful) {
      toast.success(`All students in ${studAndBlockInfo.studCategory} allocated successfully`);
    }
  }

  function orderFreshStudent(selectedStudentGroup) {
    return [...selectedStudentGroup].sort((a, b) =>
      (a.Fname || "").toUpperCase().localeCompare((b.Fname || "").toUpperCase())
    );
  }

  function allocateFreshStudent(
    student,
    blockLocation,
    floorSelections,
    blockNum,
    currentBlockDataState
  ) {
    // Find the block by blockNum and location
    const blockIndex = currentBlockDataState.findIndex(
      (block) => block.blockNum === blockNum && block.location === blockLocation
    );
    if (blockIndex === -1) {
      console.warn(`Block ${blockNum} not found in ${blockLocation}`);
      return null;
    }
    const block = currentBlockDataState[blockIndex];

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
      (d) => d.studentsAllocated < d.capacity&&d.dormStatus==='Available'
    );
    if (!availableDorm) {
      console.warn("No available dorms in the selected block");
      return null;
    }

    // Prepare the allocation result including block index
    const allocationResult = {
      blockIndex,
      blockNum,
      ...availableDorm,
    };

    // Create the updated student record
    const updatedStudent = {
      ...student,
      block: blockNum,
      dorm: availableDorm.dormNumber,
    };

    // Immutably update the current block data: increment studentsAllocated in the chosen dorm
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
  async function freshStudentAllocation({
    selectedStudentGroup,
    SelectedGender,
  }) {
    const arrangedStudents = orderFreshStudent(selectedStudentGroup);
    let currentBlockDataState = [...updatedBlockData];
    const newAllocatedStudents = [];
    
    const { BlockNumber: blockNumbers, FloorNumber: floorSelections } = studAndBlockInfo;
    const blockLocation = SelectedGender === "GenderMale" ? "maleArea" : "femaleArea";
    let allAllocationsSuccessful = true;
  
    try {
      // Process students sequentially
      for (const student of arrangedStudents) {
        let allocated = false;
        
        // Try blocks in order until successful
        for (const blockNum of blockNumbers) {
          const allocation = allocateFreshStudent(
            student,
            blockLocation,
            floorSelections,
            blockNum,
            currentBlockDataState
          );
  
          if (!allocation) continue;
  
          const { updatedStudent, updatedBlock, blockIndex } = allocation;
          
          try {
            // Wait for insertion to complete
            const insertResult = await dispatch(InsertAllocatedStudent({ updatedStudent }));
            
            if (!insertResult.payload?.success) {
              allAllocationsSuccessful = false;
              toast.error(`${updatedStudent.Fname} ${updatedStudent.userName} ${insertResult.payload?.message}`);
              continue; // Try next block
            }
  
            // Wait for block update to complete
            const updateResult = await dispatch(UpdateBlock({ updatedBlock }));
            
            if (!updateResult.payload?.success) {
              allAllocationsSuccessful = false;
              toast.error(`Block update failed for ${updatedStudent.Fname}`);
              continue; // Try next block
            }
  
            // Update local state only after successful backend operations
            currentBlockDataState[blockIndex] = updatedBlock;
            newAllocatedStudents.push(updatedStudent);
            dispatch(getAllocatedStudent());
            dispatch(GetAvaiableBlocks()); // Fixed typo
  
            allocated = true;
            break; // Exit block loop on success
          } catch (error) {
            allAllocationsSuccessful = false;
            toast.error(`Error allocating ${student.Fname}: ${error.message}`);
          }
        }
  
        if (!allocated) {
          allAllocationsSuccessful = false;
          console.warn(`Allocation failed for: ${student.Fname} ${student.Lname}`);
        }
      }
    } finally {
      // Update state after all operations
      setUpdatedBlockData(currentBlockDataState);
      setAllocatedStudents(newAllocatedStudents);
    }
  
    if (allAllocationsSuccessful) {
      toast.success(`All students allocated successfully`);
    }  
  }

 
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
      seniorStudentAllocation({ selectedStudentGroup, SelectedGender });
 
    } else if (selectOption === "fresh" || selectOption === "remedial") {
      freshStudentAllocation({ selectedStudentGroup, SelectedGender });
       
    }

    dispatch(SelectedStudentData(selectedStudentGroup))
 
    
  }, [selectOption, studAndBlockInfo]);
}
