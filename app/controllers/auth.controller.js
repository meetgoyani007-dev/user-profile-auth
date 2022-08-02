const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    birth_date: req.body.birth_date,
  });
  if(req.files){
    let upFile = req.files.file;
    let fileName = upFile.name; 
    upFile.mv("./uploads/"+fileName, (err) => {
      if(err){
        res.send(err);
      }else{
        Object.assign(user, {profile_image: fileName});
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      }
    });
  }else{
    user.save((err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      res.send({ message: "User was registered successfully!" });
    });
  }
  
};

exports.signin = (req, res) => {
  User.find({
    email: req.body.email
  }).limit(1)
    .exec((err, userDetail) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!userDetail) {
        return res.status(404).send({ message: "Unable to find user." });
      }
      let user = userDetail[0];
      var passwordIsValid = bcrypt.compareSync(
        req.body.password.toString(),
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }

      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      res.status(200).send({
        id: user._id,
        name: user.name,
        accessToken: token
      });
    });
};
