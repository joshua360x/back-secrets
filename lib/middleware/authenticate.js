const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    console.log('cookies ----> ', req.cookies);
    const { session } = req.cookies;
    const payload = jwt.verify(session, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};
