const UserSchema = require("../model/UserSchema");
const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonwebtoken");

const signup = async (req, res) => {
  UserSchema.findOne({ username: req.body.username })
    .then((result) => {
      if (result == null) {
        bcrypt.hash(req.body.password, 10, function (err, hash) {
          if (err) {
            return res.status(500).json({ message: "something went wrong!" });
          }
          const user = new UserSchema({
            username: req.body.username,
            fullname: req.body.fullname,
            password: hash,
          });
          user
            .save()
            .then((saveData) => {
              res.status(201).json({ message: "user was saved!" });
            })
            .catch((error) => {
              res.status(500).json(error);
            });
        });
        //add new record
        //1-> password ->hash
        //2-> save
      } else {
        res.status(409).json({ message: "email already exits!" });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};
const login = async (req, res) => {
  UserSchema.findOne({ username: req.body.username })
    .then((selectedUser) => {
      if (selectedUser == null) {
        return res.status(404).json({ message: "username not found!" });
      } else {
        bcrypt.compare(
          req.body.password,
          selectedUser.password,
          function (err, result) {
            if (err) {
              return res.status(500).json(error);
            }

            if (result) {
              const expiresIn = 3600;
              const token = jsonWebToken.sign(
                { username: selectedUser.username },
                process.env.SECRET_KEY,
                { expiresIn }
              );

              res.setHeader("Authorization", `Bearar ${token}`);

              return res.status(200).json({ message: "cheack the headers" });
            } else {
              return res
                .status(401)
                .json({ message: "password is incorrect!" });
            }
          }
        );
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};
module.exports = {
  signup,
  login,
};
