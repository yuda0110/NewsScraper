const mongoose = require('mongoose')

// Save a reference to the Schema constructor
const Schema = mongoose.Schema

// Using the Schema constructor, create a new ArticleSchema object
const ArticleSchema = new Schema({
  articleId: {
    type: String,
    required: true,
    unique: true
  },
  headline: {
    type: String,
    trim: true,
    required: true
  },
  summary: {
    type: String,
    trim: true,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  imgUrl: {
    type: String,
    required: true
  },
  comments: [
    {
      type: Schema.Types.ObjectID,
      ref: 'Comment'
    }
  ]
})

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model('Article', ArticleSchema)

module.exports = Article