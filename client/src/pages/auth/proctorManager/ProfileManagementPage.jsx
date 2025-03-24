
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const ProfileManagement = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Management</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input placeholder="Name" />
            <Input placeholder="Email" />
            <Input type="password" placeholder="Password" />
            <Button type="submit">Update Profile</Button>
          </form>
        </CardContent>
      </Card>
    );
  };

  export default ProfileManagement

 