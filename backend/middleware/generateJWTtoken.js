const jwt = require("jsonwebtoken");
const JWT_SECRET = "NidkPwke9485hfKDLAndu9*#&$&$jcbPOqkPkshEYfk3848Asj"


const generateJWTtoken = async (user_id, email) => {
  return jwt.sign(
    { user_id: user_id, user_email: email }, // Payload
    JWT_SECRET, // Secret key
    { expiresIn: "3h" } // Expiration time
  );
};

module.exports = generateJWTtoken;  // CommonJS export

