import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  GetAllMaintainanceIssue,
  GetMainenanceIssueByStatus,
} from "@/store/maintenanceIssue/maintenanceIssue";

import { Button } from "@/components/ui/button"; // Make sure to import Button
import IssueTableMaintenanace from "@/components/proctor-manager/issueTable";

const ViewMaintenance = () => {
 
  const { user } = useSelector((state) => state.auth);
  const [AllMaintainanceIssue, setAllMaintainanceIssue] = useState();
  const [selectedStatus, setSelectedStatus] = useState("All");

  const dispatch = useDispatch();
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    let gender = capitalizeFirstLetter(user.sex);
    if (selectedStatus === "All") {
      dispatch(GetAllMaintainanceIssue(gender)).then((data) => {
        if (data.payload.success) {
          setAllMaintainanceIssue(data.payload);
        }
      });
    } else {
      dispatch(GetMainenanceIssueByStatus({ gender, selectedStatus })).then(
        (data) => {
          if (data.payload.success) {
            setAllMaintainanceIssue(data.payload);
          }
        }
      );
    }
  }, [dispatch, selectedStatus]);

  return (
    <Card className="mt-8 mx-4">
      <CardHeader>
        <CardTitle>Maintenance Issues</CardTitle>
      </CardHeader>
      <div className="w-full  flex justify-end gap-2 m-3">
        <Button className={selectedStatus==='All'?'bg-green-600':''} onClick={() => setSelectedStatus("All")}>All</Button>
        <Button className={selectedStatus==='Resolved'?'bg-green-600':''} onClick={() => setSelectedStatus("Resolved")}>Resolved</Button>
        <Button className={selectedStatus==='verified'?'bg-green-600':''} onClick={() => setSelectedStatus("verified")}>Verified</Button>
        <Button
          className={selectedStatus==='InProgress'?'bg-green-600 mr-5':'mr-5'}
          onClick={() => setSelectedStatus("InProgress")}
        >
          {" "}
          InProgress
        </Button>
      </div>
      <CardContent>
        {AllMaintainanceIssue&&AllMaintainanceIssue.success ? (
          <IssueTableMaintenanace AllMaintainanceIssue={AllMaintainanceIssue} user="ProctorManager" />
        ) : (
          <p>No Data is Found</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ViewMaintenance;
