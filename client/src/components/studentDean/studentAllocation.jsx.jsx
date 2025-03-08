import { BlockDemoData } from "@/config/data";
import { useSelector } from "react-redux";

export default function AllocationLast({ studAndBlockInfo }) {
  const { catagorizedStudentData, selectOption } = useSelector(
    (state) => state.Data
  );
 

  const blockData = BlockDemoData;
  // Updated IdentifyStudent function for proper parsing
  function IdentifyStudent({ studAndBlockInfo }) {
    const studentKey = studAndBlockInfo.studCategory;
    const parts = studentKey.split(" ");
    const stateKey = parts[0];

    // For non-regular students, gender is at parts[1]
    // For regular students, gender is at parts[2]
    let gender = stateKey === "regular" ? parts[2] : parts[1];
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
      // Determine the key based on gender
      StudCategory = gender === "male" ? "RegularMale" : "RegularFemale";
      // Map stream type to the correct key in the data structure
      Stream = streamType === "natural" ? "NaturalStream" : "SoctiaStream";
    }
    return { SelectedGender, StudCategory, Stream };
  }
  function getSameBatchAndDepartment({ student, selectedStudentGroup }) {
    const batch = student.batch;
    const department = student.department;
    const sameStudent = selectedStudentGroup.filter(
      (stud) => stud.batch === batch && stud.department === department
    );

    return sameStudent;
  }

  //   function seniorStudentAllocation() {
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
  //       return [];
  //     }

  //     const groupedStudents = [];
  //     const processedBatchDepartments = new Set(); // To track processed batch & department

  //     selectedStudentGroup.forEach(student => {
  //       const batchDepartmentKey = `${student.batch}-${student.department}`; // Create a unique key

  //       if (!processedBatchDepartments.has(batchDepartmentKey)) {
  //         const sameStudent = getSameBatchAndDepartment({ student, selectedStudentGroup });
  //         groupedStudents.push(sameStudent);
  //         processedBatchDepartments.add(batchDepartmentKey); // Mark as processed
  //       }
  //     });

  //   }

  function groupStudentsByBatchAndDepartment(selectedStudentGroup) {
    // Set to track processed batch-department combinations
    const processedBatchDepartments = new Set();
    // Array to collect groups of students
    const groupedStudents = [];

    selectedStudentGroup.forEach((student) => {
      // Create a unique key based on batch and department
      const batchDepartmentKey = `${student.batch}-${student.department}`;

      // If this group hasn't been processed yet, do it now
      if (!processedBatchDepartments.has(batchDepartmentKey)) {
        // Use the helper to get all students with the same batch and department
        let sameBatchDeptStudents = getSameBatchAndDepartment({
          student,
          selectedStudentGroup,
        });

        if (sameBatchDeptStudents.length > 0) {
          // Sort the group by Fname (case-insensitive)
          sameBatchDeptStudents.sort((a, b) => {
            const nameA = a.Fname ? a.Fname.toUpperCase() : "";
            const nameB = b.Fname ? b.Fname.toUpperCase() : "";
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
          });

          // Add this group to the collection
          groupedStudents.push(sameBatchDeptStudents);
          // Mark this batch-department as processed
          processedBatchDepartments.add(batchDepartmentKey);
        }
      }
    });

    return groupedStudents;
  }

  function seniorStudentAllocation() {
    const { SelectedGender, StudCategory, Stream } = IdentifyStudent({
      studAndBlockInfo,
    });
 
    const blockLocation =
          SelectedGender === "RegularMale" ? "boys_Campus" : "girls_Campus";
        const blockNumber = studAndBlockInfo.BlockNumber;
        const floorNumber = studAndBlockInfo.FloorNumber;
    
         
        const blockFound = blockData.find( // Capture the result of find
            (block) =>
              block.blockNum === blockNumber && block.location === blockLocation
            );
    
        console.log(blockFound, "blockFound"); // ADD THIS LINE - Log the result of find()
    
        const dorms = floorNumber !== null && floorNumber !== undefined
          ? blockFound?.dorms?.filter((dorm) => dorm.floorNumber === floorNumber) // Use blockFound here
          : blockFound?.dorms; // Use blockFound here
    
    
            console.log(dorms,"dorms");
        
    let selectedStudentGroup;
    if (StudCategory === "RegularMale" || StudCategory === "RegularFemale") {
      selectedStudentGroup =
        catagorizedStudentData[SelectedGender][StudCategory][Stream];
    } else {
      selectedStudentGroup =
        catagorizedStudentData[SelectedGender][StudCategory];
    }

    if (!selectedStudentGroup || selectedStudentGroup.length === 0) {
      return []; // Return empty array if no students in the category
    }

    const groupedStudent =
      groupStudentsByBatchAndDepartment(selectedStudentGroup);
    groupedStudent.forEach((oneGroup) =>
 
         oneGroup.forEach((stud) => {
 
  

    }));
  }

  function freshStudentAllocation() {
    // Placeholder content for fresh student allocation
    return <div>Fresh student allocation goes here</div>;
  }

  console.log(selectOption);

  return (
    <div>
      {selectOption === "senior"
        ? seniorStudentAllocation()
        : freshStudentAllocation()}
    </div>
  );
}
