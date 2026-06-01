const router = require('express').Router()
const db = require('../db')
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM configuracoes')
  const config = {}
  rows.forEach(r => config[r.chave] = r.valor)
  res.json(config)
})

router.put('/', auth, async (req, res) => {
  const entries = Object.entries(req.body)
  for (const [chave, valor] of entries) {
    await db.query(
      'INSERT INTO configuracoes (chave, valor) VALUES (?,?) ON DUPLICATE KEY UPDATE valor=?',
      [chave, valor, valor]
    )
  }
  res.json({ ok: true })
})

module.exports = router
