import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";

export default function TableInfo({ studType }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>First Name</TableHead>
          <TableHead>Middle Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>User Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Stud Id</TableHead>
          <TableHead>Batch</TableHead>
          <TableHead>Block</TableHead>
          <TableHead>Dorm</TableHead>

          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Abdi</TableCell>
          <TableCell>Kemal</TableCell>
          <TableCell>Draro</TableCell>
          <TableCell>Male</TableCell>
          <TableCell>Prince</TableCell>

          <TableCell>Abdi@gmail.com</TableCell>
          <TableCell>NSR/0039/14</TableCell>
          <TableCell>4</TableCell>
          <TableCell>218</TableCell>
          <TableCell>120</TableCell>
          <TableCell>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button size="icon" aria-label="Actions menu">
        <ChevronDown />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem asChild>
        <Button className="w-full justify-start" variant="ghost">
          <span className="md:hidden">Detail</span>
          <span className="hidden md:inline">View Detail</span>
        </Button>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Button className="w-full justify-start" variant="ghost">
          Edit
        </Button>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Button className="w-full justify-start" variant="destructive">
          Delete
        </Button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</TableCell>
        
        </TableRow>
      </TableBody>
    </Table>
  );
}
 