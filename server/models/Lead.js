import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  source: {
    type: String,
    required: true,
    enum: ['Website', 'Referral', 'Social Media', 'Other'],
    default: 'Website'
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Converted', 'Lost'],
    default: 'New'
  },
  notes: {
    type: String,
    default: ''
  },
  followUps: [
    {
      date: { type: Date, default: Date.now },
      note: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
