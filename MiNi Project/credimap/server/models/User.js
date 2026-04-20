const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileDetails: {
        bio: String,
        headline: String,
        title: String,
        location: String,
        avatar: String,
        phone: String,
        website: String,
        socialLinks: {
            linkedin: String,
            github: String,
            twitter: String
        }
    },
    // Skills system
    manualSkills: [{
        name: String,
        category: String,
        proficiency: String,
        addedAt: { type: Date, default: Date.now }
    }],
    extractedSkills: [{
        name: String,
        source: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' },
        confidence: Number,
        extractedAt: { type: Date, default: Date.now }
    }],
    // Theme selection
    selectedTheme: { type: String, default: 'default' },
    // Portfolio generation
    experience: [{
        company: String,
        position: String,
        location: String,
        startDate: Date,
        endDate: Date,
        current: Boolean,
        description: String,
        projectLink: String,
        githubLink: String
    }],
    education: [{
        institution: String,
        degree: String,
        field: String,
        startDate: Date,
        endDate: Date,
        grade: String
    }],
    achievements: [{
        title: String,
        description: String,
        date: Date,
        icon: String
    }],
    portfolioUrl: String,
    deploymentStatus: { type: String, enum: ['draft', 'published', 'deployed'], default: 'draft' },
    isPublic: { type: Boolean, default: false },
    publicId: { type: String, sparse: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
