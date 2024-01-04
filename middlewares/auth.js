const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const authError = (res) => {
  res.status(401).send({ message: "Authorization Error" });
};

const handleAuthError = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return authError(res);
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return authError(res);
  }

  req.user = payload;

  return next();
};

module.exports = {
  handleAuthError,
};
