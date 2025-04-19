import { useEffect, useMemo, useRef, useState } from "react";
import { Label } from "../ui/label";
import { AllocationTabscategories,  } from "@/config/data";

import AllocationComponent from "./AllocationComponent"; // Import the AllocationComponent

import { Button } from "../ui/button";

import { useDispatch } from "react-redux";
import { StudetnDataDirect } from "@/store/common/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import DetailAllocationStart from "./detailAllocationStart";
import { Card, CardContent } from "../ui/card";
import DefaultAllocation from "./DefaultAllocation";
import { GetAvaiableBlocks } from "@/store/blockSlice";
import { getAllocatedStudent } from "@/store/studentAllocation/allocateSlice";

export default function AllocationPage({ dataFormat, selectedValue }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetAvaiableBlocks());
    dispatch(getAllocatedStudent());
  }, [dispatch]);
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

  const [showAllocationComponent, setShowAllocationComponent] = useState(false); // State to control visibility

  // Toggle the visibility of the AllocationComponent

  useEffect(() => {
    if (dataFormat?.length && selectedValue !== "gust") {
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

  useEffect(() => {
    const userCalculatedValue = {
      maleNatural: maleNatural,
      maleSocial: maleSocial,
      femaleNatural: femaleNatural,
      femaleSocial: femaleSocial,
      maleDisabled: maleDisabled,
      femaleDisabled: femaleDisabled,
      maleSpecial: maleSpecial,
      femaleSpecial: femaleSpecial,
    };
    dispatch(
      StudetnDataDirect({
        categorizedStudents,
        selectedValue,
        userCalculatedValue,
      })
    );
  }, [categorizedStudents, selectedValue]);

  console.log("dataFormat in allocation page", dataFormat)
  return (
    <div className="w-full min-h-screen m-2 border-solid border-2 px-3 md:px-5">
      <div className="flex flex-col gap-2 p-3 md:p-6">
        <div className="w-1/2 m-2">
          <h1 className="text-center text-lg md:text-xl font-bold">
            User Statistical Information
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-2 md:gap-0.5 md:grid-cols-2 px-3 md:px-6">
          <Card className="w-auto">
            <CardContent>
              <p>Total Student : {dataFormat.length}</p>
              <p>Total Male : {totalMale}</p>
              <p>Total Female : {totalFemale}</p>
              <p>Regular Male student: {maleRegular}</p>
              <p>Regular female Student : {femaleRegular}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <p>Regular Male Natural: {maleNatural}</p>
              <p>Regular female Natural : {femaleNatural}</p>
              <p>Regular Male Social: {maleSocial}</p>
              <p>Regular female Social : {femaleSocial}</p>
              <p>Total physical disable {totalPhysicalDisable}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <p>Total Special Student {totalSpecial}</p>
              <p>Male and Physical Disable : {maleDisabled}</p>
              <p>Male and special : {maleSpecial}</p>

              <p>Female and Physical Disable : {femaleDisabled}</p>
              <p>Female and special : {femaleSpecial}</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <hr />
      <div className="w-full ">
        <Tabs defaultValue="detail" className="  ">
          <div className="mx-auto">
            <TabsList className="place-content-center flex my-4 ">
              <TabsTrigger value="default">Default Allocation</TabsTrigger>
              <TabsTrigger value="detail">Detail Allocation</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="default">
            <div className="px-6 py-8 bg-gray-400/10 rounded-lg shadow-lg ">
              <div>
                <h1 className="text-center text-lg md:text-xl font-bold m-4">
                  About Default Allocation
                </h1>
                <p className="text-sm w-[75%] mx-auto">
                  The default allocation process automatically assigns available
                  dorm rooms to students. Physical impaired students are
                  prioritized to receive placement on floor 1 of a selected (designated)
                   block—if none is available, it take from available blook of floor 1
                  is used. It follows standard rules, prioritizing students
                  based on needs (like disability) and category (like gender and
                  stream), to fill rooms efficiently. You'll see status updates
                  as it runs
                </p>
              </div>

              <Button
                onClick={() =>
                  setShowAllocationComponent(!showAllocationComponent)
                }
                className=""
              >
                Allocte
              </Button>

              {showAllocationComponent ? (
                <DefaultAllocation categorizedStudents={categorizedStudents} />
              ) : null}
            </div>
          </TabsContent>
          <TabsContent value="detail">
            <DetailAllocationStart />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
