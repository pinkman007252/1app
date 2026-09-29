require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { setupDatabase } = require('./config/db');

// Connect Database
setupDatabase();

const app = express();

// Trust proxy for Render / cloud reverse proxies
app.set('trust proxy', 1);

// Middleware - allow all origins (web, mobile, capacitor)
const corsOptions = {
    origin: true,
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    message: { success: false, message: 'Too many requests from this IP, please try again later' }
});
app.use('/api/', limiter);

const path = require('path');
const fs = require('fs');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/patients', require('./routes/patients'));

app.get('/api/debug-db', async (req, res) => {
    try {
        const { getDb } = require('./config/db');
        const count = await getDb().get('SELECT COUNT(*) as cnt FROM appointments');
        const existing = await getDb().get("SELECT id FROM appointments WHERE doctorId = '98443e12-2db6-4631-b144-8d647af0da52'");
        res.json({ count, existing });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
// Serve React Frontend static files if build directory exists
const frontendBuildPath = path.join(__dirname, '../frontend/build');
if (fs.existsSync(frontendBuildPath)) {
    app.use(express.static(frontendBuildPath));
    app.get('*', (req, res) => {
        if (req.originalUrl.startsWith('/api')) {
            return res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
        }
        res.sendFile(path.join(frontendBuildPath, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.json({ success: true, message: 'MediBook API is running successfully.' });
    });

    app.get('*', (req, res) => {
        if (req.originalUrl.startsWith('/api')) {
            return res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
        }
        res.status(404).json({ success: false, message: 'Route not found' });
    });
}

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Unified App running on http://localhost:${PORT}`);
});
