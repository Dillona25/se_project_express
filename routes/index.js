const router = require("express").Router();
const { loginUser, createUser } = require("../controllers/users");
const clothingItem = require("./clothingItems");
const user = require("./users");
const { NOTFOUND_ERROR } = require("../utils/errors");

router.use("/items", clothingItem);
router.use("/users", user);
router.post("/signup", createUser);
router.post("/signin", loginUser);

router.use((req, res) => {
  res.status(NOTFOUND_ERROR).send({ message: "Route not found" });
});

module.exports = router;
