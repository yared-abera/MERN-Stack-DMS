import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function StudentDeanBlockInfo() {
  return (
    <div className="mt-20 w-full min-h-screen   flex flex-col gap-2">
      <div className="flex flex-col h-auto p-3 md:py-5">
        <h1 className="text-center text-lg md:text-xl fon-bold my-2 md:my-4">
          List of All Blocks
        </h1>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Block Number</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Found In</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Room</TableHead>
              <TableHead>Available Room</TableHead>
              <TableHead>Is Selected for Spetial student</TableHead>
              <TableHead>Is Selected for disable student</TableHead>
              <TableHead >Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell>220</TableCell>
              <TableCell>200</TableCell>
              <TableCell>Male campus</TableCell>
              <TableCell>occupied</TableCell>
              <TableCell>50</TableCell>
              <TableCell>0</TableCell>

              <TableCell>No</TableCell>
              <TableCell>Yes</TableCell>
              <TableCell>
              <Button variant="outline">View Detail</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
