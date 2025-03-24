import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function HelperDialog({ openDialog, setOPenDialog }) {
  const [open, setOpen] = useState(true);

  function handleDialog() {
    setOpen(false);
    setOPenDialog("");
  }

  return (
    <Dialog open={open} onOpenChange={() => handleDialog()}>
      <DialogContent>
        <DialogHeader className='my-4'>
          <DialogTitle>Allocation of the Selected Student </DialogTitle>
        </DialogHeader>
        <DialogDescription className="min-h-max">
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}> {/* Add this div */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>FirstName</TableHead>
                  <TableHead>lastName</TableHead>

                  <TableHead>UserName</TableHead>

                  <TableHead>Block</TableHead>

                  <TableHead>Dorm</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {openDialog.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell>{student.Fname}</TableCell>

                    <TableCell>{student.Lname}</TableCell>

                    <TableCell>{student.userName}</TableCell>

                    <TableCell>{student.blockNum}</TableCell>

                    <TableCell>{student.dormId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div> {/* Close the div */}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}