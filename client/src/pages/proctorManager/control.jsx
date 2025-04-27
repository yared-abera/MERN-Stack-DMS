import ControlComponentCard from "@/components/common/controlComponentCard";
import { Button } from "@/components/ui/button";
// Assuming getAllControlIssues is correctly defined in this slice
import { getAllControlIssues } from "@/store/control/controlSclice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ManagerControl() {
  // Selectors
  const { user } = useSelector((state) => state.auth);
  // Assuming allIssues is structured like: [{ student: { sex: 'M' }, Allissues: [{ id: 1, status: 'open', ... }, ...] }, ...]
  const { allIssues, isLoading } = useSelector((state) => state.control);

  // State
  const [selectedOption, setSelectedOption] = useState("All");
  // This state will hold the final list of individual issue objects to be displayed
  const [filteredIndividualIssues, setFilteredIndividualIssues] = useState([]);
  const dispatch = useDispatch();

  // Safely get user gender
  const userGender = user?.sex;

  // Effect to fetch data on mount or when dispatch changes
  useEffect(() => {
    // Consider adding user.id to dependency if the API requires it
    dispatch(getAllControlIssues());
  }, [dispatch]); // Only depends on dispatch unless API needs user specifics

 console.log(allIssues, "allIssues");
 
  useEffect(() => {
   
    if(allIssues&&allIssues.data&&allIssues.data.length>0&&allIssues.success){
      const issuesForMatchingGender = allIssues.data.filter(
        (issueGroup) => issueGroup.student?.sex.toUpperCase() === userGender.toUpperCase()
      );
      
    
      if (selectedOption === "All") {
        setFilteredIndividualIssues(issuesForMatchingGender);
      } else {
        // Use map to iterate through each main issue (parent object)
        const filteredIssuesWithParentData = issuesForMatchingGender
          .map(individualIssue => {
            // Add a safety check in case Allissues is null or undefined
            const issuesArray = individualIssue.Allissues || [];
      
            // Filter the nested Allissues array for the current parent issue
            const filteredInnerIssues = issuesArray.filter(
              s => s.status === selectedOption
            );
      
            // If there are any matching specific issues within this parent...
            if (filteredInnerIssues.length > 0) {
    
              return {
                ...individualIssue, // This includes _id, student, proctor, etc.
                Allissues: filteredInnerIssues // Replace the original Allissues with the filtered array
              };
            } else {
            
              return null;
            }
          })
          // Filter out any parent issues that resulted in null (because they had no matching specific issues)
          .filter(issue => issue !== null);
      
        setFilteredIndividualIssues(filteredIssuesWithParentData);
      }
    }

    // 1. Filter the main list by student gender first
   

    // Dependencies: This effect should re-run if the filter criteria or the data changes
  }, [selectedOption]); // Added allIssues and userGender
    
   console.log(filteredIndividualIssues, "filteredIndividualIssues");
   
   
  if (isLoading) return <p>Loading please wait ...</p>;
  // Handle case where user data might still be loading, although isLoading might cover this
  if (!user) return <p>Loading user data...</p>

  return (
    <div className="overflow-hidden bg-sky-100/100 min-h-screen p-4"> {/* Added padding */}
      <div className="flex flex-col gap-4 w-full mt-4"> {/* Increased gap */}
       
        <div className="flex justify-end w-[85%] gap-2 ml-auto"> {/* Ensure right alignment */}
          {/* Use variant prop (if available) to show active filter */}
          <Button
            onClick={() => setSelectedOption("All")}
            variant={selectedOption === 'All' ? 'default' : 'outline'}
          >
            All   {/* Display gender for clarity */}
          </Button>
          <Button
            onClick={() => setSelectedOption("open")}
            variant={selectedOption === 'open' ? 'default' : 'outline'}
          >
            Open
          </Button>
          <Button
            onClick={() => setSelectedOption("closed")}
            variant={selectedOption === 'closed' ? 'default' : 'outline'}
          >
            Closed
          </Button>
          <Button
            onClick={() => setSelectedOption("InProgress")}
            variant={selectedOption === 'InProgress' ? 'default' : 'outline'}
           >
            In Progress
          </Button>
        </div>

        {/* Display Area for Filtered Issues */}
        
         <ControlComponentCard filteredIndividualIssues={filteredIndividualIssues} /> 
      </div>
    </div>
  );
}