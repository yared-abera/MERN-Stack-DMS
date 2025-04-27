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
import { getMaintenanceIssueDormsSubmmitedByProctor } from "@/store/dormSlice";
import ProctorSubmittedIssuesComponents from "@/components/common/proctorSubmittedIssues";
import { motion } from "framer-motion";
const DeanMaintenanceIssue = () => {
  const [AllMaintainanceIssue, setAllMaintainanceIssue] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const[proctorSubmitedIssue,setProctorSubmitedIssue]=useState([])

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

  useEffect(() => {
    dispatch(getMaintenanceIssueDormsSubmmitedByProctor())
      .then((data) => {
        console.log(data.payload, "data from dormSlice");
        if (
          data.payload.success &&
          Array.isArray(data.payload.data) &&
          data.payload.data.length > 0
        ) {
         
  
          setProctorSubmitedIssue(data.payload.data);
        }
      });
  },[dispatch]);

  console.log(proctorSubmitedIssue, "proctorSubmitedIssue from dean");
  

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


       <Card className="mt-8 mx-4 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 backdrop-blur-sm border border-gray-100/50 rounded-xl shadow-lg">
              <CardHeader className="relative">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                   Proctor Submitted Maintenance Issues
                  </CardTitle>
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />
                </motion.div>
              </CardHeader>
      
              <motion.div
                className="w-full flex justify-end gap-3 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                 
              </motion.div>
      
              <CardContent className="px-6 pb-6">
                <motion.div
                  key={selectedStatus}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {proctorSubmitedIssue && proctorSubmitedIssue.length>0 ? (
                   <ProctorSubmittedIssuesComponents proctorSubmitedIssue={proctorSubmitedIssue}/>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 space-y-2"
                    >
                      <div className="text-4xl">📭</div>
                      <p className="text-gray-500 font-medium">No maintenance issues dorm is registerd</p>
                      <p className="text-sm text-gray-400">Issues will appear here once reported</p>
                    </motion.div>
                  )}
                </motion.div>
              </CardContent>
      
              {/* Subtle animated background elements */}
              <div className="absolute inset-0 -z-10 opacity-15">
                <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:16px_16px]" />
                
              </div>
            </Card>
    </div>
  );
};

export default DeanMaintenanceIssue;
