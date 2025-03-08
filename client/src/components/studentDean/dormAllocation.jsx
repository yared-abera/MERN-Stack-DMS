import { useEffect, useMemo, useRef, useState } from "react";
import { Label } from "../ui/label";

import {
  AllocationTabscategories,
  blockData,
  BlockDemoData,
} from "@/config/data";

import { Button } from "../ui/button";

import DetailAllocation from "./DetailAllocation";
import { useDispatch } from "react-redux";
import { StudetnDataDirect } from "@/store/common/data";
 
 
 
const initialOption = {
  key: "",
  label: "",
};
export default function AllocationPage({ dataFormat, selectedValue }) {
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
  const [timeoutId, setTimeoutId] = useState(null); // State to store timeout ID

  const [selectedOne, setSelectedOne] = useState(initialOption);
  const [filteredBlock, setFilterdBlock] = useState([]);
  const BlockData = BlockDemoData;

  useEffect(() => {
    if (BlockData?.length > 0) {
      const BlockLocation =
        selectedOne.label === "male" ? "boys_Campus" : "girls_Campus";

      const SelectedBlockArray = [];

      BlockData.forEach((block) => {
        if (block.location === BlockLocation && !block.isFull) {
          SelectedBlockArray.push(block);
        }
      });

      setFilterdBlock(SelectedBlockArray);
    }
  }, [selectedOne, BlockData]);

  function handleMouseEnter(input) {
    if (timeoutId) {
      // Check if there's an existing timeout
      clearTimeout(timeoutId); // Clear the timeout if mouse re-enters
      setTimeoutId(null); // Reset timeout ID state
    }
    setActiveCategory(input);
  }

  function handleMouseLeave() {
    const id = setTimeout(() => {
      // Use setTimeout for delay
      setActiveCategory(null);
    }, 1000); // Delay of 1 second
    setTimeoutId(id); // Store timeout ID to clear it later
  }

  useEffect(() => {
    if (dataFormat?.length && selectedValue!=='gust') {
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
  }, [dataFormat, selectedValue]);

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
  const dispatch=useDispatch()

useEffect(()=>{
  const userCalculatedValue={
    maleNatural:maleNatural,
    maleSocial:maleSocial,
    femaleNatural:femaleNatural,
    femaleSocial:femaleSocial,
    maleDisabled:maleDisabled,
    femaleDisabled:femaleDisabled,
    maleSpecial:maleSpecial,
    femaleSpecial:femaleSpecial
  }
 dispatch(StudetnDataDirect({categorizedStudents,selectedValue,userCalculatedValue}))

},[categorizedStudents,selectedValue])

  function handleCategorySelected(option, keys) {
    setSelectedOne({
      key: keys,
      label: option,
    });
  }
 

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

      <div className="p-4 md:p-6 max-w-2xl mx-auto flex flex-col gap-2     min-h-screen" >
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

        <div className="mt-16 text-center">
          <h1 className="text-lg md:text-xl font-semibold">
            {selectedOne.key === "" ? (
              <spane>Please Choose Stud Category</spane>
            ) : (
              <span>
                {" "}
                user selected {selectedOne.label} {selectedOne.key}
              </span>
            )}
          </h1>
        </div>

        <div className="mt-4  h-max">
          <DetailAllocation
            filteredBlock={filteredBlock}
            selectedOne={selectedOne}
            // categoryKey={selectedOne.key}
            // categoryOption={selectedOne.label}
          />
        </div>
      </div>

      <div className="text-right mr-3">
        <Button onClick={() => setisdefaultBtnClicked(true)}>
          Default Allocation
        </Button>
      </div>
    </div>
  );
}
