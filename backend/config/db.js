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
};

const getDb = () => new AsyncDbWrapper(db);

module.exports = {
    setupDatabase,
    getDb
};
