import express from 'express'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import User from '../models/User.js';

const router = express.Router();

router.post('/signin', async (req, res) => {
   
    const {email, password} = req.body;
    
    try{

        if(!email || !password) 
        {
            return res.status(400).json({message: "Please fill out all the fields"})
        }

        const user = await User.findOne({email});
        console.log(user)
        
        if(user && await bcrypt.compare(password, user.password)){
            const {password: pass , ...others  } = user._doc
            
            return res.status(200).json({
                   ...others,
                   token: generateToken(user._id)
            })
            
        }
        res.status(401).json({message: 'Incorrect password'})

        
    }
    catch(error){
        res.status(400).json(error.message);

    }
})


router.post('/signup', async (req, res) => {
    const {name, email, password} = req.body;
    console.log(name, email, password)
    try{

        if(!name || !email || !password ) {
            return res.status(400).json({message: "Please fill out all the fields"})
        }

        const existing = await User.findOne({email});
        console.log(existing)
        if(existing) return res.status(400).json({message:"Account already exists"})

        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashPass,
        })


        
        res.status(201).json({
            name: newUser.name,
            email: newUser.email,
            password : newUser.password,
            token: generateToken(newUser._id)
        })


    }
    catch(error){
        res.status(400).json(error.message);
    }
});

const generateToken = (id) =>{
    console.log(process.env.JWT_SECRET_KEY)
    return jwt.sign({ id }, ""+process.env.JWT_SECRET_KEY, {expiresIn: '30d'})
}


export default router