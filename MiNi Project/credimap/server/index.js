const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log('[Server] Created uploads directory at:', uploadsPath);
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsPath));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/public', require('./routes/public'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/user', require('./routes/user'));
app.use('/api/portfolio', require('./routes/portfolio'));

// Serve Frontend Build only if it exists
const clientBuildPath = path.join(__dirname, '../client/dist');

    if (fs.existsSync(clientBuildPath)) {
        console.log('[Server] Serving frontend from:', clientBuildPath);
        app.use(express.static(clientBuildPath));
        app.get('/*path', (req, res) => {
            res.sendFile(path.join(clientBuildPath, 'index.html'));
        });
    } else {
    console.log('[Server] Frontend build not found. Running in API-only mode.');
    app.get('/', (req, res) => {
        res.json({ 
            message: "Credimap Backend API is running!", 
            status: "OK",
            version: "1.0.0" 
        });
    });
}

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
