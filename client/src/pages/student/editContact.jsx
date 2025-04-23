import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Phone, 
  Globe, 
  MapPin, 
  Send, 
  X 
} from "lucide-react";
import { getSingleStudent, UpdateStudentByStudent } from "@/store/studentAllocation/allocateSlice";
 
const initialContactForm = {
  address: {
    country: "",
    city: "",
  },
  phoneNum: "",
  socialLinks: {
    facebook: "",
    twitter: "",
    telegram: "",
    linkedin: "",
  },
};

const socialIcons = {
  facebook: <Facebook className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
  telegram: <Send className="w-4 h-4" />,
};

export default function EditContact({ ThisStudent, HandleEdit, editDialog }) {
  const [contactFormData, setContactFormData] = useState(initialContactForm);
  const [isChanged, setIsChanged] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (ThisStudent) {
      setContactFormData({ 
        address: {
          country: ThisStudent.address?.country || "",
          city: ThisStudent.address?.city || "",
        },
        phoneNum: ThisStudent.phoneNum || "",
        socialLinks: {
          facebook: ThisStudent.socialLinks?.facebook || "",
          twitter: ThisStudent.socialLinks?.twitter || "",
          telegram: ThisStudent.socialLinks?.telegram || "",
          linkedin: ThisStudent.socialLinks?.linkedin || "",
        },
      });
    }
  }, [ThisStudent]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setContactFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setContactFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  useEffect(() => {
    const hasChanged = JSON.stringify(contactFormData) !== JSON.stringify(initialContactForm);
    setIsChanged(hasChanged);
  }, [contactFormData]);

  const handleSubmit = () => {
    dispatch(UpdateStudentByStudent({ 
      id: ThisStudent._id, 
      formData: contactFormData 
    })).then((data) => {
      if (data.payload.success) {
        toast.success(data.payload.message);
        dispatch(getSingleStudent({id:ThisStudent._id}))
        HandleEdit();
      } else {
        toast.error(data.payload.message);
      }
    });
  };

  return (
    <Dialog open={editDialog} onOpenChange={HandleEdit}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <DialogContent className="max-w-md rounded-lg h-[90vh] overflow-y-auto">
          <DialogHeader>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-between items-center"
            >
              <DialogTitle className="text-xl font-semibold text-gray-800">
                Edit Contact Information
              </DialogTitle>
              <X 
                className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={HandleEdit}
              />
            </motion.div>
          </DialogHeader>

          <DialogDescription className="space-y-4">
            <div className="space-y-4">
              {/* Country Input */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Country
                </Label>
                <Input
                  name="address.country"
                  value={contactFormData.address?.country || ""}
                  onChange={handleInputChange}
                  className="pl-8"
                />
              </div>

              {/* City Input */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  City
                </Label>
                <Input
                  name="address.city"
                  value={contactFormData.address?.city || ""}
                  onChange={handleInputChange}
                  className="pl-8"
                />
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  name="phoneNum"
                  value={contactFormData.phoneNum}
                  onChange={handleInputChange}
                  className="pl-8"
                />
              </div>

              {/* Social Links */}
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-medium text-gray-600">Social Links</h3>
                <div className="space-y-3">
                  {Object.entries(socialIcons).map(([platform, icon]) => (
                    <div key={platform} className="flex items-center gap-2">
                      <span className="text-gray-500">{icon}</span>
                      <Input
                        name={`socialLinks.${platform}`}
                        value={contactFormData.socialLinks[platform] || ""}
                        onChange={handleInputChange}
                        placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pt-4"
            >
              <Button
                onClick={handleSubmit}
                disabled={!isChanged}
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Update Contact Information
              </Button>
            </motion.div>
          </DialogDescription>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}