const _Database = require('better-sqlite3');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL || 'file:./dev.db';
const dbPath = connectionString.replace('file:', '');

const db = new _Database(dbPath);
const adapter = new PrismaBetterSqlite3(db, { url: connectionString });
const prisma = new PrismaClient({ adapter });


module.exports = prisma;
