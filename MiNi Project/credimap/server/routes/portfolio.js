const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { nanoid } = require('nanoid');
const auth = require('../middleware/auth'); // assuming standard auth middleware

// Toggles portfolio to public
router.post('/make-public/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        // Ensure user is authorized to modify this portfolio
        if (user._id.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        user.isPublic = true;
        if (!user.publicId) {
            user.publicId = nanoid(10);
        }
        await user.save();

        res.json({ publicId: user.publicId, isPublic: user.isPublic });
    } catch (err) {
        console.error('Make Public Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// Toggles portfolio to private
router.post('/make-private/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        if (user._id.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        user.isPublic = false;
        await user.save();

        res.json({ isPublic: user.isPublic });
    } catch (err) {
        console.error('Make Private Error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
