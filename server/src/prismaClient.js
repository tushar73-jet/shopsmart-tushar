const Database = require('better-sqlite3');
const { PrismaBetterSQLite3 } = require('@prisma/adapter-better-sqlite3');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL || 'file:./dev.db';

// Extract the path from the connection string or use default
const dbFile = connectionString.startsWith('file:')
    ? connectionString.replace('file:', '')
    : './dev.db';

const sqlite = new Database(dbFile);
const adapter = new PrismaBetterSQLite3(sqlite);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
