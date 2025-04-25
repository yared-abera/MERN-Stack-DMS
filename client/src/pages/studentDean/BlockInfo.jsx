// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import DataTable from "react-data-table-component";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllBlock } from "@/store/blockSlice";
// import { FaArrowLeft, FaSearch } from "react-icons/fa";
// import { getAllUser } from "@/store/user-slice/userSlice";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

import BlockInformations from "@/components/common/BlockInformation";
import { getAllBlock } from "@/store/blockSlice";
import { data } from "autoprefixer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// const customStyles = {
//   headCells: {
//     style: {
//       backgroundColor: "#42b3f5",
//       color: "#0a0a0a",
//       fontWeight: "bold",
//       fontSize: "14px",
//       textTransform: "uppercase",
//     },
//   },
//   rows: {
//     style: {
//       "&:hover": {
//         backgroundColor: "#F5DEB3",
//         cursor: "pointer",
//         transition: "background-color 0.2s ease-in-out",
//       },
//     },
//   },
// };

// const BlockInfo = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [blocks, setBlocks] = useState([]);
//   const [filteredBlocks, setFilteredBlocks] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [filterButtonText, setFilterButtonText] = useState(null);
//   const [selectedBlock, setSelectedBlock] = useState(null);
//   const [showBlockDetails, setShowBlockDetails] = useState(false);
//   const { AllUser } = useSelector((state) => state.allUser);
//   const [assignedProctorsInfo, setAssignedProctorsInfo] = useState([]);

//   useEffect(() => {
//     const getBlocks = async () => {
//       setLoading(true);
//       try {
//         const { payload } = await dispatch(getAllBlock());
//         if (payload?.data) {
//           setBlocks(payload.data);
//           setFilteredBlocks(payload.data);
//         }
//       } catch (error) {
//         console.error("Error fetching blocks:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     dispatch(getAllUser());
//     getBlocks();
//   }, [dispatch]);

//   console.log(AllUser, "AllUser");

//   // Filter function for search input
//   const filterByInput = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearchQuery(query);
//     setFilteredBlocks(
//       blocks.filter((block) =>
//         block?.blockNum?.toString().toLowerCase().includes(query)
//       )
//     );
//   };

//   // Filter functions for buttons
//   const resetFilters = () => {
//     setSearchQuery("");
//     setFilteredBlocks(blocks);
//   };

//   const filterByButton = (gender) => {
//     setFilteredBlocks(
//       blocks.filter((block) =>
//         block.location?.toLowerCase().includes(gender.toLowerCase())
//       )
//     );
//   };

//   const columns = [
//     { name: "Block Number", selector: (row) => row.blockNum, sortable: true },
//     {
//       name: "Total Capacity",
//       selector: (row) => row.totalCapacity,
//       sortable: true,
//     },
//     {
//       name: "Available Rooms",
//       selector: (row) => row.totalAvailable,
//       sortable: true,
//     },
//     { name: "Location", selector: (row) => row.location, sortable: true },
//     { name: "Status", selector: (row) => row.status, sortable: true },
//     {
//       name: "Number of Floors",
//       selector: (row) => row.floors.length,
//       sortable: true,
//     },
//     {
//       name: "Actions",
//       cell: (row) => (
//         <button
//           onClick={() => {
//             setSelectedBlock(row);
//             setShowBlockDetails(true);
//           }}
//           className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//         >
//           View Details
//         </button>
//       ),
//     },
//   ];

//   useEffect(() => {
//     if (AllUser?.success && selectedBlock) {
//       // If your IDs are strings:
//       // const assigned = AllUser.data.filter(user =>
//       //   selectedBlock.assignedProctors.includes(user._id)
//       // );

//       //If they’re Mongoose ObjectIds (or mixed), compare as strings:
//       const assigned = AllUser.data.filter((user) =>
//         selectedBlock.assignedProctors.some(
//           (id) => id.toString() === user._id.toString()
//         )
//       );

//       setAssignedProctorsInfo(assigned);
//     }
//   }, [selectedBlock, showBlockDetails]);

//   console.log(filteredBlocks, "filteredBlocks");

//   return (
//     <div className="flex flex-col overflow-x-hidden">
//       <div className="flex-1 relative min-h-screen mt-2">
//         <div className="p-4 pt-0 md:w-[90%] flex flex-wrap items-center justify-between transition-all duration-300 ml-2 gap-4 left-64 w-[calc(100%-17rem)]">
//           {/* Back Button */}
//           <button
//             className="flex items-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md transition duration-300 mr-4"
//             onClick={() => navigate(-1)}
//           >
//             <FaArrowLeft className="mr-2 text-lg" /> Back
//           </button>

//           {/* Search Input */}
//           <div className="relative flex items-center w-72 md:w-1/3 mr-4">
//             <FaSearch className="absolute left-3 text-gray-500" />
//             <input
//               type="text"
//               placeholder="Search by Block Number"
//               className="h-10 px-4 py-2 border border-gray-300 rounded-md w-full pl-10"
//               value={searchQuery}
//               onChange={filterByInput}
//             />
//           </div>
//         </div>

//         <div className="p-6 ">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Block List</h2>

