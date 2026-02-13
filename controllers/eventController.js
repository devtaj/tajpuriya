const Event = require('../models/Event');

const getEvents = async (req, res) => {
  try {
    const { type, upcoming } = req.query;
    let query = {};

    if (type) {
      query.type = type;
    }

    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }

    const events = await Event.find(query)
      .populate('createdBy', 'name')
      .sort({ date: upcoming === 'true' ? 1 : -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, type } = req.body;

    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      type,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      createdBy: req.user.id
    });

    await event.save();
    await event.populate('createdBy', 'name');

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('createdBy', 'name');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};