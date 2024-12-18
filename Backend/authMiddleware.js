const JWT_SECRET = require('./config');
const jwt = require('jsonwebtoken');

const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Invalid token" });
    }
    const token = authHeader.split(" ")[1]; 
    try{
        const validToken = jwt.verify(token,JWT_SECRET);
        if(validToken.userId ){
            req.userId = validToken.userId;
            next();
        }
    }
    catch(err){
        return res.status(403).json({
            message: err
        })
    }
}

module.exports = authMiddleware;