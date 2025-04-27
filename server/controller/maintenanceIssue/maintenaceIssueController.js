const MaintenanceIssue = require("../../model/maintenance/index");
const Block = require("../../model/block/index");
const SubmitMaintenanceIssue = async (req, res) => {
  try {
      const { id, Model, userInfo, issueTypes } = req.body;

      // Validate required fields (add your validations here)
      
      // Map selectedIssues to the array of objects required by the schema
      const mappedIssues = issueTypes.map((request) => ({
          issue: request.issue,
          status: "Pending",
          description: request.description,
      }));

      // Check if the user already submitted a maintenance issue
      let existingIssue = await MaintenanceIssue.findOne({ userId: id });
 
      const isDuplicatePendingIssue = mappedIssues.some(newIssue =>
          existingIssue?.issueTypes.some(existing =>
              existing.issue === newIssue.issue && existing.status === "Pending"
          )
      );

      if (isDuplicatePendingIssue) {
          return res.json({
              success: false,
              message: 'The issue has already been submitted and is currently pending.',
          });
      }

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
          (type) => !["Pending", "Rejected"].includes(type.status)
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
    // Get all issues as plain objects
    const allIssues = await MaintenanceIssue.find().lean();

    // If there are no issues at all
    if (allIssues.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Data Found",
      });
    }

    // Filter out any issueTypes with status Pending or Rejected,
    // then remove any issue documents that end up with zero types
    const filteredData = allIssues
      .map((issue) => ({
        ...issue,
        issueTypes: issue.issueTypes.filter(
          (type) => !["Pending", "Rejected", "Verified"].includes(type.status)
        ),
      }))
      .filter((issue) => issue.issueTypes.length > 0);

    // If after filtering there’s nothing left
    if (filteredData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Data Found",
      });
    }

    // Success!
    return res.status(200).json({
      success: true,
      data: filteredData,
    });
  } catch (error) {
    console.error("Error fetching maintenance issues for dean:", error);
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
    const { id,  status } = req.body; // assuming `id` is the _id of the subdocument and `value` is the new status
 console.log(id,status)

    // Find the document with the matching subdocument id and update the status field
    const updatedDoc = await MaintenanceIssue.findOneAndUpdate(
      { "issueTypes._id": id }, // query to find the document containing the subdocument
      { $set: { "issueTypes.$.status": status } }, // update operation using the positional operator
      { new: true } // return the updated document
    );

    if (!updatedDoc) {
      return res.json({
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
const fetchIssueByStatusForDean = async (req, res) => {
  try {
    const { selectedStatus } = req.params;

    const maintenanceIssues = await MaintenanceIssue.find(
      {
        "issueTypes.status": selectedStatus,
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
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
      error: e.message,
    });
  }
};
const getWholeMaintainanceIssue = async (req, res) => {
  try {
    
    const maintenanceIssues = await MaintenanceIssue.find();
    res.status(200).json({
      success: true,  
      data: maintenanceIssues,
    });
  } catch (e) {
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
  fetchIssueByStatusForDean,
  getWholeMaintainanceIssue
};
