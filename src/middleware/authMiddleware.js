const jwt = require('jsonwebtoken');

const verifyJWT = (req,res, next)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({msg: 'Unauthorized'});
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            console.log(err)
            return res.status(403).json({msg: 'auth Forbidden'});
        }
        req.user = decoded.user.email;
        req.type = decoded.user.type;
        next();


    }
)


}
module.exports = verifyJWT;