const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function init() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
  });

  console.log('📦 Conectado ao MySQL. Iniciando banco de dados...');

  const schemaPath = path.join(__dirname, '../database/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  try {
    await connection.query(schema);
    console.log('✅ Banco de dados "sdvpro" inicializado com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao inicializar banco:', err.message);
  } finally {
    await connection.end();
  }
}

init();