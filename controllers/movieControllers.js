import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import Movie from '../models/Movie.js';


// CREATE
export const createMovie = async (req, res) => {
    console.log(req.body)
    const {title, desc, posterImg, smallImg, titleImg, trailer, video, year, limit, genre, isSeries } = req.body;
    console.log(title, desc, posterImg, smallImg, titleImg, trailer, video, year, limit, genre, isSeries )
    try{
        const newMovie = await Movie.create({
            title,
            desc,
            posterImg,
            smallImg,
            titleImg, 
            trailer, 
            video, 
            year, 
            limit, 
            genre, 
            isSeries 
        })

        res.status(201).json(newMovie)


    }
    catch(error){
        res.status(400).json(error.message);
    }
}


// UPDATE
export const updateMovie = async (req, res) => {
    
    const {title, desc, posterImg, smallImg, titleImg, trailer, video, year, limit, genre, isSeries } = req.body;
    
    try{
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id,{
            $set: req.body
        }, {new: true});
        res.status(200).json(updatedMovie)
    }
    catch(error){
        res.status(500).json(error.message)
    }
}

// LIKE
// export const likeMovie = async (req, res) => {
    
    
//     try{
//         const Movie = await Movie.findById(req.params.id)
//         if(!Movie) return res.status(404).json('Not found')
        
//         if(Movie.likes.includes((req.body.userId))){
//             const updatedMovie = await Movie.findByIdAndUpdate(req.params.id,
//                 {$pull:{"likes": req.body.userId}}, {new: true});
//             res.status(200).json(updatedMovie)
//         }
//         else{
//             const updatedMovie = await Movie.findByIdAndUpdate(req.params.id,
//                 {$push:{"likes": req.body.userId}}, {new: true});
//             res.status(200).json(updatedMovie)
//         }
        
        
//     }
//     catch(error){
//         res.status(500).json(error)
//     }
// }


// DELETE
export const deleteMovie = async (req, res) => {
    try{

        await Movie.findByIdAndDelete(req.params.id);
        res.status(200).json('Movie has been deleted')
           
    }

    catch(error){
        res.status(500).json(error.message);
    } 
}

// GET 

export const getMovie = async (req, res) => {
    try{
        const searchedMovie = await Movie.findById(req.params.id);
        res.status(200).json(searchedMovie)
    }

    catch(error){
        res.status(500).json(error.message);
    } 
}

//  GET RANDOM

export const getRandomMovie = async(req, res) => {
    const type = req.query.type;
    let movie;
    try{
        if(type === 'series') {
            movie = await Movie.aggregate([
                {$match: {isSeries: true}},
                {$sample: { size: 1}}
            ])
        }
        else{
            movie = await Movie.aggregate([
                {$match: {isSeries: false}},
                {$sample: { size: 1}}
            ])
        }
        res.status(200).json(movie)
    }
    catch(error){
        res.status(500).json(error.message);
    }
}

// GET ALL Movie
export const getAllMovie = async (req, res) => {
    const qNew = req.query.new;   // get the query 
    const qSearch = parseInt(req.query.genre);   // get the query 
    
    try{
        let movies;

        if(qNew) {
            movies = await Movie.find().sort({createdAt: -1}).limit(10)
        }
        else if(qSearch){
           
            movies = await Movie.find({
                genre: {
                    $in: [qSearch]
                },
                // message: {
                //     $in: [qSearch]
                // },
                });
            console.log(movies)
            
        }
        // else if(qCategory){
        //     Movies = await Movie.find({
        //         categories: {
        //             $in: [qCategory]
        //         },
        //     });
        // }
        else{ 
            movies = await Movie.find();
        }
        res.status(200).json(movies)
           
    }

    catch(error){
        res.status(500).json(error.message);
    } 
}

