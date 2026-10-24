const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../../data');
const DB_PATH = path.join(DATA_DIR, 'records.json');
const TYPES = ['petitions', 'depositions', 'legalAid'];
function blank() { return {petitions: [], depositions: [], legalAid: []}; }
function load() {
  fs.mkdirSync(DATA_DIR, {recursive: true, mode: 0o700});
  if (!fs.existsSync(DB_PATH)) return blank();
  const parsed = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  for (const type of TYPES) if (!Array.isArray(parsed[type])) throw new Error('Invalid data file');
  return parsed;
}
function save(db) {
  fs.mkdirSync(DATA_DIR, {recursive: true, mode: 0o700});
  const tmp = DB_PATH + '.' + crypto.randomUUID() + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), {mode: 0o600});
  fs.renameSync(tmp, DB_PATH);
}
function all(type) { if (!TYPES.includes(type)) throw new Error('Bad record type'); return load()[type]; }
function create(type, fields) {
  if (!TYPES.includes(type)) throw new Error('Bad record type');
  const db = load();
  const record = { id: crypto.randomUUID(), ...fields, createdAt: new Date().toISOString() };
  db[type].push(record); save(db); return record;
}
function update(type, id, fields) {
  if (!TYPES.includes(type)) throw new Error('Bad record type');
  const db = load(); const record = db[type].find(r => r.id === id);
  if (!record) return null;
  Object.assign(record, fields); save(db); return record;
}
module.exports = {all, create, update, load, TYPES};
