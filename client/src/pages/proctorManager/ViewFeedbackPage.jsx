import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

  const  ViewFeedback = () => {

    const feedbackData = [
      { id: 1, block: "Block 1", feedback: "Great facilities!", date: "2023-10-01" },
      { id: 2, block: "Block 2", feedback: "Needs more cleaning.", date: "2023-10-02" },
    ];
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>View Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Block</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbackData.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell>{feedback.block}</TableCell>
                  <TableCell>{feedback.feedback}</TableCell>
                  <TableCell>{feedback.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  export default ViewFeedback

 