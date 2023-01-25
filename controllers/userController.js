import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// LOGIN
 export const login = async (req, res) => {
   
    const { email, password} = req.body;
    
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
                   token: generateToken(user._id, others.isAdmin)
            })
        }
        res.status(401).json({message:"Wrong credentials!"})

        
    }
    catch(error){
        res.status(400).json(error.message);

    }
}

// SIGNUP
export const signup = async (req, res) => {
    const {username, email, password, profilePic} = req.body;
    console.log(req.body)
    try{

        if(!username || !email || !password ) {
            return res.status(400).json({message: "Please fill out all the fields"})
        }

        const existing = await User.findOne({username: username,email: email});
        console.log(existing)
        if(existing){
           return res.status(400).json({message:"Account already exists"})
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = await User.create({
            username,
            email,
            password: hashPass,
            profilePic
        })

        console.log(newUser)
        
        res.status(201).json({
            ...newUser,
            token: generateToken(newUser._id)
        })


    }
    catch(error){
        res.status(400).json(error.message);
    }
}


// UPDATE
export const updateUser = async (req, res) => {
   
    if(!req.body.password || !req.body.username || !req.body.email) return res.status(400).json("Please fill out all the fields")
    if(req.body.password){
        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hashPass
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set: req.body
        }, {new: true});
        res.status(200).json(updatedUser)
    }
    catch(error){
        res.status.json(error)
    }
}

// DELETE
export const deleteUser = async (req, res) => {
    try{

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted')
           
    }

    catch(error){
        res.status(500).json(error);
    } 
}

// save 
export const addToSave = async (req, res) => {
    const data = req.body;   // get the query 
 
    try{

        const user = await User.findById(data?.userId);
        
        if(!user){ return res.status(404).json("User not found")}
        const {likeMovies} = user;
        
        const movieAlreadyLiked = likeMovies.find( ({movieId}) => movieId === data?.movieId)
        console.log(movieAlreadyLiked)
        if(movieAlreadyLiked){ return res.status(404).json("Saved Already") } 
        await User.findByIdAndUpdate(
            data?.userId,
            {$push:{"likeMovies": data}}, 
            {new: true});
        res.status(200).json(data)
        
    }

    catch(error){
        res.status(500).json(error.message);
    } 
}


export const removeFromSave = async (req, res) => {
    const data = req.body;   // get the query 
    console.log(data)
    try{
        const user = await User.findById(data?.userId);
        if(!user){ return res.status(404).json("User not found")}
        const {likeMovies} = user;
        const movieAlreadyLiked = likeMovies.find( ({movieId}) => movieId === data?.movieId)
        if(movieAlreadyLiked){ 
            await User.findByIdAndUpdate(
                data?.userId,
                {$pull:{"likeMovies": data}}, 
                {new: true});
            res.status(200).json(data)
            }
    }

    catch(error){
        res.status(500).json(error.message);
    } 
}

// GET ALL saved 
export const getSaved = async (req, res) => {
    const id = req.params.id;   // get the query 
    try{

       const user = await User.findById(id);
       if(!user){ return res.status(404).json("User not found")}
       console.log(user)
       res.status(200).json(user?.likeMovies)
       
    }

    catch(error){
        res.status(500).json(error);
    } 
}

// GET 
export const getUser = async (req, res) => {
    try{

        const searchedUser = await User.findById(req.params.id);
        res.status(200).json(searchedUser)
           
    }

    catch(error){
        res.status(500).json(error);
    } 
}

// GET ALL USERS
export const getAllUser = async (req, res) => {
    const query = req.query.new;   // get the query 
    try{

        const allUsers = query ? await User.find().sort({_id: -1}).limit(5) : await User.find();
        res.status(200).json(allUsers)
           
    }

    catch(error){
        res.status(500).json(error);
    } 
}




// GET USER STATS
export const getUserStats = async (req, res) => {
    // new date 
    const date = new Date();
    const lastyear = new Date(date.setFullYear(date.getFullYear()- 1))
    try{
        const data = await User.aggregate([
            // {$match: {createdAt: {$gte: lastyear}}},
            {
                $project: {
                    month: {$month: '$createdAt'},
                },
            },
            {
                $group: {
                    _id: '$month',
                    total: {$sum: 1 }
                }
            }
        ])
        
        res.status(200).json(data)
           
    }

    catch(error){
        res.status(500).json(error);
    } 
}

const generateToken = (id, isAdmin) =>{
    return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET_KEY, {expiresIn: '30d'})
}