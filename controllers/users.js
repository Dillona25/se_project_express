const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      res.status(500).send({ message: "Error from getItem", err });
    });
};

const getUser = (req, res) => {
  const { _id: userId } = req.user;
  User.findById(userId)
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      res.status(500).send({ message: "Error from getUser", err });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error from createUser", err });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
