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
import { CreateAccount } from "@/store/auth-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { getAllUser, getSingleUser, updateUserStatus, deleteUser, setSelectedUser, UpdateUser } from "@/store/user-slice/userSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const intialFromData = {
  fName: "",
  mName: "",
  lName: "",
  email: "",
  userName: "",
  phoneNum: "",
  password: "",
  confirmPassword: "",
  gender: "",
  role: "",
};

export default function ManageAccount() {
  const [formData, setFormData] = useState(intialFromData);
  const { isLoading, AllUser, selectedUser } = useSelector((state) => state.allUser);
  const [viewDialog, setViewDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [statusChangeDialog, setStatusChangeDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToChangeStatus, setUserToChangeStatus] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [editFormData, setEditFormData] = useState(intialFromData);
  const [validationErrors, setValidationErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch all users when component mounts
    dispatch(getAllUser());
  }, [dispatch]);

  useEffect(() => {
    if (selectedUser) {
      setEditFormData({
        fName: selectedUser.fName || "",
        mName: selectedUser.mName || "",
        lName: selectedUser.lName || "",
        email: selectedUser.email || "",
        userName: selectedUser.userName || "",
        phoneNum: selectedUser.phoneNum || "",
        gender: selectedUser.sex || "",
        role: selectedUser.role || "",
      });
    }
  }, [selectedUser]);

  // Validate form data
  useEffect(() => {
    const errors = {};

    // Name validations (alphabet only)
    if (formData.fName && !/^[A-Za-z\s]+$/.test(formData.fName)) {
      errors.fName = "First name should contain only letters";
    }

    if (formData.mName && !/^[A-Za-z\s]+$/.test(formData.mName)) {
      errors.mName = "Middle name should contain only letters";
    }

    if (formData.lName && !/^[A-Za-z\s]+$/.test(formData.lName)) {
      errors.lName = "Last name should contain only letters";
    }

    // Username validation (must start with a letter)
    if (formData.userName && !/^[A-Za-z]/.test(formData.userName)) {
      errors.userName = "Username must start with a letter";
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Phone number validation (must be unique and have Ethiopian country code)
    if (formData.phoneNum) {
      // Check if phone number already exists in AllUser
      const phoneExists = AllUser?.data?.some(user =>
        user.phoneNum === `+251${formData.phoneNum}` && user._id !== selectedUser?._id
      );

      if (phoneExists) {
        errors.phoneNum = "This phone number is already registered";
      }

      // Check if phone number contains only digits
      if (!/^\d+$/.test(formData.phoneNum)) {
        errors.phoneNum = "Phone number should contain only digits";
      }
    }

    // Password validation
    if (formData.password && formData.password.length < 5) {
      errors.password = "Password must be at least 5 characters long";
    }

    // Confirm password validation
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);

    // Check if form is valid (all required fields are filled and no errors)
    const requiredFields = ['fName', 'lName', 'email', 'userName', 'phoneNum', 'password', 'confirmPassword', 'gender', 'role'];
    const hasAllRequiredFields = requiredFields.every(field => formData[field] && formData[field].trim() !== '');
    const hasNoErrors = Object.keys(errors).length === 0;

    setIsFormValid(hasAllRequiredFields && hasNoErrors);
  }, [formData, AllUser, selectedUser]);

  const onSubmit = (event) => {
    event.preventDefault();

    // Add Ethiopian country code to phone number
    const formDataWithCountryCode = {
      ...formData,
      phoneNum: `+251${formData.phoneNum}`
    };

    dispatch(CreateAccount(formDataWithCountryCode)).then((data) => {
      if (data?.payload?.success) {
        toast.success(" ✅ User Created Successfully ");
        // Refresh the user list
        dispatch(getAllUser());
        // Reset form
        setFormData(intialFromData);
      } else {
        toast.error("Error Occurred ");
      }
    });
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    dispatch(UpdateUser({ id: selectedUser._id, formData: editFormData })).then((data) => {
      if (data?.payload?.success) {
        toast.success("User updated successfully");
        setEditDialog(false);
        dispatch(getAllUser());
      } else {
        toast.error("Error updating user");
      }
    });
  };

  // Function to get initials from name
  const getInitials = (fName, lName) => {
    return `${fName ? fName.charAt(0) : ''}${lName ? lName.charAt(0) : ''}`;
  };

  // Handle view user details
  const handleViewUser = (user) => {
    dispatch(setSelectedUser(user));
    setViewDialog(true);
  };

  // Handle edit user
  const handleEditUser = (user) => {
    dispatch(setSelectedUser(user));
    setEditDialog(true);
  };

  // Handle delete user
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteDialog(true);
  };

  // Confirm delete user
  const confirmDeleteUser = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete._id)).then((data) => {
        if (data?.payload?.success) {
          toast.success("User deleted successfully");
          setDeleteDialog(false);
        } else {
          toast.error("Error deleting user");
        }
      });
    }
  };

  // Handle status change
  const handleStatusChange = (user, newStatus) => {
    setUserToChangeStatus(user);
    setNewStatus(newStatus);
    setStatusChangeDialog(true);
  };

  // Confirm status change
  const confirmStatusChange = () => {
    if (userToChangeStatus) {
      dispatch(updateUserStatus({ id: userToChangeStatus._id, status: newStatus })).then((data) => {
        if (data?.payload?.success) {
          toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
          setStatusChangeDialog(false);
        } else {
          toast.error("Error updating user status");
        }
      });
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen w-full p-2 flex flex-col mt-2 overflow-x-hidden">
      
        <Sheet>
          <SheetTrigger className="text-sm md:text-base  text-right mr-6">
            <span className="text-sm md:text-base border-2 border-black rounded-md p-2 bg-blue-800/80 text-white cursor-pointer hover:bg-blue-600">Create Account</span>
          </SheetTrigger>
          <SheetContent
            className="w-[400px] sm:w-[540px] overflow-auto"
            side="right"
          >
            <SheetHeader>
              <SheetTitle className="font-bold font-serif text-neutral-900 mb-4">
                Create Account
              </SheetTitle>
              <SheetDescription>
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fName">First Name *</Label>
                      <Input
                        id="fName"
                        name="fName"
                        value={formData.fName}
                        onChange={handleInputChange}
                        placeholder="Enter first name"
                        className={validationErrors.fName ? "border-red-500" : ""}
                      />
                      {validationErrors.fName && (
                        <p className="text-sm text-red-500">{validationErrors.fName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mName">Middle Name</Label>
                      <Input
                        id="mName"
                        name="mName"
                        value={formData.mName}
                        onChange={handleInputChange}
                        placeholder="Enter middle name"
                        className={validationErrors.mName ? "border-red-500" : ""}
                      />
                      {validationErrors.mName && (
                        <p className="text-sm text-red-500">{validationErrors.mName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lName">Last Name *</Label>
                      <Input
                        id="lName"
                        name="lName"
                        value={formData.lName}
                        onChange={handleInputChange}
                        placeholder="Enter last name"
                        className={validationErrors.lName ? "border-red-500" : ""}
                      />
                      {validationErrors.lName && (
                        <p className="text-sm text-red-500">{validationErrors.lName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userName">Username *</Label>
                      <Input
                        id="userName"
                        name="userName"
                        value={formData.userName}
                        onChange={handleInputChange}
                        placeholder="Enter username"
                        className={validationErrors.userName ? "border-red-500" : ""}
                      />
                      {validationErrors.userName && (
                        <p className="text-sm text-red-500">{validationErrors.userName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email"
                        className={validationErrors.email ? "border-red-500" : ""}
                      />
                      {validationErrors.email && (
                        <p className="text-sm text-red-500">{validationErrors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNum">Phone Number *</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          +251
                        </span>
                        <Input
                          id="phoneNum"
                          name="phoneNum"
                          value={formData.phoneNum}
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                          className={`rounded-l-none ${validationErrors.phoneNum ? "border-red-500" : ""}`}
                        />
                      </div>
                      {validationErrors.phoneNum && (
                        <p className="text-sm text-red-500">{validationErrors.phoneNum}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter password"
                        className={validationErrors.password ? "border-red-500" : ""}
                      />
                      {validationErrors.password && (
                        <p className="text-sm text-red-500">{validationErrors.password}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm password"
                        className={validationErrors.confirmPassword ? "border-red-500" : ""}
                      />
                      {validationErrors.confirmPassword && (
                        <p className="text-sm text-red-500">{validationErrors.confirmPassword}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select
                        name="gender"
                        value={formData.gender}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role *</Label>
                      <Select
                        name="role"
                        value={formData.role}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="student dean">Student Dean</SelectItem>
                          <SelectItem value="proctor manager">Proctor Manager</SelectItem>
                          <SelectItem value="proctor">Proctor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button type="submit" disabled={!isFormValid}>
                      Create Account
                    </Button>
                  </div>
                </form>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      

      <div className="flex flex-col w-full shadow-lg shadow-sky-900 h-full mt-6 gap-5">
        <div className="flex items-center justify-center m-6">
          <h1 className="text-xl font-semibold text-black dark:text-white place-content-center">
            List of all users
          </h1>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>First Name</TableHead>
                <TableHead>Middle Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">Loading users...</TableCell>
                </TableRow>
              ) : AllUser && AllUser.success && AllUser.data.length > 0 ? (
                AllUser.data.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{user.fName}</TableCell>
                    <TableCell>{user.mName}</TableCell>
                    <TableCell>{user.lName}</TableCell>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                        {user.status || 'active'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {/* Desktop buttons */}
                      <div className="hidden md:flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          onClick={() => handleViewUser(user)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleEditUser(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteUser(user)}
                        >
                          Delete
                        </Button>
                        <div className="flex items-center gap-4">
                          <label className="flex flex-col items-center">
                            <span className="ml-2">Activate</span>
                            <input
                              type="radio"
                              name={`status-${user._id}`}
                              value="active"
                              checked={user.status === 'active'}
                              onChange={() => handleStatusChange(user, 'active')}
                              className="w-4 h-4 align-middle mt-1"
                            />
                          </label>

                          <label className="flex flex-col items-center">
                            <span className="ml-2">Deactivate</span>
                            <input
                              type="radio"
                              name={`status-${user._id}`}
                              value="inactive"
                              checked={user.status === 'inactive'}
                              onChange={() => handleStatusChange(user, 'inactive')}
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
                            <DropdownMenuItem onClick={() => handleViewUser(user)}>
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => handleDeleteUser(user)}
                            >
                              Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <div className="flex items-center">
                                <span className="mr-2">Activate</span>
                                <input
                                  type="radio"
                                  name={`status-mobile-${user._id}`}
                                  value="active"
                                  checked={user.status === 'active'}
                                  onChange={() => handleStatusChange(user, 'active')}
                                  className="w-4 h-4"
                                />
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <div className="flex items-center">
                                <span className="mr-2">Deactivate</span>
                                <input
                                  type="radio"
                                  name={`status-mobile-${user._id}`}
                                  value="inactive"
                                  checked={user.status === 'inactive'}
                                  onChange={() => handleStatusChange(user, 'inactive')}
                                  className="w-4 h-4"
                                />
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No users found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* View User Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4">User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-4 bg-gray-50 p-4 rounded-lg">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl">{getInitials(selectedUser.fName, selectedUser.lName)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{selectedUser.fName} {selectedUser.lName}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.role}</p>
                  <Badge variant={selectedUser.status === 'active' ? 'default' : 'destructive'} className="mt-2">
                    {selectedUser.status || 'active'}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-500">First Name</Label>
                  <p className="font-medium">{selectedUser.fName}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500">Middle Name</Label>
                  <p className="font-medium">{selectedUser.mName}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500">Last Name</Label>
                  <p className="font-medium">{selectedUser.lName}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500">Username</Label>
                  <p className="font-medium">{selectedUser.userName}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500">Email</Label>
                  <p className="font-medium text-sm">{selectedUser.email}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500">Phone</Label>
                  <p className="font-medium">{selectedUser.phoneNum}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500">Role</Label>
                  <p className="font-medium">{selectedUser.role}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500">Gender</Label>
                  <p className="font-medium">{selectedUser.sex}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4">Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fName">First Name</Label>
                <Input
                  id="fName"
                  value={editFormData.fName}
                  onChange={(e) => setEditFormData({ ...editFormData, fName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mName">Middle Name</Label>
                <Input
                  id="mName"
                  value={editFormData.mName}
                  onChange={(e) => setEditFormData({ ...editFormData, mName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lName">Last Name</Label>
                <Input
                  id="lName"
                  value={editFormData.lName}
                  onChange={(e) => setEditFormData({ ...editFormData, lName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userName">Username</Label>
                <Input
                  id="userName"
                  value={editFormData.userName}
                  onChange={(e) => setEditFormData({ ...editFormData, userName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNum">Phone Number</Label>
                <Input
                  id="phoneNum"
                  value={editFormData.phoneNum}
                  onChange={(e) => setEditFormData({ ...editFormData, phoneNum: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={editFormData.role}
                  onValueChange={(value) => setEditFormData({ ...editFormData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="student dean">Student Dean</SelectItem>
                    <SelectItem value="proctor manager">Proctor Manager</SelectItem>
                    <SelectItem value="proctor">Proctor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={editFormData.gender}
                  onValueChange={(value) => setEditFormData({ ...editFormData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button type="button" variant="outline" onClick={() => setEditDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Status Change Confirmation Dialog */}
      <Dialog open={statusChangeDialog} onOpenChange={setStatusChangeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to {newStatus === 'active' ? 'activate' : 'deactivate'} {userToChangeStatus?.fName} {userToChangeStatus?.lName}'s account?
              {newStatus === 'inactive' && (
                <p className="mt-2 text-red-500 font-medium">
                  This user will not be able to access the system until their account is reactivated.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setStatusChangeDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={newStatus === 'active' ? 'default' : 'destructive'}
              onClick={confirmStatusChange}
            >
              {newStatus === 'active' ? 'Activate' : 'Deactivate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {userToDelete?.fName} {userToDelete?.lName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
