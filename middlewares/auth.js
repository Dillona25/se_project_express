const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors/unauthorizedError");
const { JWT_SECRET } = require("../utils/config");

const authError = (next) => next(new UnauthorizedError("Authorization error"));

const extractBearerToken = (header) => header.replace("Bearer ", "");

const handleAuthorization = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return authError(next);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return authError(next);
  }

  req.user = payload;

  return next();
};

module.exports = { handleAuthorization };