//           {/* Filter Buttons */}
//           <div className="flex justify-end space-x-2 mb-4 w-[100%]">
//             <button
//               className={`${
//                 filterButtonText === "All" ? "bg-blue-600" : "bg-gray-600"
//               } px-3 py-1 text-white rounded-md hover:opacity-50`}
//               onClick={() => {
//                 resetFilters();
//                 setFilterButtonText("All");
//               }}
//             >
//               All
//             </button>
//             <button
//               className={`${
//                 filterButtonText === "Male" ? "bg-blue-600" : "bg-blue-500"
//               } px-3 py-1 text-white rounded-md hover:opacity-50`}
//               onClick={() => {
//                 filterByButton("Male");
//                 setFilterButtonText("Male");
//               }}
//             >
//               Male Blocks
//             </button>
//             <button
//               className={`${
//                 filterButtonText === "Female" ? "bg-blue-600" : "bg-pink-500"
//               } px-3 py-1 text-white rounded-md hover:opacity-50`}
//               onClick={() => {
//                 filterByButton("Female");
//                 setFilterButtonText("Female");
//               }}
//             >
//               Female Blocks
//             </button>
//           </div>

//           {loading ? (
//             <div className="text-center text-gray-600">Loading Blocks...</div>
//           ) : (
//             <div className="flex flex-col mx-auto" >
//               <DataTable className="max-w-4xl flex mx-auto"
//                 columns={columns}
//                 data={filteredBlocks}
//                 pagination
//                 customStyles={customStyles}
//                 highlightOnHover
//                 striped
//               />
//             </div>
//           )}
//         </div>
//       </div>
//       {showBlockDetails && selectedBlock && (
//   <Dialog open={showBlockDetails} onOpenChange={setShowBlockDetails}>
//     <DialogContent className="max-w-2xl h-screen overflow-y-auto">
//       <DialogHeader>
//         <DialogTitle className="text-2xl font-bold">Block Details</DialogTitle>
//       </DialogHeader>
//       <DialogDescription  >
//         <div className="space-y-6">
//           {/* Block Summary */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg shadow">
//             <p>
//               <span className="font-semibold">Block Number:</span>{" "}
//               {selectedBlock.blockNum}
//             </p>
//             <p>
//               <span className="font-semibold">Total Capacity:</span>{" "}
//               {selectedBlock.totalCapacity}
//             </p>
//             <p>
//               <span className="font-semibold">Available Rooms:</span>{" "}
//               {selectedBlock.totalAvailable}
//             </p>
//             <p>
//               <span className="font-semibold">Location:</span>{" "}
//               {selectedBlock.location}
//             </p>
//             <p>
//               <span className="font-semibold">Status:</span>{" "}
//               {selectedBlock.status}
//             </p>
//             <p>
//               <span className="font-semibold">Floors:</span>{" "}
//               {selectedBlock.floors.length}
//             </p>
//             <p className="sm:col-span-2">
//               <span className="font-semibold">Assigned Proctors:</span>{" "}
//               {assignedProctorsInfo.map((p) => p.name).join(", ") || "—"}
//             </p>
//           </div>

//           {/* Floor Details */}
//           <div>
//             <h2 className="text-xl font-semibold mb-3">Floor Details</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {selectedBlock.floors.map((floor) => (
//                 <div
//                   key={floor._id}
//                   className="p-4 border rounded-lg shadow-sm bg-white"
//                 >
//                   <p>
//                     <span className="font-medium">Floor Number:</span>{" "}
//                     {floor.floorNumber}
//                   </p>
//                   <p>
//                     <span className="font-medium">Capacity:</span>{" "}
//                     {floor.floorCapacity}
//                   </p>
//                   <p>
//                     <span className="font-medium">Available:</span>{" "}
//                     {floor.totalAvailable}
//                   </p>
//                   <p>
//                     <span className="font-medium">Status:</span>{" "}
//                     {floor.floorStatus}
//                   </p>
//                   <p>
//                     <span className="font-medium">Dorms:</span>{" "}
//                     {floor.dorms.length}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </DialogDescription>
//     </DialogContent>
//   </Dialog>
// )}

//     </div>
//   );
// };

// export default BlockInfo;

export default function BlockInfo() {
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
        // const userGender = user?.sex; // Use optional chaining
        // // Handle cases where userGender might be undefined or null
        // if (!userGender) {
        //    console.warn("User gender is not available.");
        //    setThisCategoryBlock([]); // Set to empty if gender is missing
        //    return;
        // }
  
        // const BlockLocation =
        //   userGender.toUpperCase() === "MALE" ? "maleArea" : "femaleArea";
        // const filterdBlock = AllBlock.data.filter(
        //   (block) => block.location === BlockLocation
        // );
        setThisCategoryBlock(AllBlock.data);
      } else {
          // Set to empty array if no data or data is invalid
          setThisCategoryBlock([]);
      }
    }, [AllBlock]); // Added user.sex to dependencies
  
  
  return <div>
    {ThisCategoryBlock&&ThisCategoryBlock.length>0&&<BlockInformations ThisCategoryBlock={ThisCategoryBlock} isLoading={isLoading}/>}
  </div>;
}
