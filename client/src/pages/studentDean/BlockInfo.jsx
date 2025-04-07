import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlock } from "@/store/blockSlice";
import { FaArrowLeft, FaSearch } from "react-icons/fa";

const customStyles = {
  headCells: {
    style: {
      backgroundColor: "#42b3f5",
      color: "#0a0a0a",
      fontWeight: "bold",
      fontSize: "14px",
      textTransform: "uppercase",
    },
  },
  rows: {
    style: {
      "&:hover": {
        backgroundColor: "#F5DEB3",
        cursor: "pointer",
        transition: "background-color 0.2s ease-in-out",
      },
    },
  },
};

const BlockInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const [filteredBlocks, setFilteredBlocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterButtonText, setFilterButtonText] = useState(null);

  useEffect(() => {
    const getBlocks = async () => {
      setLoading(true);
      try {
        const { payload } = await dispatch(getAllBlock());
        if (payload?.data) {
          setBlocks(payload.data);
          setFilteredBlocks(payload.data);
        }
      } catch (error) {
        console.error("Error fetching blocks:", error);
      } finally {
        setLoading(false);
      }
    };
    getBlocks();
  }, [dispatch]);

  // Filter function for search input
  const filterByInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredBlocks(
      blocks.filter((block) =>
        block?.blockNum?.toString().toLowerCase().includes(query)
      )
    );
  };

  // Filter functions for buttons
  const resetFilters = () => {
    setSearchQuery("");
    setFilteredBlocks(blocks);
  };

  const filterByButton = (gender) => {
    setFilteredBlocks(
      blocks.filter((block) =>
        block.location?.toLowerCase().includes(gender.toLowerCase())
      )
    );
  };

  const columns = [
    { name: "Block Number", selector: (row) => row.blockNum, sortable: true },
    { name: "Total Capacity", selector: (row) => row.totalCapacity, sortable: true },
    { name: "Available Rooms", selector: (row) => row.totalAvailable, sortable: true },
    { name: "Location", selector: (row) => row.location, sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },
    { name: "Number of Floors", selector: (row) => row.floors.length, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => {/* Add view details handler */}}
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          View Details
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex-1 relative min-h-screen mt-2">
        <div className="p-4 pt-0 md:w-full flex flex-wrap items-center justify-between transition-all duration-300 ml-2 gap-4 left-64 w-[calc(100%-17rem)]">
          {/* Back Button */}
          <button
            className="flex items-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md transition duration-300 mr-4"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="mr-2 text-lg" /> Back
          </button>

          {/* Search Input */}
          <div className="relative flex items-center w-72 md:w-1/3 mr-4">
            <FaSearch className="absolute left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search by Block Number"
              className="h-10 px-4 py-2 border border-gray-300 rounded-md w-full pl-10"
              value={searchQuery}
              onChange={filterByInput}
            />
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Block List</h2>

          {/* Filter Buttons */}
          <div className="flex justify-end space-x-2 mb-4">
            <button
              className={`${filterButtonText === "All" ? "bg-blue-600" : "bg-gray-600"} px-3 py-1 text-white rounded-md hover:opacity-50`}
              onClick={() => {
                resetFilters();
                setFilterButtonText("All");
              }}
            >
              All
            </button>
            <button
              className={`${filterButtonText === "Male" ? "bg-blue-600" : "bg-blue-500"} px-3 py-1 text-white rounded-md hover:opacity-50`}
              onClick={() => {
                filterByButton("Male");
                setFilterButtonText("Male");
              }}
            >
              Male Blocks
            </button>
            <button
              className={`${filterButtonText === "Female" ? "bg-blue-600" : "bg-pink-500"} px-3 py-1 text-white rounded-md hover:opacity-50`}
              onClick={() => {
                filterByButton("Female");
                setFilterButtonText("Female");
              }}
            >
              Female Blocks
            </button>
          </div>

          {loading ? (
            <div className="text-center text-gray-600">Loading Blocks...</div>
          ) : (
            <div className="overflow-x-auto">
              <DataTable
                columns={columns}
                data={filteredBlocks}
                pagination
                customStyles={customStyles}
                highlightOnHover
                striped
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockInfo; 