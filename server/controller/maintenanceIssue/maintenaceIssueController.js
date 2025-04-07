const MaintenanceIssue = require("../../model/maintenance/index");
const Block = require("../../model/block/index");
const SubmitMaintenanceIssue = async (req, res) => {
  try {
    const { id, Model, userInfo, issueTypes, description, otherIssue } =
      req.body;

    // Validate required fields (add your validations here)

    // Convert issueTypes object to array of selected issues
    const selectedIssues = Object.entries(issueTypes)
      .filter(([_, value]) => value === true)
      .map(([key]) => key);

    // Add otherIssue if provided and not empty
    if (otherIssue && otherIssue.trim()) {
      selectedIssues.push(otherIssue.trim());
    }

    // Map selectedIssues to the array of objects required by the schema
    const mappedIssues = selectedIssues.map((issue) => ({
      issue,
      status: "Pending",
      description: description,
    }));

    // Check if the user already submitted a maintenance issue
    const existingIssue = await MaintenanceIssue.findOne({ userId: id });

    if (existingIssue) {
      // Update only the issueTypes
      existingIssue.issueTypes.push(...mappedIssues);

      await existingIssue.save();

      return res.status(201).json({
        success: true,
        message: "Maintenance issue submitted successfully",
        issue: existingIssue,
      });
    } else {
      // Create a new maintenance issue document
      const newIssue = new MaintenanceIssue({
        userId: id,
        userModel: Model,
        userInfo: {
          fName: userInfo.Fname,
          mName: userInfo.Mname,
          lName: userInfo.Lname,
          sex: userInfo.Gender,
          userName: userInfo.userName,
          blockNumber: userInfo.block,
          roomNumber: userInfo.dorm,
          phoneNumber: userInfo.phoneNumber,
        },
        issueTypes: mappedIssues,
      });

      // Save the new document to the database
      await newIssue.save();

      return res.status(201).json({
        success: true,
        message: "Maintenance issue submitted successfully",
        issue: newIssue,
      });
    }
  } catch (error) {
    console.error("Error submitting maintenance issue:", error);
    res.status(500).json({
      message: "Failed to submit maintenance issue",
      error: error.message,
    });
  }
};

const fetchAllMaintenanceIssueForManager = async (req, res) => {
  try {
    const { gender } = req.params;

    // 1. Find documents with matching gender (case-insensitive)
    const issues = await MaintenanceIssue.find({
      "userInfo.sex": { $regex: new RegExp(`^${gender}$`, "i") },
    }).lean(); // Use lean() for better performance with plain JS objects

    // 2. Filter and transform the results
    const filteredData = issues
      .map((issue) => ({
        ...issue,
        issueTypes: issue.issueTypes.filter(
          (type) => !["Pending", "Reject"].includes(type.status)
        ),
      }))
      .filter((issue) => issue.issueTypes.length > 0); // Remove empty issues

    res.status(200).json({
      success: true,
      data: filteredData,
    });
  } catch (error) {
    console.error("Error fetching maintenance issues:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const fetchAllMaintenanceIssueForDean = async (req, res) => {
  try {
    const allIssues = await MaintenanceIssue.find();

    // Optionally, check if no issues were found (i.e., empty array)
    if (allIssues.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No Data Found',
      });
    }

    // Send success response if data is found
    return res.status(200).json({
      success: true,
      data: allIssues,
    });
    
  } catch (error) {
    console.error("Error fetching all maintenance issues:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const fetchMaintenanceIssueForUser = async (req, res) => {
  try {
    const { id, Model } = req.params;

    const userMaintenanceIssue = await MaintenanceIssue.findOne({
      userId: id,
      userModel: Model,
    });

    res.status(200).json({
      success: true,
      data: userMaintenanceIssue,
    });
  } catch (error) {
    console.error("Error fetching MaintenanceIssue:", error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
      error: error.message,
    });
  }
};

const fetchPendingStatusMaintenanceIssue = async (req, res) => {
  try {
    const { status, id } = req.params; // status e.g., "Pending", and proctor id
    // Find the block where the proctor is assigned
    const block = await Block.findOne({ assignedProctors: { $in: [id] } });
    if (!block) {
      return res.json({
        success: false,
        message: "No block found for this proctor",
      });
    }

    const blockNumber = block.blockNum;

    // Query MaintenanceIssue documents and filter the issueTypes array using $filter
    const maintenanceIssues = await MaintenanceIssue.find(
      {
        "issueTypes.status": status,
        "userInfo.blockNumber": blockNumber,
      },
      {
        // Use $filter to include only those subdocuments with the matching status
        issueTypes: {
          $filter: {
            input: "$issueTypes",
            as: "item",
            cond: { $eq: ["$$item.status", status] },
          },
        },
        // Optionally include other fields from the document
        userInfo: 1,
        createdAt: 1,
        updatedAt: 1,
      }
    );

    if (!maintenanceIssues || maintenanceIssues.length === 0) {
      return res.json({
        success: false,
        message: "No issue found",
      });
    }

    res.status(200).json({
      success: true,
      data: maintenanceIssues,
    });
  } catch (error) {
    console.error("Error fetching MaintenanceIssue by status:", error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
      error: error.message,
    });
  }
};

const VerificationOFIssue = async (req, res) => {
  try {
    const { id, value } = req.body; // assuming `id` is the _id of the subdocument and `value` is the new status

    // Find the document with the matching subdocument id and update the status field
    const updatedDoc = await MaintenanceIssue.findOneAndUpdate(
      { "issueTypes._id": id }, // query to find the document containing the subdocument
      { $set: { "issueTypes.$.status": value } }, // update operation using the positional operator
      { new: true } // return the updated document
    );

    if (!updatedDoc) {
      return res.status(404).json({
        success: false,
        message: "Issue not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Issue status updated successfully.",
      data: updatedDoc,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
      error: e.message,
    });
  }
};
const fetchAllMaintenanceIssueByStatus = async (req, res) => {
  try {
    const { gender, selectedStatus } = req.params;

    const maintenanceIssues = await MaintenanceIssue.find(
      {
        "issueTypes.status": selectedStatus,
        "userInfo.sex": gender,
      },
      {
        // Use $filter to include only those subdocuments with the matching status
        issueTypes: {
          $filter: {
            input: "$issueTypes",
            as: "item",
            cond: { $eq: ["$$item.status", selectedStatus] },
          },
        },
        // Optionally include other fields from the document
        userInfo: 1,
        createdAt: 1,
        updatedAt: 1,
      }
    );

    if (!maintenanceIssues || maintenanceIssues.length === 0) {
      return res.json({
        success: false,
        message: "No issue found",
      });
    }

    res.status(200).json({
      success: true,
      data: maintenanceIssues,
    });
   
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
      error: e.message,
    });
  }
};

module.exports = {
  SubmitMaintenanceIssue,
  fetchAllMaintenanceIssueForDean,
  fetchAllMaintenanceIssueForManager,
  fetchMaintenanceIssueForUser,
  fetchAllMaintenanceIssueByStatus,
  fetchPendingStatusMaintenanceIssue,
  VerificationOFIssue,
};
