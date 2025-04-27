const Attendance = require('../../model/student/studAttendance.js'); // Adjust path as needed
const Student = require('../../model/student/student.js');     // Adjust path as needed
const Notification = require('../../model/student/notification.js'); // Adjust path as needed
const mongoose = require('mongoose'); // Needed if using transactions later

const AddAttendance = async (req, res) => {
    // req.body is expected to be an ARRAY of absent student records
    // e.g., [{ student: '...', proctor: '...', isPresent: false }, ...]
    const attendanceDataArray = req.body;

    // --- Input Validation ---
    if (!Array.isArray(attendanceDataArray)) {
        return res.status(400).json({
            success: false,
            message: "Invalid input format: Expected an array of attendance records.",
        });
    }

    // If the frontend sends an empty array (meaning everyone was present),
    // we can just return success without doing anything in the DB.
    if (attendanceDataArray.length === 0) {
        console.log('Received empty attendance array - all students likely present.');
        return res.status(200).json({
            success: true,
            message: "Attendance recorded successfully (all present or no data submitted).",
            data: [] // Return empty array as no records were created
        });
    }

    // --- Data Processing ---
    try {
        
        const savePromises = attendanceDataArray.map(record => {
            if (!record.student || !record.proctor) {
                // Throw an error if essential data is missing in any record
                throw new Error(`Missing student or proctor ID in record: ${JSON.stringify(record)}`);
            }
            // The post-save hook defined in the schema will automatically run after each successful save
            return Attendance.create(
               
                 { // create actually works fine with just the object directly in newer mongoose
                    student: record.student,
                    proctor: record.proctor,
                    block:record.block,
                    isPresent: record.isPresent // should always be false here
                }
            );
        });

        // Wait for all save operations (and their post-save hooks) to complete.
        const savedRecords = await Promise.all(savePromises);

      
 
        res.status(201).json({ // 201 Created is more appropriate here
            success: true,
            message: `Successfully recorded attendance for ${savedRecords.length} absent student(s).`,
            data: savedRecords // Optionally return the created records
        });

    } catch (error) {
        
        console.error("Error saving attendance records:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save attendance records.",
            error: error.message,
        });
    }
};

const fetchNotification = async (req, res) => {
    try {
        console.log('Fetching attendance notifications...');
        const getNotification = await Notification.find()
            .populate({
                path: 'student',
                model: 'Student',
                select: "userName role Fname Lname Mname email sex phoneNum absenceDates"
            })
            .lean();

        console.log('Found notifications:', getNotification);

        if (getNotification.length === 0) {
            console.log('No notifications found');
            return res.status(200).json({
                success: false,
                message: 'No Student is Found',
                data: []
            });
        }

        console.log('Sending notifications response');
        res.status(200).json({
            success: true,
            data: getNotification
        });
    } catch (error) {
        console.error('Error in fetchNotification:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch attendance records.",
            error: error.message
        });
    }
};

const getAbsentStudents = async (req, res) => {
    try {
        console.log('Fetching absent students...');
        // Get today's date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find all attendance records for today where isPresent is false
        const absentRecords = await Attendance.find({
            isPresent: false,
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        }).populate({
            path: 'student',
            select: 'userName Fname Lname Mname dormId blockNum'
        }).lean();

        console.log('Found absent records:', absentRecords);

        if (absentRecords.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No absent students found',
                data: []
            });
        }

        // Transform the data to match the expected format
        const formattedData = absentRecords.map(record => ({
            student: record.student,
            block: record.block,
            date: record.date
        }));

        res.status(200).json({
            success: true,
            data: formattedData
        });
    } catch (error) {
        console.error('Error in getAbsentStudents:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch absent students.",
            error: error.message
        });
    }
};

module.exports = { AddAttendance, fetchNotification, getAbsentStudents }; // Make sure to export

 
