const router = require("express").Router();
const authorization = require("../middlewares/auth");
const { updateUser } = require("../controllers/users");

router.patch("/me", authorization.handleAuthError, updateUser);

module.exports = router;
