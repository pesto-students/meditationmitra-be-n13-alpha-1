const jwt = require("jsonwebtoken");

const generateToken = (userdata) => {
  const expire = new Date().getTime();
  console.log(expire);
  console.log(userdata);

  return jwt.sign(JSON.stringify({ userdata, expire }), process.env.JWT_SECRET);
};

const auth = (req, res, next) => {
  let token = req.header("Authorization");
  if (!token)
    return res.status(401).send("Access Denied, Not an Authorized User");

  try {
    token = token.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.expire)
      return res.status(401).send("Access Denied, Not an Authorized User");
    req.user = decoded.userdata;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token.");
  }
};
module.exports = { auth, generateToken };
