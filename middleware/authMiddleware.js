import e from 'cors';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken =  (req, res, next) => {
    let token;
    
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            try{
                // Get token from header
                token = req.headers.authorization.split(' ')[1];
                // Verify toekn
                jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
                    if(err) return res.status(403).json('Token is not valid!')
                    // Get user from token 
                    console.log('user',user)
                    req.user = user;
                    next();
                });
                
            }
            catch(error){
                console.log(error);
                res.status(401).json({message: 'You are not authenticated'});
            }
        }
        else{
            res.status(401).json({message: 'You are not authenticated'});
        }
    
    
}

export const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, ()=> {
        if(req.user.id === req.params.id || req.user.isAdmin) next();
        else{
            res.status(403).json("You are not allowed to do that!")
        }
    })
}

export const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, ()=> {
        if(req.user.isAdmin) next();
        else{
            res.status(403).json("You are not allowed to do that!")
        }
    })
}

