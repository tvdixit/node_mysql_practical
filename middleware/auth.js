const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const auth = () => async (req, res, next) => {
  const headerToken = req.headers.authorization;
  if (!headerToken) {
    return res.status(401).json({
      status: 401,
      message: "No token provided.",
    });
  }
  if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
    return res.status(401).json({
      status: 401,
      message: "Invalid token.",
    });
  }
  const token = headerToken && headerToken.split(" ")[1];
  const decodedToken = jwt.decode(token, process.env.SecretKey);

  if (!decodedToken) {
    return res.status(401).json({
      status: 401,
      message: "Invalid token.",
    });
  }
  req.user = {
    user_id: decodedToken.userId,
  };
  next();
};

module.exports = {
  auth,
};
