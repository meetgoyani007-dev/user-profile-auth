const db = require("../models");
const User = db.user;

exports.userBoard = (req, res) => {
  User.find({
    _id: req.userId,
  })
    .limit(1)
    .exec((err, userDetail) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!userDetail) {
        return res.status(404).send({ message: "Unable to find user." });
      }
      let user = userDetail[0];
      let currentdate = new Date();
      var birthdate = user.birth_date.split(/[\/-]/);
      //Set birtthdate format in mm-dd-yyyy
      let fomatedDate = [
        birthdate[1],
        birthdate[0],
        currentdate.getFullYear(),
      ].join("-");

      let jsDate = new Date(fomatedDate);

      let curr = new Date();
      let firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
      let lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));

      //Here we check the birthdate is in current week or not.
      if (jsDate >= firstday && jsDate <= lastday && jsDate >= currentdate) {
        let diff = jsDate.getTime() - currentdate.getTime();
        let remainDays = Math.ceil(diff / (1000 * 3600 * 24));
        user.birth_date = remainDays + " days to go";
      } else {
        if (currentdate.toDateString() == jsDate.toDateString()) {
          user.birth_date = "It's your Birthday";
        }
      }
      res.status(200).send(user);
    });
};
