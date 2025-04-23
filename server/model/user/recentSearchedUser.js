const mongoose = require('mongoose');
const { Schema } = mongoose;

const SearchHistorySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'role'
  },
  role: {
    type: String,
    required: true,
    enum: ['Student', 'User']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  searchedBy:{type: Schema.Types.ObjectId,refPath:'role', required: true}, // The user who performed the search

});

// ─── INDEX FOR FAST ROLE+TIMESTAMP QUERIES ────────────────────────────
//SearchHistorySchema.index({ role: 1, timestamp: -1 });

// ─── PRE‑SAVE HOOK: TRIM TO 5 ENTRIES PER ROLE ────────────────────────
// ─── PRE‑SAVE HOOK: TRIM TO 5 ENTRIES PER ROLE ────────────────────────
SearchHistorySchema.pre('save', async function(next) {
  try {
    const Model = this.constructor;
    const MAX_ENTRIES_PER_ROLE = 5;

    // Count existing entries for this role
    const count = await Model.countDocuments({ role: this.role, searchedBy:this.searchedBy });

    if (count >= MAX_ENTRIES_PER_ROLE) {
      // Delete the oldest entry for this role
      const oldestEntry = await Model
        .findOne({ role: this.role })
        .sort({ timestamp: 1 }) // Oldest first
        .select('_id')
        .lean();

      if (oldestEntry) {
        await Model.deleteOne({ _id: oldestEntry._id });
      }
    }

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('SearchHistory', SearchHistorySchema);
