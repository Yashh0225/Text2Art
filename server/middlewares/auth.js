import jwt from 'jsonwebtoken';

// Middleware for user authentication
// This middleware checks if the user is authenticated by verifying the JWT token
const userAuth = async (req, res, next) => {
    //find token

    const {token} = req.headers;

    if(!token){
        return res.json({success: false, message: 'No token provided, authorization denied'});
    }

    try{
        //verify token
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        //add user from payload
        if(tokenDecode.id){
            req.body.userId = tokenDecode.id;
            next();
        }else{
            return res.json({success: false, message: 'Invalid token'});
        }
        
    } catch(error){
        console.log(error);
        res.json({success: false, message: 'Token verification failed'});
    }
};

export default userAuth;