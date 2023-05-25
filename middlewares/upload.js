const path = require('path')
const multer = require('multer')
// const dest = path.join(__dirname, 'pic')
// const upload = multer({dest})

const storage = multer.diskStorage({
  destination : function (req, file, cb) {
    cb(null, path.join(__dirname, '../pic'))
  },
  filename : function (req, file, cb) {
    const {id, name} = req.user
    let fullFileName = `${id}_${name}${path.extname(file.originalname)}`
    cb(null, fullFileName)
  }
})

const upload = multer({
  storage : storage
})

module.exports = upload

