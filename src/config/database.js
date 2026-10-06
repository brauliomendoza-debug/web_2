require('dotenv').config();
const { Sequelize } = require('sequelize');

const {
  DB_NAME = 'bd_Farmacia',
  DB_USER = 'postgres',
  DB_PASS = '',
  DB_HOST = 'localhost',
  DB_PORT = 5432,
} = process.env;

const databaseUrl =
  process.env.DATABASE_URL ||
  (/^postgres(?:ql)?:\/\//i.test(DB_HOST) ? DB_HOST : null);
const useSsl =
  Boolean(databaseUrl) ||
  process.env.DB_SSL === 'true' ||
  /\.render\.com$/i.test(DB_HOST);

const baseOptions = {
  dialect: 'postgres',
  logging: false,
  ...(!databaseUrl && {
    host: DB_HOST,
    port: Number(DB_PORT),
  }),
  ...(useSsl && {
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
  }),
};

// Conexión a la base de datos de la farmacia
const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, baseOptions)
  : new Sequelize(DB_NAME, DB_USER, DB_PASS, baseOptions);

/**
 * Crea la base de datos si no existe. PostgreSQL no admite
 * CREATE DATABASE IF NOT EXISTS, por eso primero se consulta pg_database.
 */
async function createDatabaseIfNotExists() {
  if (databaseUrl) {
    console.log('Usando la base de datos indicada en la URL; se omite su creación.');
    return;
  }

  const server = new Sequelize('postgres', DB_USER, DB_PASS, baseOptions);
  try {
    const [databases] = await server.query(
      'SELECT 1 FROM pg_database WHERE datname = :databaseName',
      { replacements: { databaseName: DB_NAME } }
    );

    if (databases.length === 0) {
      const quotedDatabaseName = `"${DB_NAME.replace(/"/g, '""')}"`;
      await server.query(`CREATE DATABASE ${quotedDatabaseName}`);
    }

    console.log(`Base de datos "${DB_NAME}" lista.`);
  } finally {
    await server.close();
  }
}

module.exports = { sequelize, createDatabaseIfNotExists };
