const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");
const {
  DEFAULT_ERROR,
  NOTFOUND_ERROR,
  INVALID_DATA_ERROR,
  CONFLICT_ERROR,
  UNAUTHORIZED_ERROR,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      res.status(DEFAULT_ERROR).send({ message: "Internal server error" });
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
        throw new Error("Email is already in use!");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      return User.create({ name, avatar, email, password: hash });
    })
    .then((user) => {
      res.status(201).send({
        data: user,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Email is already in use!") {
        res.status(CONFLICT_ERROR).send({ message: err.message });
      } else if (err.message === "Enter a valid email") {
        res.status(INVALID_DATA_ERROR).send({ message: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(INVALID_DATA_ERROR).send({ message: "Invalid credentials" });
    return;
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      } else {
        return bcrypt.compare(password, user.password);
      }
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        res.status(UNAUTHORIZED_ERROR).send({ message: err.message });
      }
    });
};

const getCurrentUser = (req, res) => {
  const { _id: userId } = req.user;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("User not found"));
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.message === "User not found") {
        res.status(NOTFOUND_ERROR).send({ message: err.message });
      }
    });
};

//* Add a controller and route to update a user

module.exports = {
  getUsers,
  createUser,
  loginUser,
  getCurrentUser,
};
