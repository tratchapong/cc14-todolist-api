const express = require('express')
const upload = require('../middlewares/upload')
const uploadMem = require('../middlewares/uploadMem')
const { updateProfile, updateProfileMem } = require('../controllers/userController')

const router = express.Router()

// router.put('/', upload.single('image'), updateProfile) 
router.put('/', uploadMem.single('image'), updateProfileMem) 
// router.put('/', upload.single('image'), ()=>{}) 

module.exports = router