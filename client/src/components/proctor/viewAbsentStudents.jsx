export default function AbsentStudentOnProctor({ absentStudent }) {
    console.log(absentStudent, "absentStudent prop received");
  
    // Helper function to format an ISO date string to local date string
    const formatLocalAbsenceDate = (dateString) => {
      if (!dateString) return ''; // Return empty string for invalid or null input
  
      try {
        // Create a Date object from the ISO string
        const date = new Date(dateString);
  
        // Check if the date object is valid
        if (isNaN(date.getTime())) {
          console.warn("Invalid date string received:", dateString);
          return 'Invalid Date'; // Or some other indicator
        }
  
        // Use toLocaleDateString() to get the local date part (e.g., 4/18/2025)
        // You can pass options for specific formatting if needed, but this gives the default local format.
        return date.toLocaleDateString();
  
      } catch (error) {
        console.error("Error formatting date:", dateString, error);
        return 'Error'; // Handle parsing errors
      }
    };
  
    return (
      <div className="w-full min-h-screen overflow-hidden ">
        <div className="flex  flex-col gap-2 ">
          <div>
            <h1>Recently Absent Students</h1>
          </div>
          <div className="w-full flex flex-wrap">
            {Array.isArray(absentStudent) && absentStudent.length > 0 ? (
              absentStudent.map((stud, index) => (
                <div key={index} className="py-5 px-8 border-solid border-2 border-t-zinc-700/25 shadow-md bg-slate-400  rounded-md m-2">
                   <p><span>First Name :</span> <span>{stud.Fname}</span></p>
                   <p><span>Middle Name :</span> <span>{stud.Mname}</span></p>
                   <p><span>Last Name :</span> <span>{stud.Lname}</span></p>
                   <p><span>User name :</span> <span>{stud.Fname}</span></p> {/* Assuming UserName is Fname based on your code */}
                   <p><span>Number of Absent :</span> <span>{stud.absenceDates ? stud.absenceDates.length : 0}</span></p>
  
            
                   <p>
                     {/* Removed the "Absent Date(s) :" span */}
                     <span>
                       {/* Check if absenceDates is an array and has items */}
                       {Array.isArray(stud.absenceDates) && stud.absenceDates.length > 0
                         ? // Map each date string to a formatted local date string
                           // Then join the results with a comma and space
                           stud.absenceDates.map(formatLocalAbsenceDate).join(', ')
                         : 'No absences' // Display this if no dates are available
                       }
                     </span>
                   </p>
                   {/* --- END MODIFIED SECTION --- */}
  
                </div>
              ))
            ) : (
              <p>No absent students found.</p>
            )}
          </div>
        </div>
      </div>
    );
  }