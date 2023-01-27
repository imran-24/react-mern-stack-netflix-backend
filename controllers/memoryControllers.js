
import Memory from '../models/Memory.js';


// CREATE
export const createMemory = async (req, res) => {
    const {creator, title, img, message, tags, username } = req.body;
    console.log(creator, title, img, message, tags)
    try{

        if(!creator  || !title || !img || !message || !tags ) {
            return res.status(400).json({message: "Please fill out all the fields"})
        }


        const newMemory = await Memory.create({
            creator,
            img, 
            title, 
            message, 
            tags, 
            username
        })

        res.status(201).json(newMemory)


    }
    catch(error){
        res.status(400).json(error.message);
    }
}


// UPDATE
export const updateMemory = async (req, res) => {
    
    const {creator, title, img, message, tags} = req.body;
    
    try{
        const updatedMemory = await Memory.findByIdAndUpdate(req.params.id,{
            $set: req.body
        }, {new: true});
        res.status(200).json(updatedMemory)
    }
    catch(error){
        res.status(500).json(error)
    }
}

// LIKE
export const likeMemory = async (req, res) => {
    
    
    try{
        const memory = await Memory.findById(req.params.id)
        if(!memory) return res.status(404).json('Not found')
        
        if(memory.likes.includes((req.body.userId))){
            const updatedMemory = await Memory.findByIdAndUpdate(req.params.id,
                {$pull:{"likes": req.body.userId}}, {new: true});
            res.status(200).json(updatedMemory)
        }
        else{
            const updatedMemory = await Memory.findByIdAndUpdate(req.params.id,
                {$push:{"likes": req.body.userId}}, {new: true});
            res.status(200).json(updatedMemory)
        }
        
        
    }
    catch(error){
        res.status(500).json(error)
    }
}


// DELETE
export const deleteMemory = async (req, res) => {
    try{

        await Memory.findByIdAndDelete(req.params.id);
        res.status(200).json('Memory has been deleted')
           
    }

    catch(error){
        res.status(500).json(error);
    } 
}

// GET 
export const getMemory = async (req, res) => {
    try{

        const searchedMemory = await Memory.findById(req.params.id);
        res.status(200).json(searchedMemory)
           
    }

    catch(error){
        res.status(500).json(error);
    } 
}

// GET ALL Memory
export const getAllMemory = async (req, res) => {
    const qNew = req.query.new;   // get the query 
    const qSearch = req.query.search;   // get the query 
    
    try{
        let memories;

        if(qNew) {
            memories = await Memory.find({
                creator: {
                    $in: [qNew]
                }
                }).sort({createdAt: -1}).limit(5)
        }
        else if(qSearch){
           
            memories = await Memory.find({
                title: {
                    $in: [qSearch]
                },
                // message: {
                //     $in: [qSearch]
                // },
                });
            
        }
        // else if(qCategory){
        //     Memorys = await Memory.find({
        //         categories: {
        //             $in: [qCategory]
        //         },
        //     });
        // }
        else{ 
            memories = await Memory.find();
        }
        res.status(200).json(memories)
           
    }

    catch(error){
        res.status(500).json(error);
    } 
}

