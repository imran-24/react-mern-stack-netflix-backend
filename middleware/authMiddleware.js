import e from 'cors';
import jwt from 'jsonwebtoken';
import Memory from '../models/Memory.js';


export const verifyToken =  (req, res, next) => {
    let token;
    
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            try{
                // Get token from header
                token = req.headers.authorization.split(' ')[1];
                // Verify toekn
                jwt.verify(token, ""+process.env.JWT_SECRET_KEY, (err, user) => {
                    if(err) return res.status(403).json('Token is not valid!')
                    // Get user from token 
                    
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
        if(req.user.id === req.params.id ) next();
        else{
            res.status(403).json("You are not allowed to do that!")
        }
    })
}

export const verifyTokenAndCRUD = (req, res, next) => {
    verifyToken(req, res, async()=> {
        const memory = await Memory.findById(req.params.id);
        if(!memory) return res.status(401).json("Not Found");
        console.log(memory, req.user.id)
        if(req.user.id === memory.creator.toString() ) next();
        else{
            res.status(403).json("You are not allowed to do that!")
        }
    })
}

// export const verifyTokenAndAdmin = (req, res, next) => {
//     verifyToken(req, res, ()=> {
//         if(req.user.isAdmin) next();
//         else{
//             res.status(403).json("You are not allowed to do that!")
//         }
//     })
// }

