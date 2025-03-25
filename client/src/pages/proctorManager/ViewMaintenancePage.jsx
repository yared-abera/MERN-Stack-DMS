import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { GetAllMaintainanceIssue } from "@/store/maintenanceIssue/maintenanceIssue";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"; // Make sure to import Button
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const ViewMaintenance = () => {
  const { isLoading, AllMaintainanceIssue } = useSelector(state => state.issue);
  const[openDialog,setDialog]=useState(false)
  const [userData,setUserData]=useState('')
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetAllMaintainanceIssue());
  }, [dispatch]);

  if (isLoading) return <div >Loading maintenance issues...</div>;
 
function handleViewDetail(id){
const viewIssue=AllMaintainanceIssue.data.find(issue=>issue._id===id)
console.log(viewIssue,"viewIssue");

  setUserData(viewIssue)
  setDialog(true)

}
console.log(AllMaintainanceIssue);

function handleRemoveDialog(){
  setUserData('')
  setDialog(false)
}
  return (
    <Card className="mt-8 mx-4">
      <CardHeader>
        <CardTitle>Maintenance Issues</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Middle Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Block</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Issue Types</TableHead>
               <TableHead>Date Reported</TableHead>
               <TableHead>View Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {AllMaintainanceIssue?.data?.map((issue, index) => (
              <TableRow key={index}>
                {/* Access userInfo properties correctly */}
                <TableCell>{issue.userInfo.fName}</TableCell>
                <TableCell>{issue.userInfo.mName}</TableCell>
                <TableCell>{issue.userInfo.lName}</TableCell>
                <TableCell>{issue.userInfo.userName}</TableCell>
                <TableCell>{issue.userInfo.blockNumber}</TableCell>
                <TableCell>{issue.userInfo.roomNumber}</TableCell>
                
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        View Issues ({issue.issueTypes.length})
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {issue.issueTypes.map((type, idx) => (
                        <DropdownMenuItem key={idx}>{type.issue}</DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                
                
                <TableCell>
                  {new Date(issue.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  <Button variant='outline' onClick={()=>handleViewDetail(issue._id)}>👀</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {
          userData!==''?<Dialog open={openDialog} onOpenChange={()=>handleRemoveDialog()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                View Maintainance Issue detail
              </DialogTitle>
            </DialogHeader>
            <DialogDescription>

              <div className="px-6 py-4 flex flex-col ">
                <div className="px-4 py-3 border-solid">
                  <div><h1 className="text-center text-xl font-bold">User Information</h1></div>
               <p>First Name   :{userData.userInfo.fName}</p>
               <p>Middle Name    :{userData.userInfo.mName}</p>
               <p>Last Name   :{userData.userInfo.lName}</p>
               <p>User Name :{userData.userInfo.userName}</p>
               <p>Block Number  :{userData.userInfo.blockNumber}</p>
               <p>Dorm Number :{userData.userInfo.roomNumber}</p>
               <p>Phone Number :{userData.userInfo.phoneNumber}</p>

                </div>
                <Separator/>
             <div>
              <div>
                <h1 className="text-lg font-semibold ml-4">Issue Submited</h1>
              </div>

              <div className="flex flex-wrap gap-2">
                {
                  userData.issueTypes.map((item,index)=><div className="px-4 py-3   border-solid">
               <p>issue Type :{item.issue}</p>
               <p>Issue status:{item.status}</p>
               <p>Issue description:{item.description}</p>
               <p>Create data {item.createdAt}</p>
                  </div>)
                }

              </div>
             </div>
  

              </div>

            </DialogDescription>
          </DialogContent>
        </Dialog>:null
        }

       
      </CardContent>
    </Card>
  );
};

export default ViewMaintenance;