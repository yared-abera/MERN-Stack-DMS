import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { GetAvaiableBlocks, UpdateBlock } from "@/store/blockSlice";
import {
  getAllocatedStudent,
  InsertAllocatedStudent,
} from "@/store/studentAllocation/allocateSlice";

export default function DefaultAllocation({ categorizedStudents }) {
  const { AvailebleBlocks } = useSelector((state) => state.block);
  const availableBlocksData = AvailebleBlocks.data;
  const dispatch = useDispatch();
  const [isAllocating, setIsAllocating] = useState(false);
  const [allocationComplete, setAllocationComplete] = useState(false);
  const { selectOption } = useSelector((state) => state.Data);
  console.log(selectOption, "selectOption");

  useEffect(() => {
    const allocateAllStudents = async () => {
      if (!availableBlocksData || availableBlocksData.length === 0) {
        toast.info("No available blocks found for allocation.");
        setIsAllocating(false);
        setAllocationComplete(true);
        return;
      }

      setIsAllocating(true);
      setAllocationComplete(false);
      console.log(
        "Starting allocation process with blocks:",
        availableBlocksData
      );

      try {
        let currentBlockState = JSON.parse(JSON.stringify(availableBlocksData));

        // --- Disabled Allocation ---
        if (
          categorizedStudents.GenderMale.disabled.length > 0 ||
          categorizedStudents.GenderFemale.disabled.length > 0
        ) {
           console.log("Starting Disabled Allocation...");
           // Function now handles its own toasts based on returned success flags
           currentBlockState = await allocateDisabledStudents(currentBlockState);
           console.log("Finished Disabled Allocation.");
        }

        // --- Special Allocation ---
        if (
          categorizedStudents.GenderMale.special.length > 0 ||
          categorizedStudents.GenderFemale.special.length > 0
        ) {
          console.log("Starting Special Allocation...");
          // Function now handles its own toasts
          currentBlockState = await allocateSpecialStudents(currentBlockState);
           console.log("Finished Special Allocation.");
        }

        // --- Regular Allocation ---
        if (
          categorizedStudents.GenderMale.RegularMale.NaturalStream.length > 0 ||
          categorizedStudents.GenderMale.RegularMale.SocialStream.length > 0 ||
          categorizedStudents.GenderFemale.RegularFemale.NaturalStream.length >
            0 ||
          categorizedStudents.GenderFemale.RegularFemale.SocialStream.length > 0
        ) {
          console.log("Starting Regular Allocation...");
          // Function now handles its own toasts
          currentBlockState = await allocateRegularStudents(currentBlockState);
          console.log("Finished Regular Allocation.");
        }
      } catch (error) {
        toast.error(`Allocation process failed unexpectedly: ${error.message}`);
        console.error("Allocation Error:", error);
      } finally {
        setIsAllocating(false);
        setAllocationComplete(true);
        dispatch(GetAvaiableBlocks());
        dispatch(getAllocatedStudent());
        console.log("Allocation process finished.");
      }
    };

    if (
      availableBlocksData &&
      categorizedStudents &&
      !isAllocating &&
      !allocationComplete
    ) {
      allocateAllStudents();
    }
  }, [
    availableBlocksData,
    categorizedStudents,
    dispatch,
    isAllocating,
    allocationComplete,
  ]);

  // ------------------ Allocation Helpers ------------------

  // (Helper) Allocates a single student to a block - LOGIC REMAINS THE SAME
  const allocateStudentToBlockLogic = (student, block) => {
    if (!block || !Array.isArray(block.floors)) {
      console.warn(`Block ${block?.blockNum} has invalid floor structure.`);
      return null;
    }
    let availableDormInfo = null;
    for (let floorIdx = 0; floorIdx < block.floors.length; floorIdx++) {
      const floor = block.floors[floorIdx];
      if (!Array.isArray(floor.dorms)) {
        console.warn(
          `Block ${block.blockNum}, Floor ${floor.floorNumber} has invalid dorm structure.`
        );
        continue;
      }
      for (let dormIdx = 0; dormIdx < floor.dorms.length; dormIdx++) {
        const dorm = floor.dorms[dormIdx];
        // Ensure numeric comparison
        const currentAllocated = Number(dorm.studentsAllocated) || 0;
        const capacity = Number(dorm.capacity) || 0;
        if (currentAllocated < capacity) {
          availableDormInfo = {
            ...dorm,
            floorIndex: floorIdx,
            originalDormIndex: dormIdx,
            floorNumber: floor.floorNumber,
          };
          break;
        }
      }
      if (availableDormInfo) break;
    }

    if (!availableDormInfo) {
      return null;
    }
    const updatedStudent = {
      /* ... same */ ...student,
      block: block.blockNum,
      dorm: availableDormInfo.dormNumber,
    };
    const updatedBlock = {
      /* ... same, includes totalAvailable decrement */ ...block,
      totalAvailable:
        (block.totalAvailable || 0) > 0 ? block.totalAvailable - 1 : 0,
      floors: block.floors.map((floor, fIdx) => {
        if (fIdx === availableDormInfo.floorIndex) {
          return {
            ...floor,
            dorms: floor.dorms.map((dorm, dIdx) => {
              if (dIdx === availableDormInfo.originalDormIndex) {
                const currentAllocated = Number(dorm.studentsAllocated) || 0;
                if (currentAllocated >= dorm.capacity) {
                  console.error(
                    `CRITICAL: Attempted to overfill dorm ${dorm.dormNumber} in block ${block.blockNum}. Capacity: ${dorm.capacity}, Already Allocated: ${currentAllocated}`
                  );
                  return dorm;
                }
                return { ...dorm, studentsAllocated: currentAllocated + 1 };
              }
              return dorm;
            }),
          };
        }
        return floor;
      }),
    };
    return { updatedStudent, updatedBlock };
  };

  // Allocates a category. Returns { success: boolean, updatedBlocks: Block[] }
  // *** REMOVED TOASTS FROM HERE ***

  // Allocates disabled students. Returns { success: boolean, updatedBlocks: Block[] }
  // *** REMOVED TOASTS FROM HERE ***
  const allocateGenderDisabled = async (
    students,
    area,
    genderName,
    currentBlockState
  ) => {
    // Base case: No students means success
    if (!students || students.length === 0)
      return { success: true, updatedBlocks: currentBlockState };

    console.log(`Allocating Disabled ${genderName} in ${area}...`);
    let allAllocationsSuccessful = true; // Assume success for this batch
    const sortedStudents = [...students].sort((a, b) =>
      a.Fname.localeCompare(b.Fname)
    );
    let blocksToProcess = JSON.parse(JSON.stringify(currentBlockState));

    for (const stud of sortedStudents) {
      let allocated = false;
      const candidateBlocksIndices = blocksToProcess
        .map((block, index) => ({ block, index }))
        .filter(
          ({ block }) =>
            block.location === area &&
            block.totalAvailable > 0 &&
            Array.isArray(block.floors) &&
            block.floors.some(
              (floor) =>
                floor.floorNumber === 1 &&
                Array.isArray(floor.dorms) &&
                floor.dorms.some(
                  (dorm) =>
                    (Number(dorm.studentsAllocated) || 0) <
                    (Number(dorm.capacity) || 0)
                )
            )
        )
        .sort((a, b) => {
          /* ... same sorting logic ... */
          const aIsSpecial =
            a.block.isSelectedForSpecial || a.block.isForSpecialNeed;
          const bIsSpecial =
            b.block.isSelectedForSpecial || b.block.isForSpecialNeed;
          if (aIsSpecial && !bIsSpecial) return -1;
          if (!aIsSpecial && bIsSpecial) return 1;
          return a.block.blockNum - b.block.blockNum;
        });

      for (const {
        block: candidateBlock,
        index: blockIndex,
      } of candidateBlocksIndices) {
        const firstFloorIndex = candidateBlock.floors.findIndex(
          (f) => f.floorNumber === 1
        );
        if (firstFloorIndex === -1) continue;
        const firstFloor = candidateBlock.floors[firstFloorIndex];

        let availableDormInfo = null;
        let originalDormIndex = -1;
        if (Array.isArray(firstFloor.dorms)) {
          for (let dIdx = 0; dIdx < firstFloor.dorms.length; dIdx++) {
            const dorm = firstFloor.dorms[dIdx];
            if (
              (Number(dorm.studentsAllocated) || 0) <
              (Number(dorm.capacity) || 0)
            ) {
              availableDormInfo = dorm;
              originalDormIndex = dIdx;
              break;
            }
          }
        }
        if (!availableDormInfo) continue;

        const updatedStudent = {
          /* ... same */ ...stud,
          block: candidateBlock.blockNum,
          dorm: availableDormInfo.dormNumber,
        };
        const currentAllocated =
          Number(availableDormInfo.studentsAllocated) || 0;
        if (currentAllocated >= availableDormInfo.capacity) {
          /* ... error check ... */
          console.error(
            `CRITICAL (Disabled): Attempted to overfill dorm ${availableDormInfo.dormNumber} in block ${candidateBlock.blockNum}.`
          );
          continue;
        }
        const updatedBlock = {
          /* ... same */ ...candidateBlock,
          totalAvailable:
            (candidateBlock.totalAvailable || 0) > 0
              ? candidateBlock.totalAvailable - 1
              : 0,
          floors: candidateBlock.floors.map((floor, fIdx) => {
            /* ... same */
            if (fIdx === firstFloorIndex) {
              return {
                ...floor,
                dorms: floor.dorms.map((dorm, dIdx) =>
                  dIdx === originalDormIndex
                    ? { ...dorm, studentsAllocated: currentAllocated + 1 }
                    : dorm
                ),
              };
            }
            return floor;
          }),
        };

        try {
          const insertResult = await dispatch(
            InsertAllocatedStudent({ updatedStudent })
          );
          if (!insertResult.payload?.success) {
            console.error(
              `Failed to save allocation for disabled student ${stud.Fname}: ${insertResult.payload?.message}`
            );
            allAllocationsSuccessful = false;
            break;
          }
          const updateResult = await dispatch(UpdateBlock({ updatedBlock }));
          if (!updateResult.payload?.success) {
            console.error(
              `Failed to update block ${updatedBlock.blockNum} state in DB after allocating disabled ${stud.Fname}.`
            );
            allAllocationsSuccessful = false;
          }
          // --- Crucial: Update local state ---
          blocksToProcess[blockIndex] = updatedBlock;
          allocated = true;
          break; // Move to next student
        } catch (error) {
          console.error(
            `Error during allocation dispatch for disabled ${stud.Fname}: ${error.message}`
          );
          allAllocationsSuccessful = false;
          allocated = false;
          break;
        }
      } // End block loop

      if (!allocated) {
        console.warn(
          `Could not allocate disabled student ${stud.Fname} (${genderName}, ${area})`
        );
        allAllocationsSuccessful = false; // Mark batch failure
      }
    } // End student loop

    console.log(
      `Finished allocating Disabled ${genderName} in ${area}. Success: ${allAllocationsSuccessful}`
    );
    // Return success status for the batch and the updated block state
    return {
      success: allAllocationsSuccessful,
      updatedBlocks: blocksToProcess,
    };
  };
  const allocateCategory = async (
    students,
    area,
    streamType,
    currentBlockState
  ) => {
    // Base case: No students means success, return state unchanged
    if (!students || students.length === 0)
      return { success: true, updatedBlocks: currentBlockState };

    console.log(`Allocating ${streamType} in ${area}...`);
    let allAllocationsSuccessful = true; // Assume success for this batch
    const sortedStudents = [...students].sort((a, b) =>
      a.Fname.localeCompare(b.Fname)
    );
    let blocksToProcess = JSON.parse(JSON.stringify(currentBlockState)); // Deep copy

    for (const student of sortedStudents) {
      let allocated = false;
      const candidateBlocksIndices = blocksToProcess
        .map((block, index) => ({ block, index }))
        .filter(
          ({ block }) => block.location === area && block.totalAvailable > 0
        )
        .sort((a, b) => a.block.blockNum - b.block.blockNum);

      for (const {
        block: candidateBlock,
        index: blockIndex,
      } of candidateBlocksIndices) {
        if (candidateBlock.totalAvailable <= 0) continue;

        const allocationResult = allocateStudentToBlockLogic(
          student,
          candidateBlock
        );
        if (!allocationResult) continue;

        const { updatedStudent, updatedBlock } = allocationResult;

        try {
          const insertResult = await dispatch(
            InsertAllocatedStudent({ updatedStudent })
          );
          if (!insertResult.payload?.success) {
            // Don't toast here, just mark failure for the batch
            console.error(
              `Failed to save allocation for ${student.Fname}: ${insertResult.payload?.message}`
            );
            allAllocationsSuccessful = false;
            break; // Stop trying blocks for this student on DB failure
          }

          const updateResult = await dispatch(UpdateBlock({ updatedBlock }));
          if (!updateResult.payload?.success) {
            console.error(
              `Failed to update block ${updatedBlock.blockNum} state in DB after allocating ${student.Fname}. Potential inconsistency.`
            );
            allAllocationsSuccessful = false; // Mark batch as potentially failed/inconsistent
          }

          // --- Crucial: Update local state immediately ---
          blocksToProcess[blockIndex] = updatedBlock;
          allocated = true;
          break; // Move to next student
        } catch (error) {
          console.error(
            `Error during allocation dispatch for ${student.Fname}: ${error.message}`
          );
          allAllocationsSuccessful = false; // Mark batch failure
          allocated = false;
          break; // Stop trying blocks
        }
      } // End block loop

      if (!allocated) {
        console.warn(
          `Could not allocate student ${student.Fname} (${streamType}, ${area})`
        );
        allAllocationsSuccessful = false; // Mark batch failure if *any* student fails
      }
    } // End student loop

    console.log(
      `Finished allocating ${streamType} in ${area}. Success: ${allAllocationsSuccessful}`
    );
    // Return success status for the batch and the updated block state
    return {
      success: allAllocationsSuccessful,
      updatedBlocks: blocksToProcess,
    };
  };

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

  const allocateSeniorStudents = async (
    students,
    area,
    streamName,
    genderName,
    currentBlockState
  ) => {
    if (!students || students.length === 0)
      return { success: true, updatedBlocks: currentBlockState };

    let allAllocationsSuccessful = true;
    const groupedStudents = groupStudentsByBatchAndDepartment(students);
    let blocksToProcess = JSON.parse(JSON.stringify(currentBlockState));

    for (const group of groupedStudents) {
      for (const student of group) {
        let allocated = false;
        const candidateBlocksIndices = blocksToProcess
          .map((block, index) => ({ block, index }))
          .filter(
            ({ block }) => block.location === area && block.totalAvailable > 0
          )
          .sort((a, b) => a.block.blockNum - b.block.blockNum);

        for (const {
          block: candidateBlock,
          index: blockIndex,
        } of candidateBlocksIndices) {
          if (candidateBlock.totalAvailable <= 0) continue;

          const allocationResult = allocateStudentToBlockLogic(
            student,
            candidateBlock
          );
          if (!allocationResult) continue;

          const { updatedStudent, updatedBlock } = allocationResult;

          try {
            const insertResult = await dispatch(
              InsertAllocatedStudent({ updatedStudent })
            );
            if (!insertResult.payload?.success) {
              console.error(
                `Failed to save allocation for ${student.Fname}: ${insertResult.payload?.message}`
              );
              allAllocationsSuccessful = false;
              break;
            }

            const updateResult = await dispatch(UpdateBlock({ updatedBlock }));
            if (!updateResult.payload?.success) {
              console.error(
                `Failed to update block ${updatedBlock.blockNum} state in DB after allocating ${student.Fname}.`
              );
              allAllocationsSuccessful = false;
            }

            blocksToProcess[blockIndex] = updatedBlock;
            allocated = true;
            break;
          } catch (error) {
            console.error(
              `Error during allocation dispatch for ${student.Fname}: ${error.message}`
            );
            allAllocationsSuccessful = false;
            allocated = false;
            break;
          }
        }

        if (!allocated) {
          console.warn(
            `Could not allocate student ${student.Fname} (${streamName}, ${area})`
          );
          allAllocationsSuccessful = false;
        }
      }
    }

    console.log(
      `Finished allocating ${streamName} in ${area}. Success: ${allAllocationsSuccessful}`
    );
    return {
      success: allAllocationsSuccessful,
      updatedBlocks: blocksToProcess,
    };
  };
  // ------------------ Allocation Flows (with Toasts) ------------------

  // *** ADDED TOASTS BACK HERE, BASED ON RETURNED SUCCESS ***
  const allocateSpecialStudents = async (currentBlockState) => {
    let currentState = currentBlockState;
    const genderMaleStudents = categorizedStudents.GenderMale.special;
    const genderFemaleStudents = categorizedStudents.GenderFemale.special;

    // Male Special
    if (genderMaleStudents?.length > 0) {
      const { success: maleSuccess, updatedBlocks: stateAfterMale } =
        await allocateCategory(
          genderMaleStudents,
          "maleArea",
          "Special Male",
          currentState
        );
      if (maleSuccess) {
        toast.success("All male special students allocated successfully.");
      } else {
        toast.error("Some male special students could not be allocated.");
      }
      currentState = stateAfterMale; // Update state for the next step
    }

    // Female Special
    if (genderFemaleStudents?.length > 0) {
      const { success: femaleSuccess, updatedBlocks: stateAfterFemale } =
        await allocateCategory(
          genderFemaleStudents,
          "femaleArea",
          "Special Female",
          currentState // Use updated state
        );
      if (femaleSuccess) {
        toast.success("All female special students allocated successfully.");
      } else {
        toast.error("Some female special students could not be allocated.");
      }
      currentState = stateAfterFemale; // Update state
    }

    return currentState; // Return the final state after both genders
  };

  // *** ADDED TOASTS BACK HERE, BASED ON RETURNED SUCCESS ***
  const allocateRegularStudents = async (currentBlockState) => {
    let currentState = currentBlockState;

    // Helper to process one gender/stream combination
    const processStream = async (students, area, streamName, genderName) => {
      if (!students || students.length === 0) return; // Skip if no students
      if (selectOption !== "senior") {
        const { success, updatedBlocks } = await allocateCategory(
          students,
          area,
          `Regular ${genderName} ${streamName}`,
          currentState
        );
        const toastMsg = `Regular ${genderName} ${streamName} Stream students`;
        if (success) {
          toast.success(`All ${toastMsg} allocated successfully.`);
        } else {
          toast.error(`Some ${toastMsg} could not be allocated.`);
        }
        currentState = updatedBlocks; // IMPORTANT: Update state for the *next* call
      }
      // In the processStream function, correct the else clause:
      else {
        const { success, updatedBlocks } = await allocateSeniorStudents(
          students,
          area,
          streamName,
          genderName,
          currentState
        );
        const toastMsg = `Regular ${genderName} ${streamName} Stream students`;
        if (success) {
          toast.success(`All ${toastMsg} allocated successfully.`);
        } else {
          toast.error(`Some ${toastMsg} could not be allocated.`);
        }
        currentState = updatedBlocks;
      }

      // In the allocateSeniorStudents function, fix the console.log statement:
      console.log(
        `Finished allocating ${streamName} in ${area}. All Regular ${genderName} ${streamName} Stream students allocated successfully.`
      );
    };

    // Process Male Streams
    const maleRegulars = categorizedStudents.GenderMale.RegularMale;
    if (maleRegulars) {
      await processStream(
        maleRegulars.NaturalStream,
        "maleArea",
        "Natural",
        "Male"
      );
      await processStream(
        maleRegulars.SocialStream,
        "maleArea",
        "Social",
        "Male"
      );
    }

    // Process Female Streams (using state potentially updated by male allocations)
    const femaleRegulars = categorizedStudents.GenderFemale.RegularFemale;
    if (femaleRegulars) {
      await processStream(
        femaleRegulars.NaturalStream,
        "femaleArea",
        "Natural",
        "Female"
      );
      await processStream(
        femaleRegulars.SocialStream,
        "femaleArea",
        "Social",
        "Female"
      );
    }

    return currentState; // Return the final state after all regular allocations
  };

  // *** ADDED TOASTS BACK HERE, BASED ON RETURNED SUCCESS ***
  const allocateDisabledStudents = async (currentBlockState) => {
    let currentState = currentBlockState;
    const maleDisabledStudents = categorizedStudents.GenderMale.disabled;
    const femaleDisabledStudents = categorizedStudents.GenderFemale.disabled;

    // Male Disabled
    if (maleDisabledStudents?.length > 0) {
      const { success: maleSuccess, updatedBlocks: stateAfterMale } =
        await allocateGenderDisabled(
          maleDisabledStudents,
          "maleArea",
          "Male",
          currentState
        );
      if (maleSuccess) {
        toast.success("All male disabled students allocated successfully.");
      } else {
        toast.error("Some male disabled students could not be allocated.");
      }
      currentState = stateAfterMale; // Update state
    }

    // Female Disabled
    if (femaleDisabledStudents?.length > 0) {
      const { success: femaleSuccess, updatedBlocks: stateAfterFemale } =
        await allocateGenderDisabled(
          femaleDisabledStudents,
          "femaleArea",
          "Female",
          currentState // Use updated state
        );
      if (femaleSuccess) {
        toast.success("All female disabled students allocated successfully.");
      } else {
        toast.error("Some female disabled students could not be allocated.");
      }
      currentState = stateAfterFemale; // Update state
    }

    return currentState; // Return the final state
  };

  // --- Render --- (No changes needed in render)
  return (
    <div className="bg-sky-200/55 rounded-md p-4 h-max mt-3">
      <h1 className="text-xl font-semibold mb-4">Student Allocation Status</h1>

      {isAllocating && (
        <div className="flex items-center justify-center space-x-3 p-4 my-4 border border-blue-300 bg-blue-50 rounded-md">
          <svg
            className="animate-spin h-6 w-6 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-lg font-medium text-blue-700">
            Allocating students, please wait...
          </p>
        </div>
      )}

      {!isAllocating && allocationComplete && (
        <div className="p-4 my-4 border border-green-300 bg-green-50 rounded-md">
          <p className="text-lg font-medium text-green-700">
            Allocation process commpleted.
          </p>
        </div>
      )}

      {!isAllocating &&
        allocationComplete &&
        (!availableBlocksData || availableBlocksData.length === 0) && (
          <div className="p-4 my-4 border border-yellow-300 bg-yellow-50 rounded-md">
            <p className="text-lg font-medium text-yellow-700">
              Allocation could not proceed: No available blocks were found.
            </p>
          </div>
        )}
    </div>
  );
}
