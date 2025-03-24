import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllBlock } from "@/store/blockSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function StudentDeanBlockInfo() {
const dispatch=useDispatch()
  useEffect(()=>{
  dispatch(getAllBlock())
  },[dispatch])
  const {AllBlock}=useSelector(state=>state.block)

  console.log(AllBlock);
  

function getProctor(){

}
  
  return (
    <div className="mt-20 w-full min-h-screen   flex flex-col gap-2">
      <div className="flex flex-col h-auto p-3 md:py-5">
        <h1 className="text-center text-lg md:text-xl fon-bold my-2 md:my-4">
          List of All Blocks
        </h1>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Block Number</TableHead>
              <TableHead>Total capacity</TableHead>
              <TableHead>Available Room</TableHead>
              <TableHead>Found In</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Number Of Floor</TableHead>
             
              
              <TableHead >Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {
              AllBlock.data.map((block)=><TableRow key={block._id}>

              <TableCell>{block.blockNum}</TableCell>
              
              <TableCell>{block.totalCapacity}</TableCell>
              <TableCell>{block.totalAvailable}</TableCell>
              <TableCell>{block.location}</TableCell>
              <TableCell> {block.status}</TableCell>
              <TableCell> {block.floors.length}</TableCell>

              
              <TableCell>
              <Button variant="outline">View Detail</Button>
              </TableCell>

              </TableRow>)
            }
          
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
