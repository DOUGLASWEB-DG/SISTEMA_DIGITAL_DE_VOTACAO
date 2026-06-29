const router = require('express').Router()
const db = require('../db')
const auth = require('../middleware/auth')

//Rotas para gerenciar sessões
router.get('/', async (req, res) => {
  const { ano } = req.query
  const [rows] = await db.query(
    'SELECT * FROM sessoes WHERE exercicio = ? ORDER BY data DESC',
    [ano || new Date().getFullYear()]
  )
  res.json(rows)
})

//Rota para buscar uma sessão específica por ID
router.get('/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM sessoes WHERE id = ?', [req.params.id])
  if (!rows.length) return res.status(404).json({ erro: 'Sessão não encontrada' })
  res.json(rows[0])
})

//Rota para criar uma nova sessão
router.post('/', auth, async (req, res) => {
  const { numero, tipo, data, hora, situacao, exercicio, periodo_legislativo_id, sessao } = req.body
  if (!data) return res.status(400).json({ erro: 'Data é obrigatória' })
  if (!tipo)  return res.status(400).json({ erro: 'Tipo é obrigatório' })
  const [result] = await db.query(
    'INSERT INTO sessoes (numero, tipo, data, hora, situacao, exercicio, periodo_legislativo_id, sessao) VALUES (?,?,?,?,?,?,?,?)',
    [numero, tipo, data, hora, situacao || 'ABERTA', exercicio, periodo_legislativo_id, sessao]
  )
  res.status(201).json({ id: result.insertId })
})

//Rota para atualizar uma sessão existente
router.put('/:id', auth, async (req, res) => {
  const { numero, tipo, data, hora, situacao, exercicio, periodo_legislativo_id, sessao } = req.body
  if (!data) return res.status(400).json({ erro: 'Data é obrigatória' })
  await db.query(
    'UPDATE sessoes SET numero=?, tipo=?, data=?, hora=?, situacao=?, exercicio=?, periodo_legislativo_id=?, sessao=? WHERE id=?',
    [numero, tipo, data, hora, situacao, exercicio, periodo_legislativo_id, sessao, req.params.id]
  )
  res.json({ ok: true })
})

//Rota para deletar uma sessão
router.delete('/:id', auth, async (req, res) => {
  await db.query('DELETE FROM sessoes WHERE id = ?', [req.params.id])
  res.json({ ok: true })
})

module.exports = router