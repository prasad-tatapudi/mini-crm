import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    let admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = {
      admin: {
        id: admin.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '10h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Setup Initial Admin (Run once or uncomment to seed)
router.post('/setup', async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    if (count > 0) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    
    const admin = new Admin({
      username: 'admin',
      password: 'password123'
    });
    
    await admin.save();
    res.json({ message: 'Admin created successfully. Username: admin, Password: password123' });
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Verify Token
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
