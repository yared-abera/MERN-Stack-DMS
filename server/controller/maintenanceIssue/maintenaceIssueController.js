const MaintenanceIssue = require('../../model/maintenance/index');

const SubmitMaintenanceIssue = async (req, res) => {
    try {
        const { userInfo, issueTypes, description, otherIssue } = req.body;

        // Validate required fields
        if (!userInfo || !issueTypes || !description) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Convert issueTypes object to array of selected issues
        const selectedIssues = Object.entries(issueTypes)
            .filter(([_, value]) => value === true)
            .map(([key]) => key);

        // Add otherIssue if provided and not empty
        if (otherIssue && otherIssue.trim()) {
            selectedIssues.push(otherIssue.trim());
        }

        // Create new maintenance issue document
        const newIssue = new MaintenanceIssue({
            userInfo: {
                fName: userInfo.Fname,
                mName: userInfo.Mname,
                lName: userInfo.Lname,
                userName: userInfo.id,
                blockNumber: userInfo.block,
                roomNumber: userInfo.dorm,
                phoneNumber: userInfo.phoneNumber
            },
            issueTypes: selectedIssues,
            description: description
        });

        // Save to database
        await newIssue.save();

        res.status(201).json({ 
            success:true,
            message: 'Maintenance issue submitted successfully',
            issue: newIssue
        });

    } catch (error) {
        console.error('Error submitting maintenance issue:', error);
        res.status(500).json({ 
            message: 'Failed to submit maintenance issue',
            error: error.message 
        });
    }
};


const fetchAllMaintenanceIssue=async(req,res)=>{
    try {
       const allMaintenanceIssue = await MaintenanceIssue.find();
       res.status(200).json({
         success: true,
         data: allMaintenanceIssue,
       });
     } catch (error) {
       console.error("Error fetching all MaintenanceIssue:", error);
       res.status(500).json({
         success: false,
         message: "Server error, please try again later.",
         error: error.message,
       });
     }
}

module.exports = { SubmitMaintenanceIssue ,fetchAllMaintenanceIssue};