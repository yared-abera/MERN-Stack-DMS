import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import {
    GetMainenanceIssueByStatusForDean,
  GetWholeMaintainanceIssueOfDean,
} from "@/store/maintenanceIssue/maintenanceIssue";
import { Button } from "@/components/ui/button"; // Make sure to import Button
import IssueTableMaintenanace from "@/components/proctor-manager/issueTable";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Clock, ListFilter } from "lucide-react";

const DeanMaintenanceIssue = () => {
  const [AllMaintainanceIssue, setAllMaintainanceIssue] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedStatus === "All") {
      dispatch(GetWholeMaintainanceIssueOfDean()).then((data) => {
        if (data.payload.success) {
          setAllMaintainanceIssue(data.payload);
        } else {
          setAllMaintainanceIssue("");
        }
      });
    } else {
      dispatch(GetMainenanceIssueByStatusForDean(selectedStatus)).then((data) => {
        if (data?.payload?.success) {
          setAllMaintainanceIssue(data?.payload);
        } else {
          setAllMaintainanceIssue("");
        }
      });
    }
  }, [dispatch, selectedStatus]);

  const statusButtons = [
    { status: "All", icon: ListFilter, color: "bg-blue-600" },
    { status: "Resolved", icon: CheckCircle2, color: "bg-green-600" },
    { status: "Pass", icon: AlertCircle, color: "bg-yellow-600" },
    { status: "InProgress", icon: Clock, color: "bg-orange-600" },
  ];

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <Card className="shadow-lg border-t-4 border-t-blue-600">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                Maintenance Issues
              </CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Track and manage maintenance requests across dormitories
              </p>
            </div>
          </div>
        </CardHeader>

        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex flex-wrap gap-3 justify-end">
            {statusButtons.map((button) => (
              <Button
                key={button.status}
                onClick={() => setSelectedStatus(button.status)}
                className={cn(
                  "transition-all duration-200 flex items-center gap-2",
                  selectedStatus === button.status
                    ? button.color + " text-white"
                    : "bg-white text-gray-700 border-2 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
                )}
                variant={selectedStatus === button.status ? "default" : "outline"}
              >
                <button.icon className="h-4 w-4" />
                {button.status}
              </Button>
            ))}
          </div>
        </div>

        <CardContent className="p-6">
          {AllMaintainanceIssue && AllMaintainanceIssue.success ? (
            <div className="rounded-lg border bg-card">
              <IssueTableMaintenanace AllMaintainanceIssue={AllMaintainanceIssue} userRole="dean" />
            </div>
          ) : (
            <div className="text-center py-10 px-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                No maintenance issues found
              </p>
              <p className="text-gray-500 dark:text-gray-500 mt-1">
                There are currently no maintenance issues matching the selected status.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeanMaintenanceIssue;
