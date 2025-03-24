import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
 

 const  GenerateReport = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Block" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="block1">Block 1</SelectItem>
                <SelectItem value="block2">Block 2</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" placeholder="Start Date" />
            <Input type="date" placeholder="End Date" />
            <Button>Download Report</Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  export default GenerateReport;

  