const jwt = require('jsonwebtoken');
const { getDb } = require('../config/db');

// Protect route - verify JWT
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
        req.user = await getDb().get('SELECT id, email, role, isActive, lastLogin FROM users WHERE id = ?', decoded.id);
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }
        
        // Self-healing: If role is null or undefined in the database for some reason, fix it
        if (!req.user.role || req.user.role === 'null') {
            const isPatient = await getDb().get('SELECT id FROM patients WHERE userId = ?', req.user.id);
            if (isPatient) {
                await getDb().run('UPDATE users SET role = ? WHERE id = ?', 'patient', req.user.id);
                req.user.role = 'patient';
            } else {
                const isDoctor = await getDb().get('SELECT id FROM doctors WHERE userId = ?', req.user.id);
                if (isDoctor) {
                    await getDb().run('UPDATE users SET role = ? WHERE id = ?', 'doctor', req.user.id);
                    req.user.role = 'doctor';
                } else {
                    req.user.role = 'patient'; // Default fallback
                }
            }
        }
        
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
};

// Authorize roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
