import { useEffect, useMemo, useRef, useState } from "react";
import { Label } from "../ui/label";

import {
  AllocationTabscategories,
  blockData,
  BlockDemoData,
} from "@/config/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectValue } from "@radix-ui/react-select";
const initialOption = {
  key: "",
  label: "",
};
export default function AllocationPage({ dataFormat, isNotGust }) {
  const [categorizedStudents, setCategorizedStudents] = useState({
    GenderMale: {
      RegularMale: { NaturalStream: [], SoctiaStream: [] },
      disabled: [],
      special: [],
    },
    GenderFemale: {
      RegularFemale: { NaturalStream: [], SoctiaStream: [] },
      disabled: [],
      special: [],
    },
  });
  const Tabscategories = AllocationTabscategories;
  const [activeCategory, setActiveCategory] = useState(null);
  const timeoutRef = useRef(null);
  const [selectedOne, setSelectedOne] = useState(initialOption);
  const [selectedBlock, setSelectedBlock] = useState([]);
  const BlockData = BlockDemoData;
  const [floorChange, setFloorChange] = useState({
    floorValue: "",
  });
  const [storFloors, setStorFloors] = useState([]);
  useEffect(() => {
    if (BlockData && BlockData.length > 0) {
      const BlockLocation =
        selectedOne.label === "male" ? "boys_Campus" : "girls_Campus";
      const SelectedBlockArray = [];
      const uniqueFloors = new Set(); // Use Set to store unique floor numbers

      BlockData.forEach((block) => {
        if (block.location === BlockLocation && !block.isFull) {
          SelectedBlockArray.push(block);

          if (block.floors && block.floors.length > 0) {
            block.floors.forEach((floor) => {
              uniqueFloors.add(floor.floorNumber); // Add floor number to the Set
            });
          }
        }
      });

      const floors = Array.from(uniqueFloors); // Convert Set to Array

      if (floors.length > 0) {
        floors.unshift("all"); // Add "all" only if there are floors
      }
      setStorFloors(floors); // Set floors after processing all blocks
      setSelectedBlock(SelectedBlockArray);
    }
  }, [selectedOne]);

  function handleMouseEnter(input) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveCategory(input);
  }

  function handleMouseLeave() {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 1000);
  }

  useEffect(() => {
    if (dataFormat?.length && isNotGust) {
      const newCategorizedStudents = {
        GenderMale: {
          RegularMale: { NaturalStream: [], SoctiaStream: [] },
          disabled: [],
          special: [],
        },
        GenderFemale: {
          RegularFemale: { NaturalStream: [], SoctiaStream: [] },
          disabled: [],
          special: [],
        },
      };

      dataFormat.forEach((student) => {
        const sexType =
          student.sex?.toUpperCase() === "MALE" ? "GenderMale" : "GenderFemale";
        const category = newCategorizedStudents[sexType];

        const isDisabled = student.isDisable?.toUpperCase() === "YES";
        const isSpecial = student.isSpecial?.toUpperCase() === "YES";

        if (isDisabled) {
          category.disabled.push(student);
        } else if (isSpecial) {
          category.special.push(student);
        } else {
          // Handle regular students with stream classification
          const streamKey =
            student.stream?.toUpperCase() === "NATURAL"
              ? "NaturalStream"
              : "SoctiaStream";

          const regularCategory =
            sexType === "GenderMale" ? "RegularMale" : "RegularFemale";

          category[regularCategory][streamKey].push(student);
        }
      });

      setCategorizedStudents(newCategorizedStudents);
    }
  }, [dataFormat, isNotGust]);

  const {
    totalMale,
    totalFemale,
    totalPhysicalDisable,
    totalSpecial,
    maleDisabled,
    maleSpecial,
    femaleDisabled,
    femaleSpecial,
    maleRegular,
    femaleRegular,
    maleNatural,
    maleSocial,
    femaleNatural,
    femaleSocial,
  } = useMemo(() => {
    const maleRegular =
      categorizedStudents.GenderMale.RegularMale.NaturalStream.length +
      categorizedStudents.GenderMale.RegularMale.SoctiaStream.length;
    const maleDisabled = categorizedStudents.GenderMale.disabled.length;
    const maleSpecial = categorizedStudents.GenderMale.special.length;

    const femaleRegular =
      categorizedStudents.GenderFemale.RegularFemale.NaturalStream.length +
      categorizedStudents.GenderFemale.RegularFemale.SoctiaStream.length;
    const femaleDisabled = categorizedStudents.GenderFemale.disabled.length;
    const femaleSpecial = categorizedStudents.GenderFemale.special.length;

    const maleNatural =
      categorizedStudents.GenderMale.RegularMale.NaturalStream.length;
    const maleSocial =
      categorizedStudents.GenderMale.RegularMale.SoctiaStream.length;

    const femaleNatural =
      categorizedStudents.GenderFemale.RegularFemale.NaturalStream.length;
    const femaleSocial =
      categorizedStudents.GenderFemale.RegularFemale.SoctiaStream.length;
    return {
      totalMale: maleRegular + maleDisabled + maleSpecial,
      totalFemale: femaleRegular + femaleDisabled + femaleSpecial,
      totalPhysicalDisable: maleDisabled + femaleDisabled,
      totalSpecial: maleSpecial + femaleSpecial,
      maleDisabled,
      maleSpecial,
      femaleDisabled,
      femaleSpecial,
      femaleRegular,
      maleRegular,
      maleNatural,
      maleSocial,
      femaleNatural,
      femaleSocial,
    };
  }, [categorizedStudents]);

  function handleCategorySelected(option, keys) {
    setSelectedOne({
      key: keys,
      label: option,
    });
  }

  function handleFloorChange(value) {
    setFloorChange({
      floorValue: value,
    });
  }

  useEffect(() => {
    selectedBlock && selectedBlock.length > 0
      ? selectedBlock.map((block) => {
          console.log(block, "block Number");
        })
      : "";
  });

  const FloorSelect = ({ onChange, floors }) => (
    <Select onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select floor" />
      </SelectTrigger>
      <SelectContent>
        {floors?.length > 0 ? (
          floors.map((floor) => (
            <SelectItem key={floor} value={floor}>
              {floor === "all" ? "All Floors" : `Floor ${floor}`}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="none" disabled>
            No floors available
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );

  const renderBlockRow = (block) => (
    <TableRow key={block._id || block.blockNum}>
      <TableCell>{block.blockNum}</TableCell>
      <TableCell>{block.location}</TableCell>
      <TableCell>{block.totalCapacity}</TableCell>
      <TableCell>{block.availableRoom}</TableCell>
      <TableCell>
        <FloorSelect
          onChange={(value) => handleFloorChange(value)}
          floors={storFloors}
        />
      </TableCell>
      <TableCell>
        <input type="checkbox" />
      </TableCell>
    </TableRow>
  );

  const renderFloorRows = (block) => {
    if (!block?.floors?.length) return [];

    return block.floors.map((floor) => (
      <TableRow key={`${block.blockNum}-${floor.floorNumber}`}>
        <TableCell>{floor.floorNumber}</TableCell>
        <TableCell>{floor.floorStatus}</TableCell>
        <TableCell>{floor.floorCapacity}</TableCell>
        <TableCell>{floor.availableRooms}</TableCell>
        <TableCell>
          <FloorSelect
            onChange={(value) => handleFloorChange(value)}
            floors={storFloors}
          />
        </TableCell>
        <TableCell>
          <input type="checkbox" />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="  w-full min-h-screen">
      <div className="flex flex-col gap-2 p-3 md:p-6">
        <div className="w-1/2 m-2">
          <h1 className="text-center text-lg md:text-xl font-bold">
            User Statistical Information
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-1 md:gap-0.5 md:grid-cols-3 px-3 md:px-6">
          <div className="">
            <p>Total Student : {dataFormat.length}</p>
            <p>Total Male : {totalMale}</p>
            <p>Total Female : {totalFemale}</p>
            <p>Regular Male student: {maleRegular}</p>
            <p>Regular female Student : {femaleRegular}</p>
          </div>

          <div>
            <p>Regular Male Natural: {maleNatural}</p>
            <p>Regular female Natural : {femaleNatural}</p>
            <p>Regular Male Social: {maleSocial}</p>
            <p>Regular female Social : {femaleSocial}</p>
            <p>Total physical disable {totalPhysicalDisable}</p>
          </div>

          <div>
            <p>Total Special Student {totalSpecial}</p>
            <p>Male and Physical Disable : {maleDisabled}</p>
            <p>Male and special : {maleSpecial}</p>

            <p>Female and Physical Disable : {femaleDisabled}</p>
            <p>Female and special : {femaleSpecial}</p>
          </div>
        </div>
      </div>
      <hr />

      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <h3 className="text-center py-3 text-lg font-semibold text-gray-800">
          Allocate Student By Selecting Block
        </h3>

        <div className="flex flex-wrap gap-3 justify-center">
          {Tabscategories.map((category) => (
            <div
              key={category.key}
              className="relative group"
              onMouseEnter={() => handleMouseEnter(category.key)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className="px-4 py-3 bg-sky-600   rounded-md hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                aria-label={`Allocate ${category.key} students`}
              >
                {category.label}
              </button>

              {activeCategory === category.key && (
                <div
                  className="absolute top-full dark:bg-white left-0 mt-2 w-64   shadow-lg rounded-md z-10"
                  onMouseEnter={() => handleMouseEnter(category.key)}
                  onMouseLeave={handleMouseLeave}
                >
                  {category.options.map((option) => (
                    <Label
                      key={option.name}
                      name={option.name}
                      onClick={() =>
                        handleCategorySelected(option.name, category.key)
                      }
                      className="block p-2 dark:text-black hover:bg-sky-50 rounded-md cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-14">
          {selectedBlock?.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {floorChange.floorValue === "all"
                      ? "Block Number"
                      : "Floor Number"}
                  </TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>
                    {floorChange.floorValue === "all"
                      ? "Block Capacity"
                      : "Floor Capacity"}
                  </TableHead>
                  <TableHead>
                    {floorChange.floorValue === "all"
                      ? "Available Block Rooms"
                      : "Available Floor Rooms"}
                  </TableHead>
                  <TableHead>
                    {floorChange.floorValue === "all"
                      ? "Floors"
                      : `Floor ${floorChange.floorValue}`}
                  </TableHead>
                  <TableHead>Select</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {floorChange.floorValue === "all"
                  ? selectedBlock.map(renderBlockRow)
                  : selectedBlock.flatMap(renderFloorRows)}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
 
