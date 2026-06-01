//todAS AS ROTAS
const router = require('express').Router()
const db = require('../db')
const upload = require('../upload')
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM vereadores ORDER BY nome')
  res.json(rows)
})

router.get('/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM vereadores WHERE id = ?', [req.params.id])
  if (!rows.length) return res.status(404).json({ erro: 'Vereador não encontrado' })
  res.json(rows[0])
})

router.post('/', auth, async (req, res) => {
  const { nome, apelido, partido, mesa, responsabilidade_mesa, foto_url, resumo } = req.body
  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' })
  const [result] = await db.query(
    'INSERT INTO vereadores (nome, apelido, partido, mesa, responsabilidade_mesa, foto_url, resumo) VALUES (?,?,?,?,?,?,?)',
    [nome, apelido, partido, mesa, responsabilidade_mesa, foto_url, resumo]
  )
  res.status(201).json({ id: result.insertId })
})

router.put('/:id', auth, async (req, res) => {
  const { nome, apelido, partido, mesa, responsabilidade_mesa, foto_url, resumo, ativo } = req.body
  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' })
  await db.query(
    'UPDATE vereadores SET nome=?, apelido=?, partido=?, mesa=?, responsabilidade_mesa=?, foto_url=?, resumo=?, ativo=? WHERE id=?',
    [nome, apelido, partido, mesa, responsabilidade_mesa, foto_url, resumo, ativo ?? 1, req.params.id]
  )
  res.json({ ok: true })
})

router.post('/upload', auth, upload.single('foto'), (req, res) => {
  if (!req.file) return res.status(400).json({ erro: 'Nenhum arquivo enviado' })
  res.json({ url: `/uploads/${req.file.filename}` })
})
module.exports = router