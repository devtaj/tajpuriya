const User = require('../models/User');

const getMembers = async (req, res) => {
  try {
    const { search, profession, city } = req.query;
    let query = { isApproved: true, role: 'member' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { profession: { $regex: search, $options: 'i' } }
      ];
    }

    if (profession) {
      query.profession = { $regex: profession, $options: 'i' };
    }

    if (city) {
      query['address.city'] = { $regex: city, $options: 'i' };
    }

    const members = await User.find(query)
      .select('-password -email')
      .sort({ dateJoined: -1 });

    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMemberById = async (req, res) => {
  try {
    const member = await User.findById(req.params.id)
      .select('-password -email');

    if (!member || !member.isApproved) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getPendingMembers = async (req, res) => {
  try {
    const pendingMembers = await User.find({ isApproved: false, role: 'member' })
      .select('-password')
      .sort({ dateJoined: -1 });

    res.json(pendingMembers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const approveMember = async (req, res) => {
  try {
    const member = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).select('-password');

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ message: 'Member approved successfully', member });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const rejectMember = async (req, res) => {
  try {
    const member = await User.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ message: 'Member rejected and removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMembers,
  getMemberById,
  getPendingMembers,
  approveMember,
  rejectMember
};