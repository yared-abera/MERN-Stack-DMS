import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { GetAllMaintainanceIssue } from "@/store/maintenanceIssue/maintenanceIssue";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"; // Make sure to import Button

const ViewMaintenance = () => {
  const { isLoading, AllMaintainanceIssue } = useSelector(state => state.issue);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetAllMaintainanceIssue());
  }, [dispatch]);

  if (isLoading) return <div >Loading maintenance issues...</div>;

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
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Reported</TableHead>
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
                        <DropdownMenuItem key={idx}>{type}</DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell>{issue.description}</TableCell>
                <TableCell className={issue==='pending'?'text-red-600':''}>{issue.status}</TableCell>
                <TableCell>
                  {new Date(issue.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ViewMaintenance;