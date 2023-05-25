const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

exports.register = (req, res, next) => {
  const { username, password } = req.body;
  // Validation
  if (!username || !password) throw new Error("must have username & password");

  if (password.length < 4 || password.length > 10)
    throw new Error("Password must be 4-10 characters");

  bcrypt
    .hash(password, 10)
    .then((hashed) => {
      return User.create({
        name: username,
        password: hashed,
      });
    })
    .then((rs) => {
      res.status(201).json({ msg: `user: '${rs.name}' created` });
    })
    .catch(next);
};

exports.login = (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({
    where: { name: username },
  }).then((user) => {
      if (!user) 
        throw new Error("Cannot Login 1");
      return Promise.all([ bcrypt.compare(password, user.password), Promise.resolve(user)]) 
    }).then( ([pwOk, user]) => {
        if(!pwOk)
          throw new Error("Cannot Login 2")
        const payload = {
            id: user.id,
            name: user.name
        }
        const token = jwt.sign(payload, `${process.env.JWT_SECRETKEY}`, {expiresIn: '30d'})
        res.json({token : token})
    }).catch(next)
};

exports.getMe = (req,res,next) => {
  const {id, name, image, aboutMe} = req.user
  res.json({id, name, image, aboutMe})
}