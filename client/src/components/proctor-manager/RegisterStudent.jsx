import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const RegisterStudent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Student</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <Input placeholder="Student Name" />
          <Input placeholder="Student ID" />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Block" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="block1">Block 1</SelectItem>
              <SelectItem value="block2">Block 2</SelectItem>
            </SelectContent>
          </Select>
          <Input type="number" placeholder="Room Number" />
          <Button type="submit">Register Student</Button>
        </form>
      </CardContent>
    </Card>
  );
};