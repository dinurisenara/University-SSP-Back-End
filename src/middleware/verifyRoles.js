// const verifyRoles = (...allowedRoles) =>{
//     return (req, res, next) => {  
        
//         if(!req?.type) {
//             return res.status(403).json({message: 'Forbidden'});
//         }
       
// }
// const typesArray = [...allowedRoles]   
// console.log(typesArray);    
// console.log(req.type);
// const result = req.type.map(type => typesArray.includes(type)).find(val => val === true);   
// if(!result){
//     return res.status(403).json({message: 'Forbidden'});    
// }
// next();
// }

// module.exports = verifyRoles;


// roleMiddleware.js
const jwt = require('jsonwebtoken');

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded.user;

            if (!allowedRoles.includes(req.user.type)) {
                return res.status(403).json({ msg: 'Role not authorized' });
            }

            next();
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error');
        }
    };
};

module.exports = verifyRoles;
