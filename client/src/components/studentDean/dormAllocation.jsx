import { useEffect, useMemo, useRef, useState } from "react";
import { Label } from "../ui/label";
import { AllocationTabscategories, BlockDemoData } from "@/config/data";

import AllocationComponent from "./AllocationComponent"; // Import the AllocationComponent

import { Button } from "../ui/button";

import { useDispatch } from "react-redux";
import { StudetnDataDirect } from "@/store/common/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import DetailAllocationStart from "./detailAllocationStart";
import DefaultAllocation from "./DefaultAllocation";
import { Card, CardContent } from "../ui/card";

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

  const [showAllocationComponent, setShowAllocationComponent] = useState(false); // State to control visibility

  // Toggle the visibility of the AllocationComponent
  const handleShowAllocationComponent = () => {
    setShowAllocationComponent((prev) => !prev);
  };

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
  const dispatch = useDispatch();

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

  return (
    <div className="w-full min-h-screen m-2 border-solid border-2 px-3 md:px-5">
      <div className="flex flex-col gap-2 p-3 md:p-6">
        <div className="w-1/2 m-2">
          <h1 className="text-center text-lg md:text-xl font-bold">
            User Statistical Information
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-2 md:gap-0.5 md:grid-cols-2 px-3 md:px-6">
          <Card className='w-auto'>
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
          
          <TabsContent value="default ">
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleShowAllocationComponent}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {showAllocationComponent
                  ? "Hide Allocation"
                  : "Show Allocation"}
              </button>
            </div>

            {showAllocationComponent && (
              <AllocationComponent categorizedStudents={categorizedStudents} />
            )}
          </TabsContent>
          <TabsContent value="detail">
            <DetailAllocationStart />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
