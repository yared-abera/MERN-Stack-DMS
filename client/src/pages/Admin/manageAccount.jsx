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
import { AlertCircle, CheckCircle2, Search, Plus, Filter, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ManageAccount() {
  const [formData, setFormData] = useState({
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
  });
  const { isLoading, AllUser, selectedUser } = useSelector((state) => state.allUser);
  const [viewDialog, setViewDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [statusChangeDialog, setStatusChangeDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToChangeStatus, setUserToChangeStatus] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [editFormData, setEditFormData] = useState({
    fName: "",
    mName: "",
    lName: "",
    email: "",
    userName: "",
    phoneNum: "",
  gender: "",
  role: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState("all");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch all users when component mounts
    dispatch(getAllUser());
  }, [dispatch]);
console.log(AllUser,"allUser")
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

  // Filter users based on search query and filters
  useEffect(() => {
    if (AllUser && AllUser.success && AllUser.data) {
      let filtered = [...AllUser.data];
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(user => 
          user.fName?.toLowerCase().includes(query) ||
          user.lName?.toLowerCase().includes(query) ||
          user.userName?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.role?.toLowerCase().includes(query)
        );
      }
      
      // Apply role filter
      if (filterRole !== "all") {
        filtered = filtered.filter(user => user.role === filterRole);
      }
      
      // Apply status filter
      if (filterStatus !== "all") {
        filtered = filtered.filter(user => (user.status || "active") === filterStatus);
      }
      
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [AllUser, searchQuery, filterRole, filterStatus]);

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
        setFormData({
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
        });
      } else {
        toast.error(data.payload?.message || "Error creating user");
      }
    });
  };


  console.log(formData,"formDtaa");
  console.log(filterRole,"filterRole");
  
  
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

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    if (type === 'role') {
      setFilterRole(value);
    } else if (type === 'status') {
      setFilterStatus(value);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilterRole("all");
    setFilterStatus("all");
  };

  // Refresh user list
  const refreshUserList = () => {
    dispatch(getAllUser());
    toast.success("User list refreshed");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen w-full p-4 flex flex-col mt-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto w-[90%]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-[80%] mb-6  gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-500">Manage user accounts and permissions</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={refreshUserList}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden md:inline">Refresh</span>
            </Button>
        <Sheet>
              <SheetTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Create Account</span>
                </Button>
          </SheetTrigger>
          <SheetContent
                className="w-[400px] sm:w-[540px] overflow-auto"
            side="right"
          >
            <SheetHeader>
                  <SheetTitle className="font-bold text-xl text-gray-800 mb-4">
                    Create New Account
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
                              <SelectItem value="studentDean">StudentDean</SelectItem>
                              <SelectItem value="proctorManager">ProctorManager</SelectItem>
                              <SelectItem value="proctor">Proctor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end mt-6">
                        <Button type="submit" disabled={!isFormValid} className="bg-blue-600 hover:bg-blue-700">
                          Create Account
                        </Button>
                      </div>
                    </form>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
        </div>
 
        <Card className="mb-6 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle>User Search & Filters</CardTitle>
            <CardDescription>Find users by name, email, or role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterRole} onValueChange={(value) => handleFilterChange('role', value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                  
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="studentDean">StudentDean</SelectItem>
                    <SelectItem value="proctorManager">ProctorManager</SelectItem>
                    <SelectItem value="proctor">Proctor</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  className="flex items-center gap-1"
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden md:inline">Reset</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full max-w-md mb-4">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>User Accounts</CardTitle>
                <CardDescription>
                  {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Username</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span className="ml-2">Loading users...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                                {getInitials(user.fName, user.lName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div>{user.fName} {user.lName}</div>
                              <div className="text-xs text-gray-500">{user.mName}</div>
                            </div>
                          </div>
                        </TableCell>
                  <TableCell>{user.userName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.role}
                          </Badge>
                        </TableCell>
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
                              size="sm"
                              onClick={() => handleViewUser(user)}
                            >
                              View
                            </Button>
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(user)}
                            >
                              Delete
                            </Button>
                            <div className="flex items-center gap-2">
                              <Button
                                variant={user.status === 'active' ? 'outline' : 'default'}
                                size="sm"
                                onClick={() => handleStatusChange(user, user.status === 'active' ? 'inactive' : 'active')}
                              >
                                {user.status === 'active' ? 'Deactivate' : 'Activate'}
                              </Button>
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
                                <DropdownMenuItem onClick={() => handleStatusChange(user, user.status === 'active' ? 'inactive' : 'active')}>
                                  {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <Search className="h-12 w-12 mb-2 text-gray-300" />
                          <p>No users found matching your criteria</p>
                          <Button 
                            variant="link" 
                            onClick={resetFilters}
                            className="mt-2"
                          >
                            Reset filters
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
            </TableBody>
          </Table>
        </div>
          </CardContent>
        </Card>
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
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500">Phone</Label>
                  <p className="font-medium">{selectedUser.phoneNum}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500">Role</Label>
                  <p className="font-medium capitalize">{selectedUser.role}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500">Gender</Label>
                  <p className="font-medium capitalize">{selectedUser.sex}</p>
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
                    <SelectItem value="studentDean">StudentDean</SelectItem>
                    <SelectItem value="proctorManager">ProctorManager</SelectItem>
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
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
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
