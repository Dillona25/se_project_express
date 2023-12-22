const User = require("../models/user");
const {
  DEFAULT_ERROR,
  NOTFOUND_ERROR,
  INVALID_DATA_ERROR,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      res.status(DEFAULT_ERROR.code).send({ message: "Internal server error" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res.status(NOTFOUND_ERROR.code).send({ message: err.message });
      } else {
        res
          .status(DEFAULT_ERROR.code)
          .send({ message: "Internal server error" });
      }
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(INVALID_DATA_ERROR.code).send({ message: err.message });
      } else {
        res
          .status(DEFAULT_ERROR.code)
          .send({ message: "Internal server error" });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
