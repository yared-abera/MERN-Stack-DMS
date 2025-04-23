 import BlockInformations from "@/components/common/BlockInformation";
 import { getAllBlock } from "@/store/blockSlice";

 import { useEffect, useState } from "react";
 import { useDispatch, useSelector } from "react-redux";
 
 export default function ManagerDashBoard() {
    const { AllBlock,isLoading } = useSelector((state) => state.block);
     const { user } = useSelector((state) => state.auth);
     const [ThisCategoryBlock, setThisCategoryBlock] = useState([]);
     const dispatch = useDispatch();
 
     useEffect(() => {
       dispatch(getAllBlock());
     }, [dispatch]);
   
     useEffect(() => {
       if (
         AllBlock &&
         AllBlock.success &&
         AllBlock.data &&
         AllBlock.data.length > 0
       ) {
         const userGender = user?.sex; // Use optional chaining
         // Handle cases where userGender might be undefined or null
         if (!userGender) {
            console.warn("User gender is not available.");
            setThisCategoryBlock([]); // Set to empty if gender is missing
            return;
         }
   
         const BlockLocation =
           userGender.toUpperCase() === "MALE" ? "maleArea" : "femaleArea";
         const filterdBlock = AllBlock.data.filter(
           (block) => block.location === BlockLocation
         );
         setThisCategoryBlock(filterdBlock);
       } else {
           // Set to empty array if no data or data is invalid
           setThisCategoryBlock([]);
       }
     }, [AllBlock]); // Added user.sex to dependencies
   
   
   return <div className="bg-green-400/10">
     {ThisCategoryBlock&&ThisCategoryBlock.length>0&&<BlockInformations ThisCategoryBlock={ThisCategoryBlock} isLoading={isLoading}/>}
   </div>;
 }
 

 