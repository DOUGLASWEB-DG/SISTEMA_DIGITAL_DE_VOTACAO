const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

//Função assincrona para criar o usuário admin
async function createAdmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const email = 'admin@sdvpro.com.br';
  const senhaPlana = 'admin123';
  const senhaHash = await bcrypt.hash(senhaPlana, 10);

  try {
    const [rows] = await connection.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length > 0) {
      console.log('ℹ️ Usuário admin já existe.');
    } else {
      await connection.query(
        'INSERT INTO usuarios (nome, email, senha, cargo) VALUES (?, ?, ?, ?)',
        ['Administrador', email, senhaHash, 'ADMIN']
      );
      console.log('✅ Usuário admin criado com sucesso!');
      console.log('📧 E-mail: ' + email);
      console.log('🔑 Senha: ' + senhaPlana);
    }
  } catch (err) {
    console.error('❌ Erro ao criar admin:', err.message);
  } finally {
    await connection.end();
  }
}

createAdmin();
