const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function seedDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'sdvpro'
  });

  console.log('🚀 Iniciando reset e seeding do banco de dados...');

  try {
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE usuarios');
    await connection.query('TRUNCATE TABLE vereadores');
    await connection.query('TRUNCATE TABLE sessoes');
    await connection.query('TRUNCATE TABLE protocolos');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('🧹 Banco de dados limpo.');

    // 1. Usuário Admin
    const senhaAdmin = await bcrypt.hash('admin123', 10);
    await connection.query(
      'INSERT INTO usuarios (nome, email, senha, cargo) VALUES (?, ?, ?, ?)',
      ['Administrador do Sistema', 'admin@sdvpro.com.br', senhaAdmin, 'ADMIN']
    );
    console.log('👤 Usuário Admin criado.');

    // 2. Vereadores (Colunas: nome, partido, responsabilidade_mesa)
    const vereadores = [
      ['Dr. Carlos Alberto', 'MDB', 'Presidente'],
      ['Professora Helena', 'PT', 'Vice-Presidente'],
      ['Major Rocha', 'PL', '1º Secretário'],
      ['Engenheiro Ricardo', 'PSDB', null],
      ['Dra. Marina Silva', 'REDE', null],
      ['Roberto do Sindicato', 'PDT', null]
    ];
    for (const v of vereadores) {
      await connection.query('INSERT INTO vereadores (nome, partido, responsabilidade_mesa) VALUES (?, ?, ?)', v);
    }
    console.log(`👨‍⚖️ ${vereadores.length} vereadores cadastrados.`);

    // 3. Sessão (Colunas: numero, tipo, data, hora, situacao, exercicio, sessao)
    const hoje = new Date().toISOString().slice(0, 10);
    const exercicio = new Date().getFullYear();
    await connection.query(
      'INSERT INTO sessoes (numero, tipo, data, hora, situacao, exercicio, sessao) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [15, 'ORDINARIA', hoje, '19:00:00', 'ABERTA', exercicio, 'Sessão Ordinária de Teste']
    );
    console.log('📅 Sessão de hoje criada.');

    // 4. Protocolos (Colunas: numero, tipo, data, proponente, ementa, status, exercicio)
    const protocolos = [
      [1, 'PROJETO DE LEI', hoje, 'Dr. Carlos Alberto', 'Dispõe sobre a arborização urbana.', 'ABERTO', exercicio],
      [2, 'REQUERIMENTO', hoje, 'Dra. Marina Silva', 'Solicita reforma da praça central.', 'ABERTO', exercicio]
    ];
    for (const p of protocolos) {
      await connection.query(
        'INSERT INTO protocolos (numero, tipo, data, proponente, ementa, status, exercicio) VALUES (?, ?, ?, ?, ?, ?, ?)',
        p
      );
    }
    console.log('📄 2 Protocolos cadastrados.');

    console.log('\n✅ SEEDING COMPLETO COM SUCESSO!');
  } catch (err) {
    console.error('❌ Erro durante o seeding:', err);
  } finally {
    await connection.end();
  }
}

seedDatabase();
