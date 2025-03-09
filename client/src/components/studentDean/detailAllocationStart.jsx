import { AllocationTabscategories, BlockDemoData } from "@/config/data";
import { useState } from "react";
import { Label } from "../ui/label";
import DetailAllocation from "./DetailAllocation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const initialOption = {
  key: "",
  label: "",
};
export default function DetailAllocationStart() {
  const Tabscategories = AllocationTabscategories;
  const [activeCategory, setActiveCategory] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null); // State to store timeout ID
  const BlockData = BlockDemoData;

  const [filteredBlock, setFilterdBlock] = useState([]);
  const { list, availableProctors } = useSelector((state) => state.block);

  const [selectedOne, setSelectedOne] = useState(initialOption);

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
  }, [BlockData, selectedOne]);

  function handleCategorySelected(option, keys) {
    setSelectedOne({
      key: keys,
      label: option,
    });
  }

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
  return (
    <div className="overflow-hidden flex flex-col gap-2 h-auto ">

      <div className="flex flex-col   gap-2  ">

       
      <h3 className="text-center py-3 text-lg font-semibold text-gray-800">
        Allocate Student By Selecting Block
      </h3>

      <div className="flex gap-3 justify-center">
        {Tabscategories.map((category) => (
          <div
            key={category.key}
            className="relative group"
            onMouseEnter={() => handleMouseEnter(category.key)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className=" px-3 py-3 text-sm md:text-base bg-blue-700/50 rounded-lg hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
              aria-label={`Allocate ${category.key} students`}
            >
              {category.label}
            </button>

            {activeCategory === category.key && (
              <div
                className="absolute top-full dark:bg-white left-0 mt-2 w-64 shadow-lg rounded-md z-10"
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
