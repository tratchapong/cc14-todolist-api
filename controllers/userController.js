const path = require('path')
const {User} = require('../models')

exports.updateProfile = (req,res,next) => {
    const {aboutMe} = req.body
    User.update({
      aboutMe,
      image: req?.file?.filename || req.user.image
    }, { where : {id : req.user.id} }).then( rs => {
      res.json(rs)
    })

}