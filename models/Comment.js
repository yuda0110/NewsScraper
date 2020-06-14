const mongoose = require('mongoose')

// Save a reference to the Schema constructor
const Schema = mongoose.Schema

// Using the Schema constructor, create a new CommentSchema object
const CommentSchema = new Schema({
  body: {
    type: String,
    trim: true,
    required: "Comment (body) is Required"
  },
  created: {
    type: Date,
    default: Date.now
  },
})

// This creates our model from the above schema, using mongoose's model method
const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment