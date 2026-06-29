const router = require('express').Router()
const db = require('../db')
const auth = require('../middleware/auth')

//Rotas para gerenciar protocolos
router.get('/', async (req, res) => {
  const { ano, busca } = req.query
  let sql = 'SELECT * FROM protocolos WHERE exercicio = ?'
  const params = [ano || new Date().getFullYear()]
  if (busca) { sql += ' AND (ementa LIKE ? OR proponente LIKE ?)'; params.push(`%${busca}%`, `%${busca}%`) }
  sql += ' ORDER BY data DESC'
  const [rows] = await db.query(sql, params)
  res.json(rows)
})

//Rota para buscar um protocolo específico por ID
router.get('/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM protocolos WHERE id = ?', [req.params.id])
  if (!rows.length) return res.status(404).json({ erro: 'Protocolo não encontrado' })
  res.json(rows[0])
})

//Rota para criar um novo protocolo
router.post('/', auth, async (req, res) => {
  const { numero, tipo, data, proponente, ementa, status, exercicio, votacao } = req.body
  if (!proponente) return res.status(400).json({ erro: 'Proponente é obrigatório' })
  if (!data)       return res.status(400).json({ erro: 'Data é obrigatória' })
  const [result] = await db.query(
    'INSERT INTO protocolos (numero, tipo, data, proponente, ementa, status, exercicio, votacao) VALUES (?,?,?,?,?,?,?,?)',
    [numero, tipo, data, proponente, ementa, status || 'ABERTO', exercicio, votacao]
  )
  res.status(201).json({ id: result.insertId })
})

//Rota para atualizar um protocolo existente
router.put('/:id', auth, async (req, res) => {
  const { numero, tipo, data, proponente, ementa, status, exercicio, votacao } = req.body
  if (!proponente) return res.status(400).json({ erro: 'Proponente é obrigatório' })
  await db.query(
    'UPDATE protocolos SET numero=?, tipo=?, data=?, proponente=?, ementa=?, status=?, exercicio=?, votacao=? WHERE id=?',
    [numero, tipo, data, proponente, ementa, status, exercicio, votacao, req.params.id]
  )
  res.json({ ok: true })
})

//Rota para deletar um protocolo
router.delete('/:id', auth, async (req, res) => {
  await db.query('DELETE FROM protocolos WHERE id = ?', [req.params.id])
  res.json({ ok: true })
})

module.exports = router