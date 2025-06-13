const jwt = require("jsonwebtoken");
const { error } = require("../utils/responseWrapper");
const User = require("../modules/User");

module.exports = async (req, res, next) => {
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    return res
      .status(401)
      .send(error(401, "Authorization header is required."));
  }
  const accessToken = req.headers.authorization.replace("Bearer ", "");
  try {
    const decode = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );

    req._id = decode.id;
    const user = await User.findById(req._id);

    if (!user) {
      return res.send(error(404, "User Not Regestered ..."));
    }

    next();
  } catch (e) {
    return res.send(error(401, "Invalid Access Token"));
  }
};
