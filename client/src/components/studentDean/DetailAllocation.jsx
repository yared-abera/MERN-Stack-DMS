import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectValue,
  SelectItem,
  SelectTrigger,
} from "../ui/select";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

import { Dialog, DialogContent } from "../ui/dialog";
import AllocationDialog from "./AllocationDialog";

export default function DetailAllocation({ filteredBlock, selectedOne }) {
  const [selectedFloor, setSelectedFloor] = useState({
    blockNum: null,
    floorNumber: null,
    location: null,
  });
  const [selectedBlockANDFloor, setSelectedBlockANDFloor] = useState({
    CheckedFloors: [],
    CheckedBlocks: [],
  });

   
  const [checkSelected, setCheckSelected] = useState(false);

  // Helper: Clear radio selection for a given block (both block-level and floor-level selections)
  const clearRadioBlock = useCallback((blockNum) => {
    setSelectedBlockANDFloor((prev) => ({
      ...prev,
      CheckedBlocks: prev.CheckedBlocks.filter(
        (b) => b.blockNumber !== blockNum
      ),
      CheckedFloors: prev.CheckedFloors.filter(
        (f) => f.blockNumber !== blockNum
      ),
    }));
  }, []);

  // Helper: Clear radio selection for a specific floor (fixed: use f.location instead of s.location)
  const clearRadioFloor = useCallback((blockNum, floorNumber, location) => {
    setSelectedBlockANDFloor((prev) => ({
      ...prev,
      CheckedFloors: prev.CheckedFloors.filter(
        (f) =>
          !(
            f.blockNumber === blockNum &&
            f.floorNumber === floorNumber &&
            f.location === location
          )
      ),
    }));
  }, []);

  // Handle radio selection for blocks
  const handleCheckedBlock = useCallback((selectedOne, blockNum, category) => {
    setSelectedBlockANDFloor((prev) => {
      const newBlocks = prev.CheckedBlocks.filter(
        (b) => b.blockNumber !== blockNum
      );
      newBlocks.push({
        blockNumber: blockNum,
        checkForKey: selectedOne.key,
        checkForOption: selectedOne.label,
        checkForCategory: category,
      });
      return { ...prev, CheckedBlocks: newBlocks };
    });
  }, []);

  const handleToggleBlock = useCallback((selectedOne, blockNum, location) => {
    setSelectedBlockANDFloor((prev) => {
      const exists = prev.CheckedBlocks.some((b) => b.blockNumber === blockNum);
      if (exists) {
        return {
          ...prev,
          CheckedBlocks: prev.CheckedBlocks.filter(
            (b) => b.blockNumber !== blockNum
          ),
        };
      }
      return {
        ...prev,
        CheckedBlocks: [
          ...prev.CheckedBlocks,
          {
            blockNumber: blockNum,
            checkForKey: selectedOne.key,
            checkForOption: selectedOne.label,
            checkForCategory: "",
            location: location,
          },
        ],
      };
    });
  }, []);

  // Handle radio selection for floors (added location)
  const handleCheckedFloor = useCallback((selectedOne, floor, category) => {
    setSelectedBlockANDFloor((prev) => {
      const newFloors = prev.CheckedFloors.filter(
        (f) =>
          !(
            f.floorNumber === floor.floorNumber &&
            f.blockNumber === floor.blockNum &&
            f.location === floor.location
          )
      );
      newFloors.push({
        floorNumber: floor.floorNumber,
        blockNumber: floor.blockNum,
        checkForKey: selectedOne.key,
        checkForOption: selectedOne.label,
        checkForCategory: category,
        location: floor.location,
      });
      return { ...prev, CheckedFloors: newFloors };
    });
  }, []);

  // Handle checkbox toggle for floors (fixed: use && for location check and add location when adding new floor)
  const handleToggleFloor = useCallback((selectedOne, floor) => {
    setSelectedBlockANDFloor((prev) => {
      const exists = prev.CheckedFloors.some(
        (f) =>
          f.floorNumber === floor.floorNumber &&
          f.blockNumber === floor.blockNum &&
          f.location === floor.location
      );
      if (exists) {
        return {
          ...prev,
          CheckedFloors: prev.CheckedFloors.filter(
            (f) =>
              !(
                f.floorNumber === floor.floorNumber &&
                f.blockNumber === floor.blockNum &&
                f.location === floor.location
              )
          ),
        };
      }
      return {
        ...prev,
        CheckedFloors: [
          ...prev.CheckedFloors,
          {
            floorNumber: floor.floorNumber,
            blockNumber: floor.blockNum,
            checkForKey: selectedOne.key,
            checkForOption: selectedOne.label,
            checkForCategory: "",
            location: floor.location,
          },
        ],
      };
    });
  }, []);

  // Radio button component for blocks
  const RadioOption = ({ block, value, label }) => {
    // Check if block-level radio is selected
    const blockRadioSelected = selectedBlockANDFloor.CheckedBlocks.some(
      (b) => b.blockNumber === block.blockNum && b.checkForCategory === value
    );
    // Check if all floors in this block have the same radio selection
    const floorOptions = block.floors.map((floor) => {
      const floorSelection = selectedBlockANDFloor.CheckedFloors.find(
        (f) =>
          f.floorNumber === floor.floorNumber &&
          f.blockNumber === block.blockNum
      );
      return floorSelection ? floorSelection.checkForCategory : null;
    });
    const allFloorsSelectedSame =
      floorOptions.length > 0 &&
      floorOptions.every((opt) => opt === value && opt !== null);
    const isChecked = blockRadioSelected || allFloorsSelectedSame;
    return (
      <div className="flex gap-1">
        <input
          type="radio"
          name={`block-${block.blockNum}`}
          value={value}
          checked={isChecked}
          onChange={(e) =>
            handleCheckedBlock(selectedOne, block.blockNum, e.target.value)
          }
        />
        <Label>{label}</Label>
      </div>
    );
  };

  // Radio button component for floors (fixed: include location check)
  const FloorRadioOption = ({ value, label }) => {
    const isChecked =
      selectedBlockANDFloor.CheckedFloors.some(
        (f) =>
          f.floorNumber === selectedFloor.floorNumber &&
          f.blockNumber === selectedFloor.blockNum &&
          f.checkForCategory === value &&
          f.location === selectedFloor.location
      ) ||
      selectedBlockANDFloor.CheckedBlocks.some(
        (b) =>
          b.blockNumber === selectedFloor.blockNum &&
          b.checkForCategory === value
      );
    return (
      <div className="flex gap-1">
        <input
          type="radio"
          name={`floor-${selectedFloor.blockNum}-${selectedFloor.floorNumber}`}
          value={value}
          checked={isChecked}
          onChange={(e) =>
            handleCheckedFloor(selectedOne, selectedFloor, e.target.value)
          }
        />
        <Label>{label}</Label>
      </div>
    );
  };

  useEffect(() => {
    // Check if any blocks are directly selected
    const hasBlockSelections = selectedBlockANDFloor.CheckedBlocks.length > 0;

    // Check if any blocks have all their floors selected
    const hasFullBlockViaFloors = filteredBlock.some((block) => {
      return block.floors.every((floor) =>
        selectedBlockANDFloor.CheckedFloors.some(
          (f) =>
            f.blockNumber === block.blockNum &&
            f.floorNumber === floor.floorNumber
        )
      );
    });

    // Show button only if either condition is met
    setCheckSelected(hasBlockSelections || hasFullBlockViaFloors);
  }, [selectedBlockANDFloor, filteredBlock]);

 

  const handleBackToBlocks = () => {
    setSelectedFloor({ blockNum: null, floorNumber: null, location: null });
  };

  if (!filteredBlock?.length) return null;

  if (selectedFloor.blockNum) {
    // Floor view
    const block = filteredBlock.find(
      (b) => b.blockNum === selectedFloor.blockNum
    );
    const floorData = block?.floors.find(
      (f) => f.floorNumber === selectedFloor.floorNumber
    );

    return (
      <div>
        <div className="flex items-center gap-4 mb-4">
          <Button onClick={handleBackToBlocks} variant="outline">
            ← Back to Blocks
          </Button>
          <h2 className="text-lg font-semibold">
            Block {selectedFloor.blockNum} - Floor {selectedFloor.floorNumber}
          </h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Floor Number</TableHead>
              <TableHead>Available Space</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Selected For</TableHead>
              <TableHead>Select</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {floorData && (
              <TableRow>
                <TableCell>{selectedFloor.floorNumber}</TableCell>
                <TableCell>{floorData.totalAvailable}</TableCell>
                <TableCell>{floorData.floorStatus}</TableCell>
                <TableCell>{floorData.isSelectedFor || "None"}</TableCell>
                <TableCell>
                  {selectedOne.key === "regular" ? (
                    <div className="flex items-center gap-2">
                      <div className="grid grid-1 gap-2">
                        <FloorRadioOption value="natural" label="Natural" />
                        <FloorRadioOption value="social" label="Social" />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          clearRadioFloor(
                            selectedFloor.blockNum,
                            selectedFloor.floorNumber,
                            selectedFloor.location
                          )
                        }
                      >
                        Clear
                      </Button>
                    </div>
                  ) : (
                    <Checkbox
                      checked={
                        selectedBlockANDFloor.CheckedFloors.some(
                          (f) =>
                            f.floorNumber === selectedFloor.floorNumber &&
                            f.blockNumber === selectedFloor.blockNum &&
                            f.location === selectedFloor.location
                        ) ||
                        selectedBlockANDFloor.CheckedBlocks.some(
                          (b) => b.blockNumber === block.blockNum
                        )
                      }
                      onCheckedChange={() =>
                        handleToggleFloor(selectedOne, selectedFloor)
                      }
                    />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  } else {
    return (
      <div className="h-full  ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Block Number</TableHead>
              <TableHead>Location</TableHead>
            
              <TableHead>Available Space</TableHead>
              <TableHead>Floors</TableHead>
              <TableHead>Select Whole Block</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedOne.key !== "" &&
              filteredBlock.map((block) => {
                // If every floor in a block is selected then consider the block as selected
                const allFloorsSelected =
                  block.floors.length > 0 &&
                  block.floors.every((floor) =>
                    selectedBlockANDFloor.CheckedFloors.some(
                      (f) =>
                        f.floorNumber === floor.floorNumber &&
                        f.blockNumber === block.blockNum
                    )
                  );
                return (
                  <TableRow key={block.blockNum}>
                    <TableCell>{block.blockNum}</TableCell>
                    <TableCell>{block.location}</TableCell>
                     <TableCell>{block.totalAvailable}</TableCell>
                    <TableCell>
                      <Select
                        onValueChange={(value) =>
                          setSelectedFloor({
                            blockNum: block.blockNum,
                            floorNumber: parseInt(value, 10),
                            location: block.location,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue>Select Floor</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {block.floors.map((floor) => (
                            <SelectItem
                              key={floor.floorNumber}
                              value={floor.floorNumber.toString()}
                            >
                              Floor {floor.floorNumber} ({floor.floorStatus})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {selectedOne.key === "regular" ? (
                        <div className="flex items-center gap-2">
                          <div className="grid grid-1 gap-2">
                            <RadioOption
                              block={block}
                              value="natural"
                              label="Natural"
                            />
                            <RadioOption
                              block={block}
                              value="social"
                              label="Social"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => clearRadioBlock(block.blockNum)}
                          >
                            Clear
                          </Button>
                        </div>
                      ) : (
                        <Checkbox
                          checked={
                            selectedBlockANDFloor.CheckedBlocks.some(
                              (b) =>
                                b.blockNumber === block.blockNum &&
                                b.location === block.location
                            ) || allFloorsSelected
                          }
                          onCheckedChange={() =>
                            handleToggleBlock(
                              selectedOne,
                              block.blockNum,
                              block.location
                            )
                          }
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>

        <div className="mt-20 w-full h-auto ">
          
          <AllocationDialog
            selectedBlockANDFloor={selectedBlockANDFloor}
            filteredBlock={filteredBlock}
          />
        </div>
      </div>
    );
  }
}
