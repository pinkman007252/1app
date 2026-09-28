const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { getDb } = require('../config/db');
const { protect, authorize } = require('../middleware/auth');

// Helper: parse JSON fields
const parseJSONFields = (obj, fields) => {
    if (!obj) return obj;
    fields.forEach(f => {
        if (obj[f]) {
            try { obj[f] = JSON.parse(obj[f]); } catch (e) { }
        }
    });
    return obj;
};

// Helper: time string to minutes
const timeToMinutes = (time) => {
    if (!time) return 0;
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

// Helper: minutes to time string
const minutesToTime = (mins) => {
    const h = Math.floor(mins / 60).toString().padStart(2, '0');
    const m = (mins % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
};

// @route   GET /api/doctors/search?query=cardiology
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ success: false, message: 'Query parameter is required' });
        }

        const searchTerm = `%${query}%`;
        const doctors = await getDb().all(`
            SELECT * FROM doctors 
            WHERE isAvailable = 1 AND (
                specialization LIKE ? OR 
                diseasesExpertise LIKE ? OR 
                firstName LIKE ? OR 
                lastName LIKE ?
            )
        `, searchTerm, searchTerm, searchTerm, searchTerm);

        const mappedDoctors = doctors.map(d => parseJSONFields({ ...d, _id: d.id }, ['diseasesExpertise']));
        res.json({ success: true, count: mappedDoctors.length, data: mappedDoctors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/doctors
router.get('/', async (req, res) => {
    try {
        const doctors = await getDb().all('SELECT * FROM doctors WHERE isAvailable = 1 ORDER BY ratingAverage DESC');
        const mappedDoctors = doctors.map(d => parseJSONFields({ ...d, _id: d.id }, ['diseasesExpertise']));
        res.json({ success: true, count: mappedDoctors.length, data: mappedDoctors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/doctors/my-patients
router.get('/my-patients', protect, authorize('doctor'), async (req, res) => {
    try {
        const doctor = await getDb().get('SELECT id FROM doctors WHERE userId = ?', req.user.id);
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

        const patients = await getDb().all(`
            SELECT DISTINCT p.id, p.firstName, p.lastName, u.email, p.phone 
            FROM appointments a 
            JOIN patients p ON a.patientId = p.id 
            LEFT JOIN users u ON p.userId = u.id
            WHERE a.doctorId = ?
        `, doctor.id);

        res.json({ success: true, count: patients.length, data: patients });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/doctors/records
router.get('/records', protect, authorize('doctor'), async (req, res) => {
    try {
        const doctor = await getDb().get('SELECT id FROM doctors WHERE userId = ?', req.user.id);
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

        let query = `
            SELECT a.*, 
                   p.firstName as patientFirstName, p.lastName as patientLastName, u.email as patientEmail, p.phone as patientPhone,
                   d.firstName as doctorFirstName, d.lastName as doctorLastName, d.specialization as doctorSpecialization
            FROM appointments a
            JOIN patients p ON a.patientId = p.id
            LEFT JOIN users u ON p.userId = u.id
            JOIN doctors d ON a.doctorId = d.id
            WHERE a.doctorId = ? AND a.status = 'completed'
        `;
        const params = [doctor.id];

        if (req.query.patientId) {
            query += ' AND a.patientId = ?';
            params.push(req.query.patientId);
        }

        query += ' ORDER BY a.appointmentDate DESC, a.timeSlotStart DESC';
        const records = await getDb().all(query, ...params);

        const mappedRecords = records.map(a => {
            let parsedPrescription = [];
            try { if (a.prescription) parsedPrescription = JSON.parse(a.prescription); } catch (e) { }
            return {
                _id: a.id,
                patientId: { _id: a.patientId, firstName: a.patientFirstName, lastName: a.patientLastName, email: a.patientEmail, phone: a.patientPhone },
                doctorId: { _id: a.doctorId, firstName: a.doctorFirstName, lastName: a.doctorLastName, specialization: a.doctorSpecialization },
                appointmentDate: a.appointmentDate,
                timeSlot: { startTime: a.timeSlotStart, endTime: a.timeSlotEnd },
                status: a.status,
                reason: a.reason,
                doctorNotes: a.doctorNotes,
                prescription: parsedPrescription,
                tokenNumber: a.tokenNumber
            };
        });

        res.json({ success: true, count: mappedRecords.length, data: mappedRecords });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/doctors/:id
router.get('/:id', async (req, res) => {
    try {
        let doctor = await getDb().get('SELECT * FROM doctors WHERE id = ?', req.params.id);
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
        doctor = parseJSONFields({ ...doctor, _id: doctor.id }, ['diseasesExpertise']);
        res.json({ success: true, data: doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/doctors/:id/schedule
router.get('/:id/schedule', async (req, res) => {
    try {
        const schedules = await getDb().all('SELECT * FROM schedules WHERE doctorId = ? ORDER BY dayOfWeek ASC', req.params.id);
        const mappedSchedules = schedules.map(s => parseJSONFields({ ...s, _id: s.id }, ['shifts']));
        res.json({ success: true, count: mappedSchedules.length, data: mappedSchedules });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/doctors/:id/available-slots?date=2026-02-05
router.get('/:id/available-slots', async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ success: false, message: 'Date is required' });

        const [year, month, day] = date.split('-').map(Number);
        const dayOfWeek = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

        let schedule = await getDb().get('SELECT * FROM schedules WHERE doctorId = ? AND dayOfWeek = ?', req.params.id, dayOfWeek);
        
        let shifts = [];
        if (schedule) {
            schedule = parseJSONFields(schedule, ['shifts']);
            shifts = schedule.shifts || [];
        } else {
            // Default shift for doctors if specific day schedule is not configured
            shifts = [{
                shiftName: 'Morning',
                startTime: '09:00',
                endTime: '13:00',
                slotDuration: 30,
                breakTimes: [{ startTime: '11:00', endTime: '11:15', breakType: 'tea' }],
                maxPatientsPerSlot: 1,
                isActive: true
            }];
        }

        const bookedAppointments = await getDb().all(`
            SELECT timeSlotStart FROM appointments 
            WHERE doctorId = ? AND date(appointmentDate) = date(?) AND status != 'cancelled'
        `, req.params.id, date);

        const bookedTimes = new Set(bookedAppointments.map(a => a.timeSlotStart));

        const slots = [];
        if (shifts && Array.isArray(shifts)) {
            for (const shift of shifts) {
                if (!shift.isActive) continue;

                const shiftStart = timeToMinutes(shift.startTime);
                const shiftEnd = timeToMinutes(shift.endTime);
                const duration = shift.slotDuration;

                let current = shiftStart;
                while (current + duration <= shiftEnd) {
                    const slotStart = minutesToTime(current);
                    const slotEnd = minutesToTime(current + duration);

                    // Check if overlaps with break
                    let inBreak = false;
                    if (shift.breakTimes && Array.isArray(shift.breakTimes)) {
                        inBreak = shift.breakTimes.some(b => {
                            const bStart = timeToMinutes(b.startTime);
                            const bEnd = timeToMinutes(b.endTime);
                            return current < bEnd && current + duration > bStart;
                        });
                    }

                    if (!inBreak) {
                        slots.push({
                            startTime: slotStart,
                            endTime: slotEnd,
                            shiftName: shift.shiftName,
                            available: !bookedTimes.has(slotStart)
                        });
                    }
                    current += duration;
                }
            }
        }

        res.json({ success: true, count: slots.length, data: slots });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/doctors/schedule (Doctor only)
router.post('/schedule', protect, authorize('doctor'), async (req, res) => {
    try {
        const doctor = await getDb().get('SELECT id FROM doctors WHERE userId = ?', req.user.id);
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

        const { dayOfWeek, shifts, effectiveFrom } = req.body;

        const existing = await getDb().get('SELECT id FROM schedules WHERE doctorId = ? AND dayOfWeek = ?', doctor.id, dayOfWeek);

        let scheduleId;
        if (existing) {
            scheduleId = existing.id;
            await getDb().run('UPDATE schedules SET shifts = ?, effectiveFrom = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', JSON.stringify(shifts), effectiveFrom, scheduleId);
        } else {
            scheduleId = crypto.randomUUID();
            await getDb().run('INSERT INTO schedules (id, doctorId, dayOfWeek, shifts, effectiveFrom) VALUES (?, ?, ?, ?, ?)', scheduleId, doctor.id, dayOfWeek, JSON.stringify(shifts), effectiveFrom);
        }

        const schedule = await getDb().get('SELECT * FROM schedules WHERE id = ?', scheduleId);
        res.json({ success: true, message: 'Schedule updated successfully', data: parseJSONFields(schedule, ['shifts']) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/doctors/profile (Doctor only)
router.put('/profile', protect, authorize('doctor'), async (req, res) => {
    try {
        const doctor = await getDb().get('SELECT id FROM doctors WHERE userId = ?', req.user.id);
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

        const { bio, consultationFee, diseasesExpertise, isAvailable } = req.body;

        await getDb().run(`
            UPDATE doctors SET 
                bio = coalesce(?, bio),
                consultationFee = coalesce(?, consultationFee),
                diseasesExpertise = coalesce(?, diseasesExpertise),
                isAvailable = coalesce(?, isAvailable),
                updatedAt = CURRENT_TIMESTAMP
            WHERE id = ?
        `,
            bio !== undefined ? bio : null,
            consultationFee !== undefined ? consultationFee : null,
            diseasesExpertise ? JSON.stringify(diseasesExpertise) : null,
            isAvailable !== undefined ? (isAvailable ? 1 : 0) : null,
            doctor.id
        );

        const updatedDoctor = await getDb().get('SELECT * FROM doctors WHERE id = ?', doctor.id);
        res.json({ success: true, message: 'Profile updated successfully', data: parseJSONFields(updatedDoctor, ['diseasesExpertise']) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
