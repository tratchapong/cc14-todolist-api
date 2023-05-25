const express = require('express')
const upload = require('../middlewares/upload')
const { updateProfile } = require('../controllers/userController')

const router = express.Router()

router.put('/', upload.single('image'), updateProfile) 
// router.put('/', upload.single('image'), ()=>{}) 

module.exports = router