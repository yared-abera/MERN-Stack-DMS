const Issue = require('../../model/control/control-Model');
const User = require('../../model/user/user');
const Student = require('../../model/student/student');

/**
 * Controller to add or update a control issue for a student
 */
const AddControlIssue = async (req, res) => {
  const { studId, proctorId, issue, description, block, dorm } = req.body;

  try {
    // 1. Basic payload validation
    if (!studId || !proctorId || !issue || !description || !block || !dorm) {
      return res.json({ success: false, message: 'All fields are required' });
    }

    // 2. Length checks to mirror schema constraints
    if (issue.length > 15) {
      return res.json({ success: false, message: 'Issue must be 15 characters or less' });
    }
    if (description.length > 50) {
      return res.json({ success: false, message: 'Description must be 50 characters or less' });
    }

    // 3. Validate student and proctor exist
    const student = await Student.findById(studId);
    const proctor = await User.findById(proctorId);
    if (!student || !proctor) {
      return res.json({ success: false, message: 'Student or proctor not found' });
    }

    // 4. Ensure block/dorm match current student record
    if (student.blockNum !== block || student.dormId !== dorm) {
      return res.json({
        success: false,
        message: `Block/Dorm mismatch: expected (${student.blockNum}/${student.dormId}), received (${block}/${dorm})`,
      });
    }

    // 5. Check for existing Issue document for this student
    let controlDoc = await Issue.findOne({ student: studId });

    if (!controlDoc) {
      // First-time issue for this student: create new document
      controlDoc = new Issue({
        student: studId,
        proctor: proctorId,
        block,
        dorm,
        Allissues: [{ issue, description }],
      });

      await controlDoc.save();
      return res.status(201).json({ success: true, data: controlDoc, message: 'Issue created successfully' });
    }

    // 6. Student already has a controlDoc: check for duplicate open issue
    const duplicate = controlDoc.Allissues.find(
      (entry) => entry.issue === issue && entry.status === 'open'
    );
    if (duplicate) {
      return res.json({
        success: false,
        message: `An open issue '${issue}' already exists for this student`,
      });
    }

    // 7. Append new issue record
    controlDoc.Allissues.push({ issue, description });
    // Optionally update proctor, block, dorm if you want latest
    controlDoc.proctor = proctorId;
    controlDoc.block = block;
    controlDoc.dorm = dorm;

    await controlDoc.save();
    return res.status(200).json({ success: true, data: controlDoc, message: 'New issue added successfully' });

  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.json({ success: false, message: messages.join(', ') });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

 

const fetchAllControleIssues = async (req, res) => {
  try {
    const getAllIssues = await Issue.find().populate([
      { // Populate the student field
        model: 'Student', // Assuming your Student model is named 'Student'
        path: 'student',
        select: 'userName Fname Lname Mname blockNum dormId phonNum sex' // Fields to select from Student
      },
      { // Populate the proctor field (referencing the User model)
        model: 'User', // Correctly reference your User model
        path: 'proctor',
        select: 'fName lName mName userName phoneNum' // Fields to select from User for the proctor
      }
    ]);

    if (getAllIssues.length === 0) {
      return res.json({ success: false, message: 'No data Found' });
    }

    res.status(200).json({
      success: true,
      data: getAllIssues
    });

  } catch (error) {
    console.error("Error fetching control issues:", error); // Log the error for debugging
    return res.status(500).json({ success: false, message: 'Server error', error: error.message }); // Include error message in response
  }
};

 
const UpdateControlIssueSatus = async (req, res) => {
  console.log(req.body);
  // Destructure the request body
  const { issueId, specificIssueId, selectedStatus } = req.body;

  try {
    // Validate input
    if (!issueId || !specificIssueId || !selectedStatus) {
      return res.status(400).json({ success: false, message: 'Issue ID, specific issue ID, and status are required' });
    }

    // Validate if the status is one of the allowed enum values (optional but good practice)
    const allowedStatuses = ["open", "InProgress", "closed", "passed"];
    if (!allowedStatuses.includes(selectedStatus)) {
         return res.status(400).json({ success: false, message: `Invalid status value: ${selectedStatus}` });
    }


    // Find the control issue by its main ID AND find the specific issue within Allissues by its ID
    // Then update the status of that specific issue using the positional operator '$'
    const updatedIssue = await Issue.findOneAndUpdate(
      {
        _id: issueId, // Find the main document by ID
        'Allissues._id': specificIssueId // AND find the specific sub-document by its ID within the Allissues array
      },
      {
        $set: { 'Allissues.$.status': selectedStatus } // Update the 'status' field of the matched element ('$')
      },
      { new: true } // Return the updated document
    );

    // Check if a document was found and updated
    if (!updatedIssue) {
      // This means either the main issueId was not found, or the specificIssueId was not found within that issue's Allissues array
      return res.status(404).json({ success: false, message: 'Main Issue or specific issue entry not found' });
    }

    // Success response
    res.status(200).json({
      success: true,
      data: updatedIssue,
      message: `Issue status updated successfully to '${selectedStatus}'`
    });

  } catch (error) {
    console.error("Error updating control issue status:", error); // Log the error for debugging
    // Send a more informative server error response
    return res.status(500).json({ success: false, message: 'Server error processing status update', error: error.message });
  }
};

 
module.exports = { AddControlIssue,fetchAllControleIssues,UpdateControlIssueSatus };
