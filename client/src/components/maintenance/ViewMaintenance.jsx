// components/maintenance/ViewMaintenance.jsx
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "react-hot-toast";

export default function ViewMaintenance() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch("/api/maintenance", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        
        if (!response.ok) throw new Error("Failed to fetch issues");
        
        const data = await response.json();
        setIssues(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Card className="mt-8 mx-4">
      <CardHeader>
        <CardTitle>Maintenance Issues</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Block</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Issues</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue._id}>
                <TableCell>{issue.userInfo.blockNumber}</TableCell>
                <TableCell>{issue.userInfo.roomNumber}</TableCell>
                <TableCell>
                  {Object.entries(issue.issueTypes)
                    .filter(([_, value]) => value)
                    .map(([key]) => key)
                    .join(", ")}
                </TableCell>
                <TableCell>{issue.description}</TableCell>
                <TableCell>{issue.status}</TableCell>
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
}