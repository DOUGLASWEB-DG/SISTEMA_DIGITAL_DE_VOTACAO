const mysql = require('mysql2/promise')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })

//Cria uma conexão com o banco de dados MySQL usando as variáveis de ambiente definidas no arquivo .env. A conexão é configurada para permitir múltiplas conexões simultâneas, com um limite máximo de 10 conexões ativas ao mesmo tempo. A conexão é exportada como um pool de conexões para ser utilizada em outras partes da aplicação.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
})

module.exports = pool