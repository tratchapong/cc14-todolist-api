const DatauriParser = require('datauri/parser');
const cloudinary = require('../utils/cloudinary')
const path = require('path')
const {User} = require('../models')

exports.updateProfile = (req,res,next) => {
    const {aboutMe} = req.body
    User.update({
      aboutMe,
      image: req?.file?.filename || req.user.image
    }, { where : {id : req.user.id} }).then( rs => {
      res.json(rs)
    }).catch(next)

}

exports.updateProfileMem = async (req,res,next) => {
  const {aboutMe} = req.body
  // console.log(req.file)
  const publicId = req.user.image ? cloudinary.getPublicId(req.user.image) : null
  try {
    const parser = new DatauriParser

    const fileExt = path.extname(req.file.originalname)
    const buffer = req.file.buffer
    const fileContent = parser.format(fileExt, buffer).content
    // console.log(fileContent)
    const uploadResult = await cloudinary.upload(fileContent, publicId)
    console.log(uploadResult)
    User.update({
      aboutMe,
      image: uploadResult
    }, { where : {id : req.user.id} })
    res.json(uploadResult)
  }catch(err) {
    next(err)
  }
}