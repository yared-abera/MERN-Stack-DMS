 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

 const ViewMaintenance = () => {
    const maintenanceData = [
      { id: 1, block: "Block 1", issue: "Leaking pipe", status: "Pending" },
      { id: 2, block: "Block 2", issue: "Broken window", status: "In Progress" },
    ];
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>View Maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Block</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenanceData.map((maintenance) => (
                  <TableRow key={maintenance.id}>
                  <TableCell>{maintenance.block}</TableCell>
                  <TableCell>{maintenance.issue}</TableCell>
                  <TableCell>{maintenance.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

export default ViewMaintenance