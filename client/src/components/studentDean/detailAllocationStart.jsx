import { AllocationTabscategories,   } from "@/config/data";
import { useState } from "react";
import { Label } from "../ui/label";
import DetailAllocation from "./DetailAllocation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

const initialOption = {
  key: "",
  label: "",
};
export default function DetailAllocationStart() {
   

  const [filteredBlock, setFilterdBlock] = useState([]);

  const { AvailebleBlocks } = useSelector((state) => state.block);
  
  
  const BlockData = AvailebleBlocks.data;
 


  const [selectedOne, setSelectedOne] = useState(initialOption);

  useEffect(() => {
    if (BlockData?.length > 0) {
      const BlockLocation =
        selectedOne.label === "male" ? "maleArea" : "femaleArea";

      const SelectedBlockArray = [];

      BlockData.forEach((block) => {
        if (block.location === BlockLocation ) {
          SelectedBlockArray.push(block);
        }
      });

      setFilterdBlock(SelectedBlockArray);
    }
  }, [BlockData, selectedOne]);

  function handleCategorySelected(option, keys) {
    setSelectedOne({
      key: keys,
      label: option,
    });
  }

  return (
    <div className="overflow-hidden flex flex-col gap-2 min-h-screen ">
      <div className="flex flex-col   gap-2  ">
        <h3 className="text-center py-3 text-lg font-semibold text-gray-800">
          Allocate Student By Selecting Block
        </h3>

        <div className="flex gap-3 justify-center w-auto mt-3">
          {AllocationTabscategories.map((category) => (
            <div key={category.key}>
              <HoverCard>
                <HoverCardTrigger className="px-3 py-3 text-sm md:text-base bg-blue-700/50 rounded-lg
                 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors cursor-pointer">
                  {category.label}
                </HoverCardTrigger>
                <HoverCardContent className="mt-2 w-64 shadow-lg rounded-md dark:bg-white">
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
                </HoverCardContent>
              </HoverCard>
            </div>
          ))}
        </div>

        <div>
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
        </div>
      </div>

      <div className="mt-4  h-auto">
        <DetailAllocation
          filteredBlock={filteredBlock}
          selectedOne={selectedOne}
        />
      </div>
    </div>
  );
}

 