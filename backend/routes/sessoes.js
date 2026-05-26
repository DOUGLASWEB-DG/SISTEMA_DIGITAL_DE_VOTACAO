const router = require('express').Router()
const db = require('../db')

router.get('/', async (req, res) => {
  const { ano } = req.query
  const [rows] = await db.query(
    'SELECT * FROM sessoes WHERE exercicio = ? ORDER BY data DESC',
    [ano || new Date().getFullYear()]
  )
  res.json(rows)
})

router.get('/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM sessoes WHERE id = ?', [req.params.id])
  if (!rows.length) return res.status(404).json({ erro: 'Sessão não encontrada' })
  res.json(rows[0])
})

router.post('/', async (req, res) => {
  const { numero, tipo, data, hora, situacao, exercicio, periodo_legislativo_id, sessao } = req.body
  if (!data) return res.status(400).json({ erro: 'Data é obrigatória' })
  if (!tipo)  return res.status(400).json({ erro: 'Tipo é obrigatório' })
  const [result] = await db.query(
    'INSERT INTO sessoes (numero, tipo, data, hora, situacao, exercicio, periodo_legislativo_id, sessao) VALUES (?,?,?,?,?,?,?,?)',
    [numero, tipo, data, hora, situacao || 'ABERTA', exercicio, periodo_legislativo_id, sessao]
  )
  res.status(201).json({ id: result.insertId })
})

router.put('/:id', async (req, res) => {
  const { numero, tipo, data, hora, situacao, exercicio, periodo_legislativo_id, sessao } = req.body
  if (!data) return res.status(400).json({ erro: 'Data é obrigatória' })
  await db.query(
    'UPDATE sessoes SET numero=?, tipo=?, data=?, hora=?, situacao=?, exercicio=?, periodo_legislativo_id=?, sessao=? WHERE id=?',
    [numero, tipo, data, hora, situacao, exercicio, periodo_legislativo_id, sessao, req.params.id]
  )
  res.json({ ok: true })
})

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM sessoes WHERE id = ?', [req.params.id])
  res.json({ ok: true })
})

module.exports = router