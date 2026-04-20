const User = require('../models/User');
const Certificate = require('../models/Certificate');
const Project = require('../models/Project');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        console.log('Login attempt for email:', email);
        if (!user) {
            console.log('User not found');
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        console.log('User found, comparing passwords...');
        const isMatch = await user.comparePassword(password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const certificates = await Certificate.find({ userId: req.user.id });
        const projects = await Project.find({ userId: req.user.id });

        const userObj = user.toObject();
        userObj.certificates = certificates;
        userObj.projects = projects;

        res.json(userObj);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateTheme = async (req, res) => {
    const { selectedTheme, selectedBgTheme } = req.body;
    console.log('Update Theme Request Body:', req.body);

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (selectedTheme) user.selectedTheme = selectedTheme;
        if (selectedBgTheme) user.selectedBgTheme = selectedBgTheme;

        await user.save();
        console.log('Updated User Theme:', { selectedTheme: user.selectedTheme, selectedBgTheme: user.selectedBgTheme });

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
