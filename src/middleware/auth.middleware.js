const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

const protect = async (req, res, next) => {
 try{
  const authHeader = req.headers.authorization;

  if(!authHeader || !authHeader.startsWith("Bearer ")){
    return res.status(401).json({
       success: false,
        message: "Authentication required. Provide a Bearer token."
    })
  }

  const token  = authHeader.split(" ")[1];
  const decoded = jwt.verify(token , process.env.JWT_SECRET)
  const employee = await Employee.findById(decoded.id)

  if(!employee){
    return res.status(401).json({
      success: false,
     message: "The account associated with this token no longer exists."

    })
  }
  req.user = employee;
  next();
 }catch(error){
  if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token."
      });
    }
    next(error);
 }
};

module.exports = { protect };
