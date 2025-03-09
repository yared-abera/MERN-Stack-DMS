import React, { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export const BlockDemoData = [
  {
    blockNum: 1,
    location: "boys_Campus",
    totalCapacity: 300,
    availableRoom: 50,
    isFull: false,
    floors: [
      {
        floorNumber: 1,
        floorStatus: "Available",
        floorCapacity: 100
      },
      {
        floorNumber: 2,
        floorStatus: "Available",
        floorCapacity: 100
      },
      {
        floorNumber: 3,
        floorStatus: "Available",
        floorCapacity: 100
      }
    ],
    dorms: [
      {
        dormNumber: 101,
        capacity: 4,
        dormStatus: "Available"
      },
      {
        dormNumber: 102,
        capacity: 4,
        dormStatus: "Available"
      },
      {
        dormNumber: 103,
        capacity: 2,
        dormStatus: "Available"
      },
        {
        dormNumber: 201,
        capacity: 4,
        dormStatus: "Available"
      },
      {
        dormNumber: 202,
        capacity: 4,
        dormStatus: "Available"
      },
      {
        dormNumber: 203,
        capacity: 2,
        dormStatus: "available"
      },
        {
        dormNumber: 301,
        capacity: 4,
        dormStatus: "Available"
      },
      {
        dormNumber: 302,
        capacity: 4,
        dormStatus: "Available"
      },
      {
        dormNumber: 303,
        capacity: 2,
        dormStatus: "Available"
      }
    ],
    isSelectedForImparied: true,
    isSelectedForSpecial: true,
    description: "Block A - for general students"
  },
  {
    blockNum: 2,
    location: "girls_Campus",
    totalCapacity: 200,
    availableRoom: 100,
    isFull: false,
    floors: [
      {
        floorNumber: 1,
        floorStatus: "Available",
        floorCapacity: 100
      },
      {
        floorNumber: 2,
        floorStatus: "Available",
        floorCapacity: 100
      }
    ],
    dorms: [
      {
        dormNumber: 1,
        capacity: 2,
        dormStatus: "available"
      },
      {
        dormNumber: 2,
        capacity: 2,
        dormStatus: "available"
      },
      {
        dormNumber: 3,
        capacity: 4,
        dormStatus: "Available"
      },
       {
        dormNumber: 4,
        capacity: 4,
        dormStatus: "Available"
      }
    ],
    isSelectedForImpaired: false,
    isSelectedForSpecial: false,
    description: "Block B - for special program students"
  },
    {
    blockNum: 3,
    location: "boys_Campus",
    totalCapacity: 150,
    availableRoom: 10,
    isFull: true,
    floors: [
      {
        floorNumber: 1,
        floorStatus: "Available",
        floorCapacity: 75
      },
      {
        floorNumber: 2,
        floorStatus: "Available",
        floorCapacity: 75
      },
    ],
    dorms: [
      {
        dormNumber: 1,
        capacity: 3,
        dormStatus: "Available"
      },
      {
        dormNumber: 2,
        capacity: 3,
        dormStatus: "Available"
      },
      {
        dormNumber: 3,
        capacity: 3,
        dormStatus: "Available"
      }
    ],
    isSelectedForImparied: false,
    isSelectedForSpecial: false,
    description: "Block C - for female students"
  }
];

export default function AllocationComponent({ categorizedStudents }) {
  // Function to allocate students to dorms based on gender, special status, and impairment
 const allocateStudents = (students, blocks) => {
  const allocations = [];

  students.forEach((student) => {
    let allocated = false;

    // Determine the student's gender, special status, and impairment
    const isFemale = student.sex?.toUpperCase() === "FEMALE";
    const isSpecial = student.isSpecial?.toUpperCase() === "YES";
    const isImpaired = student.isDisable?.toUpperCase() === "YES";

    // Filter blocks based on gender and special status
    const eligibleBlocks = blocks.filter((block) => {
      // Gender matching: male students go to boys_Campus, female students go to girls_Campus
      const isGenderMatch =
        (isFemale && block.location === "girls_Campus") ||
        (!isFemale && block.location === "boys_Campus");

      // Special students can only be allocated to blocks marked for special students
      const isSpecialMatch = isSpecial ? block.isSelectedForSpecial : true;

      return isGenderMatch && isSpecialMatch;
    });

    // Iterate through eligible blocks to find available dorms
    for (const block of eligibleBlocks) {
      if (block.isFull) continue;

      for (const floor of block.floors) {
        // If the student is impaired, allocate to the first floor
        if (isImpaired && floor.floorNumber !== 1) continue;

        for (const dorm of block.dorms) {
          // Check dorm status (case-insensitive) and capacity
          if (
            dorm.dormStatus.toLowerCase() === "available" &&
            dorm.capacity > 0
          ) {
            // Allocate student to dorm
            allocations.push({
              student,
              block: block.blockNum,
              floor: floor.floorNumber,
              dorm: dorm.dormNumber,
            });

            // Update dorm capacity and status
            dorm.capacity -= 1;
            if (dorm.capacity === 0) {
              dorm.dormStatus = "Full";
            }

            allocated = true;
            break;
          }
        }
        if (allocated) break;
      }
      if (allocated) break;
    }

    if (!allocated) {
      // If no dorm is available, mark as unallocated
      allocations.push({
        student,
        block: "Unallocated",
        floor: "N/A",
        dorm: "N/A",
      });
    }
  });

  return allocations;
};

  // Allocate students based on categories
  const allocatedStudents = useMemo(() => {
    const students = [
      ...categorizedStudents.GenderMale.RegularMale.NaturalStream,
      ...categorizedStudents.GenderMale.RegularMale.SoctiaStream,
      ...categorizedStudents.GenderMale.disabled,
      ...categorizedStudents.GenderMale.special,
      ...categorizedStudents.GenderFemale.RegularFemale.NaturalStream,
      ...categorizedStudents.GenderFemale.RegularFemale.SoctiaStream,
      ...categorizedStudents.GenderFemale.disabled,
      ...categorizedStudents.GenderFemale.special,
    ];

    return allocateStudents(students, BlockDemoData);
  }, [categorizedStudents]);

  return (
    <div className="w-full p-6">
      <h2 className="text-center text-xl font-bold mb-4">Student Allocation to Dorms</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stream</TableHead>
            <TableHead>Block</TableHead>
            <TableHead>Floor</TableHead>
            <TableHead>Dorm</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allocatedStudents.map((allocation, index) => (
            <TableRow key={index}>
              <TableCell>{allocation.student.Fname} {allocation.student.Lname}</TableCell>
              <TableCell>{allocation.student.sex}</TableCell>
              <TableCell>
                {allocation.student.isDisable === "YES"
                  ? "Disabled"
                  : allocation.student.isSpecial === "YES"
                  ? "Special"
                  : "Regular"}
              </TableCell>
              <TableCell>{allocation.student.stream}</TableCell>
              <TableCell>{allocation.block}</TableCell>
              <TableCell>{allocation.floor}</TableCell>
              <TableCell>{allocation.dorm}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}