const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth',           require('./routes/auth'))
app.use('/api/sessoes',        require('./routes/sessoes'))
app.use('/api/vereadores',     require('./routes/vereadores'))
app.use('/api/protocolos',     require('./routes/protocolos'))
app.use('/api/configuracoes',  require('./routes/configuracoes'))

// Serve o frontend buildado
app.use(express.static(path.join(__dirname, '../dist')))

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err.stack)
  
  const statusCode = err.statusCode || 500
  const mensagem = err.message || 'Erro interno do servidor'
  
  res.status(statusCode).json({
    erro: mensagem,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

const PORT = process.env.PORT || 3333
app.listen(PORT, () => console.log(`DGPRO backend rodando na porta ${PORT}`))