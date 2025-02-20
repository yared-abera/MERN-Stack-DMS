import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const RegisterBlock = () => {
  


    return (
      <Card>
        <CardHeader>
          <CardTitle>Register Block</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input placeholder="Block Name" />
            <Input placeholder="Location" />
            <Input type="number" placeholder="Capacity" />
            <Button type="submit">Register Block</Button>
          </form>
        </CardContent>
      </Card>
    );
  };

  export default RegisterBlock;
 