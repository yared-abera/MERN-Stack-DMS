const mongoose = require("mongoose");
const Student = require("./student"); // Adjust path if needed
const Notification = require("./notification"); // Adjust path if needed

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    }, // Added index
    proctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    block:{type:Number,required:true},
    date: { type: Date, default: () => new Date(), index: true },
    isPresent: { type: Boolean, required: true },
  },


  {
    timestamps: true,
  }
);

// Post-save hook to update Student.absenceDates and potentially fire notification
// This hook runs AFTER a single attendance document ('doc') is successfully saved.
attendanceSchema.post("save", async function (doc, next) {
  // Only proceed if this record is an absence
  if (doc.isPresent) return next();

  try {
    // 1. Normalize the new absence date to midnight
    const absenceDateStart = new Date(doc.date);
    absenceDateStart.setHours(0, 0, 0, 0);

    // 2. Check if that exact date is already in the student's absenceDates
    const alreadyExists = await Student.exists({
      _id: doc.student,
      absenceDates: absenceDateStart
    });
    if (alreadyExists) {
      // they've already got an entry for this day—skip both array‑update and notification
      return next();
    }

    // 3. It’s a new date, so add it
    const studentUpdate = await Student.findByIdAndUpdate(
      doc.student,
      { $addToSet: { absenceDates: absenceDateStart } },
      { new: true }
    );
    if (!studentUpdate) {
      console.warn(`Student ${doc.student} not found.`);
      return next();
    }

    // 4. Count absences in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const Attendance = mongoose.model("Attendance");
    const absenceCount = await Attendance.countDocuments({
      student:   doc.student,
      isPresent: false,
      date:      { $gte: thirtyDaysAgo }
    });

    // 5. Only send a warning if they’ve hit the threshold *and* there isn’t already
    //    an *unread* ABSENCE_WARNING for them.
    const threshold = 3;
    if (absenceCount >= threshold) {
      const existingUnread = await Notification.findOne({
        student: doc.student,
        type:    "ABSENCE_WARNING",
        read:    false
      });

      if (!existingUnread) {
        await Notification.create({
          student:   doc.student,
          block:     doc.block,
          type:      "ABSENCE_WARNING",
          message:   `Student ${studentUpdate.Fname} ${studentUpdate.Lname} (${studentUpdate.userName}) has reached ${absenceCount} absences, exceeding the threshold of ${threshold}.`,
          count:     absenceCount,
          threshold: threshold
        });
      }
    }

    next();
  } catch (err) {
    console.error(`Error in attendance post‑save hook:`, err);
    next(err);
  }
});


module.exports = mongoose.model("Attendance", attendanceSchema);
