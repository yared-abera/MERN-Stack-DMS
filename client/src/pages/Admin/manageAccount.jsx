import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserAccount } from "@/config/data";
import { useState } from "react";
const intialFromData = {
  Fname: "",
  Mname: "",
  Lname: "",
  email: "",
  userName: "",
  phoneNum: "",
  password: "",
  sex: "",
  id: "",
  role: "",
};

export default function ManageAccount() {
  const [formData, setFormData] = useState(intialFromData);
  const data = [
    {
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      role: "Admin"
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      username: "janesmith",
      role: "User"
    },
    {
      firstName: "Alice",
      lastName: "Johnson",
      username: "alicej",
      role: "Moderator"
    },
    {
      firstName: "Bob",
      lastName: "Brown",
      username: "bobbrown",
      role: "User"
    },
    {
      firstName: "Charlie",
      lastName: "Davis",
      username: "charlied",
      role: "Admin"
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      username: "janesmith",
      role: "User"
    },
  ];
  

  const onSubmit = (event) => {
    event.preventDefault();
  };

  function iSFormValid() {
    return Object.values(formData).every((item) => item != "");
  }

  return (
    <div className="min-h-screen w-full p-2 flex flex-col  ">
      <div className="flex items-end justify-end mt-20">
        <Sheet>
          <SheetTrigger>
            {" "}
            <Button className='mr-6 sm:text-sm md:text-base'>Create Account</Button>
          </SheetTrigger>
          <SheetContent
            className="w-[400px] sm:w-[540px] overflow-auto  "
            side="right"
          >
            <SheetHeader>
              <SheetTitle className="font-bold font-serif text-neutral-900 mb-4">
                {" "}
                Create Account
              </SheetTitle>
              <SheetDescription>
                <CommonForm
                  formControls={UserAccount}
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={onSubmit}
                  buttonText={"Create"}
                  isBtnDisabled={!iSFormValid()}
                />
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flxe flex-col  w-full shadow-lg shadow-sky-900 h-full  mt-6 gap-5 flxe-1 ">
        <div className="flxe items-center justify-center  m-6 ">
          <h1 className="text-xl font-semibold   text-black dark:text-white place-content-center ">
            List of all user{" "}
          </h1>
        </div>

        {/* <div className="sm:overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>user Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Zulkif </TableCell>
                <TableCell>Azher</TableCell>
                <TableCell>Xulkif</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Button>View Detail</Button>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Button>Update</Button>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Button>Delete</Button>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Button>Checkbox</Button>
                </TableCell>
                <TableCell className="block md:hidden">
                  <Button>Buttons</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Zulkif </TableCell>
                <TableCell>Azher</TableCell>
                <TableCell>Xulkif</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Button>View Detail</Button>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Button>Update</Button>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Button>Delete</Button>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Button>Checkbox</Button>
                </TableCell>
                <TableCell className="block md:hidden">
                  <Button>Buttons</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div> */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              { data.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {/* Desktop buttons */}
                    <div className="hidden md:flex gap-2 justify-end">
                      <Button variant="outline">View</Button>
                      <Button variant="outline">Edit</Button>
                      <Button variant="destructive">Delete</Button>
                      <div className="flex items-center gap-4">
                        <label className="flex flex-col items-center">
                        <span className="ml-2">Activate</span>
                          <input
                            type="radio"
                            name="status"
                            value="activate"
                            className="w-4 h-4 align-middle mt-1"
                          />
                        
                        </label>

                        <label className="flex  flex-col items-center">
                        <span className="ml-2">Deactivate</span>
                          <input
                            type="radio"
                            name="status"
                            value="deactivate"
                            className="w-4 h-4 align-middle mt-1"
                          />
                         
                        </label>
                      </div>
                    </div>

                    {/* Mobile dropdown */}
                    <div className="md:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            ⋮
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <input type="checkbox" className="mr-2" />
                            Select
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
