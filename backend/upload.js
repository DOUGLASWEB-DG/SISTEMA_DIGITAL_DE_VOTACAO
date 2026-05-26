const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `vereador_${Date.now()}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const permitidos = /jpeg|jpg|png|webp/
    const valido = permitidos.test(file.mimetype)
    valido ? cb(null, true) : cb(new Error('Apenas imagens JPG, PNG ou WEBP'))
  }
})

module.exports = upload