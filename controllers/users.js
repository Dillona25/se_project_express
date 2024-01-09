const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  DEFAULT_ERROR,
  NOTFOUND_ERROR,
  INVALID_DATA_ERROR,
  CONFLICT_ERROR,
  UNAUTHORIZED_ERROR,
} = require("../utils/errors");

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
      } else if (err.name === "ValidationError") {
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

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
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
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === "User not found") {
        res.status(NOTFOUND_ERROR).send({ message: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("User not found"));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === "User not found") {
        res.status(NOTFOUND_ERROR).send({ message: err.message });
      } else if (err.name === "ValidationError") {
        res.status(INVALID_DATA_ERROR).send({ message: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};

//* Add a controller and route to update a user

module.exports = {
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
};
