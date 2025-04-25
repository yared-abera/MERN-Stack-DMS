// import { useEffect, useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

 
// import { useDispatch, useSelector } from "react-redux";
// import {
//   GetAllMaintainanceIssue,
//   GetMainenanceIssueByStatus,
// } from "@/store/maintenanceIssue/maintenanceIssue";

// import { Button } from "@/components/ui/button"; // Make sure to import Button
// import IssueTableMaintenanace from "@/components/proctor-manager/issueTable";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { GetAllMaintainanceIssue, GetMainenanceIssueByStatus } from "@/store/maintenanceIssue/maintenanceIssue";
import { Button } from "@/components/ui/button";
import IssueTableMaintenanace from "@/components/proctor-manager/issueTable";
import { getMaintenanceIssueDormsSubmmitedByProctor } from "@/store/dormSlice";
import ProctorSubmittedIssuesComponents from "@/components/common/proctorSubmittedIssues";

const ViewMaintenance = () => {
 
  const { user } = useSelector((state) => state.auth);
  const [AllMaintainanceIssue, setAllMaintainanceIssue] = useState();
  const [selectedStatus, setSelectedStatus] = useState("All");
  const[proctorSubmitedIssue,setProctorSubmitedIssue]=useState([])

  const dispatch = useDispatch();
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    let gender = capitalizeFirstLetter(user.sex);
    if (selectedStatus === "All") {
      setAllMaintainanceIssue([])
      dispatch(GetAllMaintainanceIssue(gender)).then((data) => {
        if (data.payload.success) {
          setAllMaintainanceIssue(data.payload);
        }
      });
    } else {
      setAllMaintainanceIssue([])
      dispatch(GetMainenanceIssueByStatus({ gender, selectedStatus })).then(
        (data) => {
          if (data.payload.success) {
            setAllMaintainanceIssue(data.payload);
          }
        }
      );
    }
  }, [dispatch, selectedStatus]);



// useEffect(()=>{
//   dispatch(getMaintenanceIssueDormsSubmmitedByProctor()).then((data) => { 
//     console.log(data.payload,"data from dormSlice");
//     if(data.payload.success&&data.payload.data&&data.payload.data.length>0){ 
//       const blockLocation=user.sex.toUpperCase()==='MALE'?'maleArea'?'femaleArea'

//       const filteredData = data.payload.data.filter((item) =>item.location===blockLocation)

//       setProctorSubmitedIssue(filteredData);
//     }
    
     
//   })

// },[dispatch])
useEffect(() => {
  dispatch(getMaintenanceIssueDormsSubmmitedByProctor())
    .then((data) => {
      console.log(data.payload, "data from dormSlice");
      if (
        data.payload.success &&
        Array.isArray(data.payload.data) &&
        data.payload.data.length > 0
      ) {
        const blockLocation =
          user.sex.toUpperCase() === 'MALE' ? 'maleArea' : 'femaleArea';

        const filteredData = data.payload.data.filter(
          (item) => item.location === blockLocation
        );

        setProctorSubmitedIssue(filteredData);
      }
    });
}, [dispatch, user.sex]);

 console.log(proctorSubmitedIssue, "proctorSubmitedIssue");
 
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mt-8 mx-4 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 backdrop-blur-sm border border-gray-100/50 rounded-xl shadow-lg">
        <CardHeader className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
             Student Submitted Maintenance Issues
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
          {['All', 'Resolved', 'verified', 'InProgress'].map((status) => (
            <motion.div
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Button
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  selectedStatus === status 
                    ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-lg shadow-green-200/50'
                    : 'bg-white/90 text-gray-600 hover:bg-gray-50/80 border border-gray-200/60'
                }`}
                onClick={() => setSelectedStatus(status)}
              >
                {status}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        <CardContent className="px-6 pb-6">
          <motion.div
            key={selectedStatus}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {AllMaintainanceIssue && AllMaintainanceIssue.success ? (
              <IssueTableMaintenanace 
                AllMaintainanceIssue={AllMaintainanceIssue} 
                userRole="ProctorManager" 
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 space-y-2"
              >
                <div className="text-4xl">📭</div>
                <p className="text-gray-500 font-medium">No maintenance issues found</p>
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
    </motion.div>
  );
 
  // return (
  //   <Card className="mt-8 mx-4">
  //     <CardHeader>
  //       <CardTitle>Maintenance Issues</CardTitle>
  //     </CardHeader>
  //     <div className="w-full  flex justify-end gap-2 m-3">
  //       <Button className={selectedStatus==='All'?'bg-green-600':''} onClick={() => setSelectedStatus("All")}>All</Button>
  //       <Button className={selectedStatus==='Resolved'?'bg-green-600':''} onClick={() => setSelectedStatus("Resolved")}>Resolved</Button>
  //       <Button className={selectedStatus==='verified'?'bg-green-600':''} onClick={() => setSelectedStatus("verified")}>Verified</Button>
  //       <Button
  //         className={selectedStatus==='InProgress'?'bg-green-600 mr-5':'mr-5'}
  //         onClick={() => setSelectedStatus("InProgress")}
  //       >
  //         {" "}
  //         InProgress
  //       </Button>
  //     </div>
  //     <CardContent>
  //       {AllMaintainanceIssue&&AllMaintainanceIssue.success ? (
  //         <IssueTableMaintenanace AllMaintainanceIssue={AllMaintainanceIssue} userRole="ProctorManager" />
  //       ) : (
  //         <p>No Data is Found</p>
  //       )}
  //     </CardContent>
  //   </Card>
  // );
};

export default ViewMaintenance;
