import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { useState, useRef, useEffect } from "react";
import EditAccount from "./EditAccount";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useDispatch } from "react-redux";
import { ComparePasswordAndUpdate, UpdateUser, getSingleUser } from "@/store/user-slice/userSlice";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { Camera, Eye, EyeOff, Facebook, Linkedin, Twitter, Mail, Phone, MapPin, User, Lock, Edit, ExternalLink, Check, X } from "lucide-react";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

export default function AccountPage({ ThisUser }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  console.log("AccountPage received ThisUser:", ThisUser);

  const [viewDetial, setViewDetial] = useState(false);
  const [EditDialog, setEditDialog] = useState(false);
  const [PasswordIsNotMatch, setPasswordIsNotMatch] = useState(false);
  const [addressEditDialog, setAddressEditDialog] = useState(false);
  const [profileImage, setProfileImage] = useState(ThisUser?.profileImage || "");
  const [bio, setBio] = useState(ThisUser?.bio || "");
  const [addressData, setAddressData] = useState({
    country: ThisUser?.country || "Ethiopia",
    city: ThisUser?.city || "",
    socialLinks: {
      facebook: ThisUser?.socialLinks?.facebook || "",
      twitter: ThisUser?.socialLinks?.twitter || "",
      telegram: ThisUser?.socialLinks?.telegram || "",
      linkedin: ThisUser?.socialLinks?.linkedin || ""
    }
  });

  // Update local state when ThisUser changes
  useEffect(() => {
    console.log("ThisUser changed in useEffect:", ThisUser);
    if (ThisUser) {
      setProfileImage(ThisUser.profileImage || "");
      setBio(ThisUser.bio || "");
      setAddressData({
        country: ThisUser.country || "Ethiopia",
        city: ThisUser.city || "",
        socialLinks: {
          facebook: ThisUser.socialLinks?.facebook || "",
          twitter: ThisUser.socialLinks?.twitter || "",
          telegram: ThisUser.socialLinks?.telegram || "",
          linkedin: ThisUser.socialLinks?.linkedin || ""
        }
      });
    }
  }, [ThisUser]);

  const [Password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Function to refresh user data after updates
  const refreshUserData = () => {
    if (ThisUser?._id) {
      dispatch(getSingleUser(ThisUser._id));
    }
  };

  function HandleViewDetail() {
    setViewDetial(!viewDetial);
  }

  function HandleEdit() {
    setEditDialog(!EditDialog);
  }

  function HandleAddressEdit() {
    setAddressEditDialog(!addressEditDialog);
  }

  function HandleChangePassword() {
    const id = ThisUser._id;
    if (Password.newPassword !== Password.confirmPassword) {
      setPasswordIsNotMatch(true);
      Password.confirmPassword = "";
      Password.currentPassword = "";
      Password.newPassword = "";
    } else {
      setPasswordIsNotMatch(false);
      setIsLoading(true);
      dispatch(ComparePasswordAndUpdate({ Password, id })).then((data) => {
        setIsLoading(false);
        if (data?.payload.success) {
          toast.success(`${data?.payload?.message}`, {
            duration: 3000,
            position: "top-center",
            style: {
              background: "#10B981",
              color: "white",
              borderRadius: "8px",
              padding: "16px",
            },
          });
          // Reset password fields after successful update
          setPassword({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        } else {
          toast.error(`${data?.payload?.message}`, {
            duration: 3000,
            position: "top-center",
            style: {
              background: "#EF4444",
              color: "white",
              borderRadius: "8px",
              padding: "16px",
            },
          });
        }
      });
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        
        // Update user profile with the new image
        const updatedUser = {
          ...ThisUser,
          profileImage: base64String
        };
        
        dispatch(UpdateUser({ formData: updatedUser, id: ThisUser._id })).then((data) => {
          setIsLoading(false);
          if (data?.payload?.success) {
            toast.success("Profile image updated successfully", {
              duration: 3000,
              position: "top-center",
              style: {
                background: "#10B981",
                color: "white",
                borderRadius: "8px",
                padding: "16px",
              },
            });
            // Refresh user data after successful update
            refreshUserData();
          } else {
            toast.error("Failed to update profile image", {
              duration: 3000,
              position: "top-center",
              style: {
                background: "#EF4444",
                color: "white",
                borderRadius: "8px",
                padding: "16px",
              },
            });
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const saveBio = () => {
    setIsSaving(true);
    const updatedUser = {
      ...ThisUser,
      bio: bio
    };
    
    dispatch(UpdateUser({ formData: updatedUser, id: ThisUser._id })).then((data) => {
      setIsSaving(false);
      if (data?.payload?.success) {
        toast.success("Bio updated successfully", {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#10B981",
            color: "white",
            borderRadius: "8px",
            padding: "16px",
          },
        });
        // Refresh user data after successful update
        refreshUserData();
      } else {
        toast.error("Failed to update bio", {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#EF4444",
            color: "white",
            borderRadius: "8px",
            padding: "16px",
          },
        });
      }
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setAddressData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setAddressData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const saveAddressData = () => {
    setIsSaving(true);
    const updatedUser = {
      ...ThisUser,
      country: addressData.country,
      city: addressData.city,
      socialLinks: addressData.socialLinks
    };
    
    dispatch(UpdateUser({ formData: updatedUser, id: ThisUser._id })).then((data) => {
      setIsSaving(false);
      if (data?.payload?.success) {
        toast.success("Address and contact information updated successfully", {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#10B981",
            color: "white",
            borderRadius: "8px",
            padding: "16px",
          },
        });
        setAddressEditDialog(false);
        // Refresh user data after successful update
        refreshUserData();
      } else {
        toast.error("Failed to update address and contact information", {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#EF4444",
            color: "white",
            borderRadius: "8px",
            padding: "16px",
          },
        });
      }
    });
  };

  // Function to get initials from name
  const getInitials = (fName, lName) => {
    return `${fName ? fName.charAt(0) : ''}${lName ? lName.charAt(0) : ''}`;
  };

  // Function to get status badge color
  const getStatusBadgeColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  // If ThisUser is empty or doesn't have required properties, show a loading state
  if (!ThisUser || !ThisUser._id) {
    return (
      <div className="w-full min-h-screen mt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading Profile...</h1>
          <div className="h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full min-h-screen mt-2 overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-5xl mx-auto p-6">
        <motion.h1 
          className="text-4xl font-bold text-gray-800 mb-8 text-center"
          variants={itemVariants}
        >
          My Profile
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div variants={itemVariants}>
            <Card className="md:col-span-1 shadow-lg border-0 rounded-xl overflow-hidden bg-white">
              <CardHeader className="pb-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <CardTitle className="text-xl font-semibold">Profile</CardTitle>
                <CardDescription className="text-blue-100">Your personal information</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center pt-6">
                <div className="relative mb-4 group">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                    {profileImage ? (
                      <AvatarImage src={profileImage} alt="Profile" className="object-cover" />
                    ) : (
                      <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600">
                        {getInitials(ThisUser?.fName, ThisUser?.lName)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="absolute bottom-0 right-0 rounded-full h-10 w-10 bg-white shadow-md hover:bg-blue-50 transition-colors"
                    onClick={() => fileInputRef.current.click()}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
                    ) : (
                      <Camera className="h-4 w-4 text-blue-600" />
                    )}
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
            </div>

                <h2 className="text-xl font-semibold text-gray-800">{ThisUser?.fName} {ThisUser?.lName}</h2>
                <div className="flex items-center gap-2 mt-1 mb-3">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {ThisUser?.role}
                  </Badge>
                  <Badge className={getStatusBadgeColor(ThisUser?.status || 'active')}>
                    {ThisUser?.status || 'active'}
                  </Badge>
        </div>

                <div className="w-full mt-4">
                  <Label className="text-sm font-medium text-gray-700">Bio</Label>
                  <Textarea 
                    placeholder="Tell us about yourself..." 
                    value={bio} 
                    onChange={handleBioChange}
                    className="mt-1 mb-2 resize-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                  <Button 
                    size="sm" 
                    onClick={saveBio}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Save Bio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Information */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0 rounded-xl overflow-hidden bg-white">
                <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl font-semibold">Personal Information</CardTitle>
                      <CardDescription className="text-blue-100">Your account details</CardDescription>
            </div>
                    <Button 
                      variant="outline" 
                      onClick={HandleEdit}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
              </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">First Name</Label>
                        <p className="font-medium text-gray-800">{ThisUser?.fName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Middle Name</Label>
                        <p className="font-medium text-gray-800">{ThisUser?.mName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Last Name</Label>
                        <p className="font-medium text-gray-800">{ThisUser?.lName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Email</Label>
                        <p className="font-medium text-gray-800">{ThisUser?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Username</Label>
                        <p className="font-medium text-gray-800">{ThisUser?.userName}</p>
            </div>
          </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <Phone className="h-5 w-5" />
            </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Phone</Label>
                        <p className="font-medium text-gray-800">{ThisUser?.phoneNum}</p>
            </div>
            </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <User className="h-5 w-5" />
            </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Gender</Label>
                        <p className="font-medium text-gray-800 capitalize">{ThisUser?.sex}</p>
            </div>
          </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Role</Label>
                        <p className="font-medium text-gray-800 capitalize">{ThisUser?.role}</p>
                      </div>
          </div>
        </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button 
                    variant="outline" 
                    onClick={HandleViewDetail}
                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    View All Details
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Change Password */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0 rounded-xl overflow-hidden bg-white">
                <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <CardTitle className="text-xl font-semibold">Change Password</CardTitle>
                  <CardDescription className="text-blue-100">Update your password</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-5">
          <div>
                      <Label className="text-gray-700">Current Password</Label>
                      <div className="relative mt-1">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter your current password"
                value={Password.currentPassword}
                onChange={(e) =>
                  setPassword({
                    ...Password,
                    currentPassword: e.target.value,
                  })
                }
                          className="pr-10 focus:ring-2 focus:ring-blue-500"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-0 top-0 h-full text-gray-500 hover:text-gray-700"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
            </div>
          </div>

                    <div>
                      <Label className="text-gray-700">New Password</Label>
                      <div className="relative mt-1">
              <Input
                type={showNewPassword ? "text" : "password"}
                          placeholder="Enter your new password"
                value={Password.newPassword}
                onChange={(e) =>
                  setPassword({
                    ...Password,
                    newPassword: e.target.value,
                  })
                }
                          className="pr-10 focus:ring-2 focus:ring-blue-500"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-0 top-0 h-full text-gray-500 hover:text-gray-700"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
            </div>
          </div>

                    <div>
                      <Label className="text-gray-700">Confirm Password</Label>
                      <div className="relative mt-1">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your new password"
                value={Password.confirmPassword}
                onChange={(e) =>
                  setPassword({
                    ...Password,
                    confirmPassword: e.target.value,
                  })
                }
                          className={`pr-10 focus:ring-2 ${PasswordIsNotMatch ? 'focus:ring-red-500 border-red-300' : 'focus:ring-blue-500'}`}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-0 top-0 h-full text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {PasswordIsNotMatch && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <X className="h-4 w-4" />
                          <p>Passwords do not match</p>
                        </div>
                      )}
            </div>
          </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button 
                    onClick={HandleChangePassword}
                    disabled={!Password.currentPassword || !Password.newPassword || !Password.confirmPassword || isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                    ) : (
                      <Lock className="h-4 w-4 mr-2" />
                    )}
                    Update Password
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Address & Contact */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0 rounded-xl overflow-hidden bg-white">
                <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl font-semibold">Address & Contact</CardTitle>
                      <CardDescription className="text-blue-100">Your location and social links</CardDescription>
                    </div>
            <Button
                      variant="outline" 
                      onClick={HandleAddressEdit}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
            </Button>
          </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Country</Label>
                        <p className="font-medium text-gray-800">{ThisUser?.country || "Ethiopia"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <MapPin className="h-5 w-5" />
        </div>
          <div>
                        <Label className="text-sm font-medium text-gray-500">City</Label>
                        <p className="font-medium text-gray-800">{ThisUser?.city || "Not specified"}</p>
            </div>
            </div>
          </div>

                  <Separator className="my-6" />
                  
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Social Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <Facebook className="h-5 w-5" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Facebook</Label>
                        <p className="font-medium text-gray-800">
                          {ThisUser?.socialLinks?.facebook ? (
                            <a 
                              href={ThisUser.socialLinks.facebook} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              {ThisUser.socialLinks.facebook}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            "Not specified"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <Twitter className="h-5 w-5" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Twitter</Label>
                        <p className="font-medium text-gray-800">
                          {ThisUser?.socialLinks?.twitter ? (
                            <a 
                              href={ThisUser.socialLinks.twitter} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              {ThisUser.socialLinks.twitter}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            "Not specified"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                          <path d="M21.633 10.937c-.17-.07-.35-.13-.54-.17-.19-.04-.38-.07-.58-.09-.2-.02-.4-.03-.6-.03-.2 0-.4.01-.6.03-.2.02-.39.05-.58.09-.19.04-.37.1-.54.17-.17.07-.33.15-.48.25-.15.1-.28.22-.4.35-.12.13-.22.28-.3.44-.08.16-.14.33-.18.51-.04.18-.06.37-.06.56 0 .19.02.38.06.56.04.18.1.35.18.51.08.16.18.31.3.44.12.13.25.25.4.35.15.1.31.18.48.25.17.07.35.13.54.17.19.04.38.07.58.09.2.02.4.03.6.03.2 0 .4-.01.6-.03.2-.02.39-.05.58-.09.19-.04.37-.1.54-.17.17-.07.33-.15.48-.25.15-.1.28-.22.4-.35.12-.13.22-.28.3-.44.08-.16.14-.33.18-.51.04-.18.06-.37.06-.56 0-.19-.02-.38-.06-.56-.04-.18-.1-.35-.18-.51-.08-.16-.18-.31-.3-.44-.12-.13-.25-.25-.4-.35-.15-.1-.31-.18-.48-.25z"></path>
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                        </svg>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Telegram</Label>
                        <p className="font-medium text-gray-800">
                          {ThisUser?.socialLinks?.telegram ? (
                            <a 
                              href={ThisUser.socialLinks.telegram} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              {ThisUser.socialLinks.telegram}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            "Not specified"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <Linkedin className="h-5 w-5" />
                      </div>
          <div>
                        <Label className="text-sm font-medium text-gray-500">LinkedIn</Label>
                        <p className="font-medium text-gray-800">
                          {ThisUser?.socialLinks?.linkedin ? (
                            <a 
                              href={ThisUser.socialLinks.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              {ThisUser.socialLinks.linkedin}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            "Not specified"
                          )}
                        </p>
                      </div>
                    </div>
            </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* View Detail Dialog */}
      <Dialog open={viewDetial} onOpenChange={() => HandleViewDetail()}>
        <DialogContent className="sm:max-w-[600px] bg-white rounded-xl shadow-xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">User Detail Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Label className="text-sm font-medium text-gray-500">First Name</Label>
                <p className="font-medium text-gray-800">{ThisUser?.fName}</p>
              </div>
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Label className="text-sm font-medium text-gray-500">Middle Name</Label>
                <p className="font-medium text-gray-800">{ThisUser?.mName}</p>
              </div>
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Label className="text-sm font-medium text-gray-500">Last Name</Label>
                <p className="font-medium text-gray-800">{ThisUser?.lName}</p>
              </div>
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Label className="text-sm font-medium text-gray-500">Email</Label>
                <p className="font-medium text-gray-800">{ThisUser?.email}</p>
              </div>
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Label className="text-sm font-medium text-gray-500">Username</Label>
                <p className="font-medium text-gray-800">{ThisUser?.userName}</p>
              </div>
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Label className="text-sm font-medium text-gray-500">Gender</Label>
                <p className="font-medium text-gray-800 capitalize">{ThisUser?.sex}</p>
              </div>
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Label className="text-sm font-medium text-gray-500">Role</Label>
                <p className="font-medium text-gray-800 capitalize">{ThisUser?.role}</p>
              </div>
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Label className="text-sm font-medium text-gray-500">Phone</Label>
                <p className="font-medium text-gray-800">{ThisUser?.phoneNum}</p>
              </div>
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Label className="text-sm font-medium text-gray-500">Country</Label>
                <p className="font-medium text-gray-800">{ThisUser?.country || "Ethiopia"}</p>
              </div>
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Label className="text-sm font-medium text-gray-500">City</Label>
                <p className="font-medium text-gray-800">{ThisUser?.city || "Not specified"}</p>
              </div>

              <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Label className="text-sm font-medium text-gray-500">Adress</Label>
                <p className="font-medium text-gray-800">{ThisUser?.address || "Not specified"}</p>
              </div>
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Label className="text-sm font-medium text-gray-500">Status</Label>
                <Badge className={getStatusBadgeColor(ThisUser?.status || 'active')}>
                  {ThisUser?.status || "active"}
                </Badge>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Address Edit Dialog */}
      <Dialog open={addressEditDialog} onOpenChange={() => HandleAddressEdit()}>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">Edit Address & Contact</DialogTitle>
            <DialogDescription className="text-gray-600">
              Update your location and social media links
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country" className="text-gray-700">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={addressData.country}
                  onChange={handleAddressChange}
                  placeholder="Enter your country"
                  className="mt-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="city" className="text-gray-700">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={addressData.city}
                  onChange={handleAddressChange}
                  placeholder="Enter your city"
                  className="mt-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <h3 className="text-lg font-medium text-gray-800">Social Links</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="facebook" className="text-gray-700">Facebook</Label>
                <Input
                  id="facebook"
                  name="socialLinks.facebook"
                  value={addressData.socialLinks.facebook}
                  onChange={handleAddressChange}
                  placeholder="Enter your Facebook profile URL"
                  className="mt-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="twitter" className="text-gray-700">Twitter</Label>
                <Input
                  id="twitter"
                  name="socialLinks.twitter"
                  value={addressData.socialLinks.twitter}
                  onChange={handleAddressChange}
                  placeholder="Enter your Twitter profile URL"
                  className="mt-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="telegram" className="text-gray-700">Telegram</Label>
                <Input
                  id="telegram"
                  name="socialLinks.telegram"
                  value={addressData.socialLinks.telegram}
                  onChange={handleAddressChange}
                  placeholder="Enter your Telegram username"
                  className="mt-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="linkedin" className="text-gray-700">LinkedIn</Label>
                <Input
                  id="linkedin"
                  name="socialLinks.linkedin"
                  value={addressData.socialLinks.linkedin}
                  onChange={handleAddressChange}
                  placeholder="Enter your LinkedIn profile URL"
                  className="mt-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button 
              variant="outline" 
              onClick={() => setAddressEditDialog(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button 
              onClick={saveAddressData}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Personal Information Dialog */}
      {EditDialog ? (
        <EditAccount
          ThisUser={ThisUser}
          HandleEdit={HandleEdit}
          EditDialog={EditDialog}
        />
      ) : null}
    </motion.div>
  );
}
