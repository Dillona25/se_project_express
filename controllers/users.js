const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");
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
      res.status(DEFAULT_ERROR).send({ message: "Internal server error" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(NOTFOUND_ERROR).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(INVALID_DATA_ERROR).send({ message: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Internal server error" });
      }
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!email) {
        throw new Error("Enter a valid email");
      }
      if (user) {
        throw new Error("Email already exists");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) =>
      User.create({ name, avatar, email, password: hash })
        .then((user) => {
          res.send({ data: user });
        })
        .catch((err) => {
          console.error(err);
          if (err.name === "ValidationError") {
            res.status(INVALID_DATA_ERROR).send({ message: err.message });
          } else {
            res
              .status(DEFAULT_ERROR)
              .send({ message: "Internal server error" });
          }
        }),
    );
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      } else {
        return bcrypt.compare(password, user.password);
      }
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error("Incorrect email or password"));
      } else {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.send({ token });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
