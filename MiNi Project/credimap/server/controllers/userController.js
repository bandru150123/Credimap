const Project = require('../models/Project');
const User = require('../models/User');
const Certificate = require('../models/Certificate');

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.addProject = async (req, res) => {
    try {
        const newProject = new Project({
            ...req.body,
            userId: req.user.id
        });
        const project = await newProject.save();
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateProject = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ msg: 'Project not found' });
        if (project.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        project = await Project.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ msg: 'Project not found' });
        if (project.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await Project.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Project removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateTheme = async (req, res) => {
    try {
        const { themeId } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.selectedTheme = themeId;
        await user.save();

        // Return user without password
        const updatedUser = await User.findById(req.user.id).select('-password');
        res.json(updatedUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateProfile = async (req, res) => {
    const { name, profileDetails } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (name) user.name = name;
        if (profileDetails) {
            user.profileDetails = {
                ...user.profileDetails.toObject(),
                ...profileDetails,
                socialLinks: {
                    ...user.profileDetails?.socialLinks?.toObject(),
                    ...profileDetails.socialLinks
                }
            };
        }

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Skills Management
exports.addSkill = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.manualSkills.push(req.body);
        await user.save();
        res.json(user.manualSkills);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteSkill = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.manualSkills = user.manualSkills.filter(s => s._id.toString() !== req.params.id);
        await user.save();
        res.json(user.manualSkills);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Experience Management
exports.addExperience = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.experience.push(req.body);
        await user.save();
        res.json(user.experience);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteExperience = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.experience = user.experience.filter(e => e._id.toString() !== req.params.id);
        await user.save();
        res.json(user.experience);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Education Management
exports.addEducation = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.education.push(req.body);
        await user.save();
        res.json(user.education);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteEducation = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.education = user.education.filter(e => e._id.toString() !== req.params.id);
        await user.save();
        res.json(user.education);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Achievements Management
exports.addAchievement = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.achievements.push(req.body);
        await user.save();
        res.json(user.achievements);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteAchievement = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.achievements = user.achievements.filter(a => a._id.toString() !== req.params.id);
        await user.save();
        res.json(user.achievements);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getPublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const projects = await Project.find({ userId: user._id }).sort({ createdAt: -1 });
        const certificates = await Certificate.find({ userId: user._id });

        res.json({
            user,
            projects,
            certificates
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getSharedPortfolio = async (req, res) => {
    try {
        const user = await User.findOne({ publicId: req.params.publicId }).select('-password -email -extractedSkills');
        if (!user) return res.status(404).json({ msg: 'Portfolio not found' });

        if (!user.isPublic) {
            return res.status(403).json({ msg: 'This portfolio is private or not found.' });
        }

        const projects = await Project.find({ userId: user._id }).sort({ createdAt: -1 });
        const certificates = await Certificate.find({ userId: user._id }).select('-extractedText'); // Exclude raw OCR text

        res.json({
            user,
            projects,
            certificates
        });
    } catch (err) {
        console.error('Get Shared Portfolio Error:', err.message);
        res.status(500).send('Server Error');
    }
};
