const INVALID_DATA_ERROR = {
  status: "BadRequest",
  code: 400,
};

const NOTFOUND_ERROR = {
  status: "NotFound",
  code: 404,
};

const DEFAULT_ERROR = {
  status: "InternalServerError",
  code: 500,
};

module.exports = {
  INVALID_DATA_ERROR,
  NOTFOUND_ERROR,
  DEFAULT_ERROR,
};
