// Get users for chat (filtered by role)
router.get('/chat-users', async (req, res) => {
  try {
    const { role } = req.user; // Assuming you have user info in req.user from auth middleware
    let query = {};

    // Filter users based on role
    if (role === 'studentDean') {
      query = { role: { $in: ['proctor', 'student'] } };
    } else if (role === 'proctorManager') {
      query = { role: 'proctor' };
    }

    const users = await User.find(query)
      .select('Fname Lname userName _id role')
      .sort({ Fname: 1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get proctor list
router.get('/proctor-list', async (req, res) => {
  try {
    const proctors = await User.find({ role: 'proctor' })
      .select('Fname Lname userName _id')
      .sort({ Fname: 1 });

    res.json(proctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}); 