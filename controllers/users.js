const router = require("express").Router();
const { users } = require("../models/user");

const getUsers = router.get("/users", (req, res) => {
  res.send(users);
});

const getUser = router.get("/users/:id", (req, res) => {
  const { id } = req.params;

  if (!users[id]) {
    res.send({ error: `This user doesn't exist` });
    return;
  }

  res.send(users[id]);
});

const newUser = router.post("/users", (req, res) => {
  const { name, avatar } = req.body;
});

module.exports = {
  getUsers,
  getUser,
  newUser,
};
