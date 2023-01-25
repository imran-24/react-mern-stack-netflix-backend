import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({

  title: {type: String, required: true, unique: true },
  desc: {type: String},
  posterImg:{type: String},
  smallImg:{type: String},
  titleImg:{type: String},
  trailer:{type: String},
  video:{type: String},
  year:{type: String},
  limit:{type: String},
  genre:{type: Array},
  isSeries:{type: Boolean, default: false}

},{
    timestamps: true
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
