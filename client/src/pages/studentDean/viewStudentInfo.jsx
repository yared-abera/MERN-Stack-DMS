
import TableInfo from "@/components/studentDean/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StudentInfo() {
  return (
    <div className="overflow-hidden w-full min-h-screen mt-24  ">
      <div className="m-3 p-2 shadow-lg shadow-sky-950 dark:shadow-white border-solid">
        <div className="flex place-content-center">
          <h1 className="text-2xl font-bold mb-3">Student Information</h1>
        </div>

        <div className="flex  justify-center">
          <Tabs defaultValue="account" className="w-full   min-h-screen  ">
            <TabsList className=' w-full place-content-center sm:my-3 md:my-6  '>
              <TabsTrigger value="account" >Remadial</TabsTrigger>
              <TabsTrigger value="password" className='md:m-2'>Freash</TabsTrigger>
              <TabsTrigger value="senior">After Having Department</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
               <TableInfo studType='remadial'/>
            </TabsContent>
            <TabsContent value="password">
            <TableInfo studType='freash'/>
            </TabsContent>
            <TabsContent value="senior">
            <TableInfo studType='senior'/>
            </TabsContent>
          </Tabs>
        </div>

        
      </div>
    </div>
  );
}
{/**<Table>
          
        </Table> */}