// Uses Node.js v22.5+ built-in SQLite (no npm package needed!)
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../database.sqlite');
let db = null;

// Async-compatible wrapper around node:sqlite (which is synchronous)
// This preserves existing route code that uses: await db.get/run/all
class AsyncDbWrapper {
    constructor(database) {
        this._db = database;
    }

    async get(sql, ...params) {
        const stmt = this._db.prepare(sql);
        return stmt.get(...params.flat());
    }

    async all(sql, ...params) {
        const stmt = this._db.prepare(sql);
        return stmt.all(...params.flat());
    }

    async run(sql, ...params) {
        const trimmed = sql.trim().toUpperCase();
        // Treat manual transaction statements as no-ops (auto-commit mode)
        if (trimmed === 'BEGIN TRANSACTION' || trimmed === 'BEGIN' ||
            trimmed === 'COMMIT' || trimmed === 'ROLLBACK') {
            return;
        }
        const stmt = this._db.prepare(sql);
        return stmt.run(...params.flat());
    }

    async exec(sql) {
        this._db.exec(sql);
    }
}

const autoSeedIfEmpty = (database) => {
    try {
        const stmt = database.prepare("SELECT COUNT(*) as cnt FROM users");
        const res = stmt.get();
        if (res && res.cnt > 0) return;

        console.log("🌱 Database is empty. Running auto-seed...");
        const bcrypt = require('bcryptjs');
        const crypto = require('crypto');

        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync('password123', salt);

        const doctorsData = [
            { email: 'sarah.kumar@hospital.com', firstName: 'Sarah', lastName: 'Kumar', specialization: 'Cardiology', qualification: 'MBBS, MD', experience: 12, phone: '9123456789', licenseNumber: 'MCI12345', diseasesExpertise: ['Heart Disease', 'Hypertension'], fee: 1000 },
            { email: 'raj.patel@hospital.com', firstName: 'Raj', lastName: 'Patel', specialization: 'Neurology', qualification: 'MBBS, DM', experience: 8, phone: '9234567890', licenseNumber: 'MCI23456', diseasesExpertise: ['Migraine', 'Epilepsy'], fee: 1200 },
            { email: 'priya.nair@hospital.com', firstName: 'Priya', lastName: 'Nair', specialization: 'Dermatology', qualification: 'MBBS, MD', experience: 6, phone: '9345678901', licenseNumber: 'MCI34567', diseasesExpertise: ['Acne', 'Psoriasis'], fee: 800 },
            { email: 'vikram.singh@hospital.com', firstName: 'Vikram', lastName: 'Singh', specialization: 'Orthopedics', qualification: 'MBBS, MS', experience: 15, phone: '9456789012', licenseNumber: 'MCI45678', diseasesExpertise: ['Joint Pain', 'Fractures'], fee: 1100 }
        ];

        for (const dr of doctorsData) {
            const userId = crypto.randomUUID();
            const doctorId = crypto.randomUUID();

            database.prepare('INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)').run(userId, dr.email, passwordHash, 'doctor');

            database.prepare(`
                INSERT INTO doctors (id, userId, firstName, lastName, specialization, qualification, experience, phone, licenseNumber, diseasesExpertise, consultationFee, bio) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Experienced doctor')
            `).run(doctorId, userId, dr.firstName, dr.lastName, dr.specialization, dr.qualification, dr.experience, dr.phone, dr.licenseNumber, JSON.stringify(dr.diseasesExpertise), dr.fee);

            for (let day = 0; day <= 6; day++) {
                const shifts = [
                    { shiftName: 'Morning', startTime: '09:00', endTime: '13:00', slotDuration: 30, breakTimes: [{ startTime: '11:00', endTime: '11:15', breakType: 'tea' }], maxPatientsPerSlot: 1, isActive: true },
                    { shiftName: 'Evening', startTime: '17:00', endTime: '20:00', slotDuration: 30, breakTimes: [], maxPatientsPerSlot: 1, isActive: true }
                ];
                database.prepare('INSERT INTO schedules (id, doctorId, dayOfWeek, shifts, effectiveFrom) VALUES (?, ?, ?, ?, ?)').run(
                    crypto.randomUUID(), doctorId, day, JSON.stringify(shifts), '2026-01-01'
                );
            }
        }

        const p1UserId = crypto.randomUUID();
        const p1Id = crypto.randomUUID();
        database.prepare('INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)').run(p1UserId, 'john.doe@email.com', passwordHash, 'patient');
        database.prepare('INSERT INTO patients (id, userId, firstName, lastName, gender, phone, dateOfBirth, address, medicalDetails) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
            p1Id, p1UserId, 'John', 'Doe', 'male', '9876543210', '1985-05-15', JSON.stringify({ city: 'Chennai' }), JSON.stringify({ bloodGroup: 'O+' })
        );

        const p2UserId = crypto.randomUUID();
        const p2Id = crypto.randomUUID();
        database.prepare('INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)').run(p2UserId, 'jane.smith@email.com', passwordHash, 'patient');
        database.prepare('INSERT INTO patients (id, userId, firstName, lastName, gender, phone, dateOfBirth, address, medicalDetails) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
            p2Id, p2UserId, 'Jane', 'Smith', 'female', '9765432109', '1992-08-22', JSON.stringify({ city: 'Chennai' }), JSON.stringify({ bloodGroup: 'A+' })
        );

        console.log('✅ Auto-seeded default users, doctors, and patients successfully');
    } catch (err) {
        console.error('⚠️ Auto-seed failed:', err);
    }
};

const setupDatabase = () => {
    db = new DatabaseSync(dbPath);
    db.exec("PRAGMA journal_mode = WAL");
    db.exec("PRAGMA foreign_keys = ON");

    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        db.exec(schema);
        console.log('✅ SQLite Database Connected and Schema Initialized');
    }
    autoSeedIfEmpty(db);
};

const getDb = () => new AsyncDbWrapper(db);

module.exports = {
    setupDatabase,
    getDb
};
