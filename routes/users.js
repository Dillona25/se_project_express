const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const { handleAuthorization } = require("../middlewares/auth");
const { validateUpdateUser } = require("../middlewares/validation");

router.get("/me", handleAuthorization, getCurrentUser);
router.patch("/me", handleAuthorization, validateUpdateUser, updateUser);

module.exports = router;
