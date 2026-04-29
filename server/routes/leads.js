import express from 'express';
import Lead from '../models/Lead.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/leads
// @desc    Create a new lead (Public - from website form)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, source } = req.body;

    const newLead = new Lead({
      name,
      email,
      source: source || 'Website',
      status: 'New'
    });

    const lead = await newLead.save();
    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/leads
// @desc    Get all leads
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/leads/:id
// @desc    Get lead by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/leads/:id
// @desc    Update a lead (status, notes)
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    let leadFields = {};
    if (status) leadFields.status = status;
    if (notes !== undefined) leadFields.notes = notes;

    let lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: leadFields },
      { new: true }
    );

    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/leads/:id/followups
// @desc    Add a follow-up note
// @access  Private
router.post('/:id/followups', authMiddleware, async (req, res) => {
  try {
    const { note } = req.body;
    if (!note) return res.status(400).json({ message: 'Note is required' });

    let lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    lead.followUps.unshift({ note });
    await lead.save();

    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
