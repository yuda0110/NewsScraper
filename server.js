const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')

// Our scraping tools ====
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require('axios')
const cheerio = require('cheerio')
// ====

const db = require('./models') // Require all models

const PORT = process.env.PORT || 3000
// Initialize Express
const app = express()

// Use morgan logger for logging requests
app.use(logger('dev'))
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// Make public a static folder
app.use(express.static('public'))

// Connect to the Mongo DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI)

// Set Handlebars as the default templating engine.
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


// ************ Routes ************

// A GET route for scraping the https://www.infoworld.com/category/javascript/ website
app.get('/scrape', (req, res) => {
  // First, we grab the body of the html with axios
  axios.get('https://www.infoworld.com/category/javascript/').then(response => {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data)
    const domain = 'https://www.infoworld.com'
    const articleIdArr = []

    // Headline - the title of the article
    // Summary - a short summary of the article
    // URL - the url to the original article
    // Feel free to add more content to your database (photos, bylines, and so on)

    db.Article.find({}).then(data => {
      data.forEach(item => {
        articleIdArr.push(item.articleId)
      })

      console.log(articleIdArr)

      $('.river-well.article').each((i, element) => {
        const result = {}

        result.articleId = $(element).attr('data-id')
        result.headline = $(element).find('h3').find('a').text().trim()
        result.summary = $(element).find('h4').text().trim()
        result.link = `${domain}${$(element).find('h3').find('a').attr('href')}`
        result.imgUrl = $(element).find('img.lazy').attr('data-original')

        console.log('result.articleId: ' + result.articleId)

        if (!articleIdArr.includes(result.articleId)) {
          // Create a new Article using the `result` object built from scraping
          db.Article.create(result)
            .then(dbArticle => {
              // View the added result in the console
              console.log(dbArticle)
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    }).catch(err => {
      console.log(err)
    })

    // Log scrape complete
    console.log('Scrape Complete')

  }).then(result => {
    res.redirect('/')
  })
})

// Route for getting all Articles from the db
app.get('/', (req, res) => {
  db.Article.find({}).then(data => {
    res.render('index', {
      articles: data.map(article => article.toJSON())
    })
  }).catch(err => {
    console.log(err)
  })
})

// Route for getting all Articles from the db
app.get('/articles', (req, res) => {
  db.Article.find({}).then(data => {
    res.json(data)
  }).catch(err => {
    res.json(err)
  })
})

// Route for grabbing a specific Article by id, populate it with it's comments
app.get('/articles/:id', (req, res) => {
  db.Article.findOne({ _id: req.params.id })
    .populate('comments')
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      res.json(err)
    })
})

// Route for saving/updating an Article's associated Comment
app.post('/articles/:id', (req, res) => {
  // Save the new comment that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "comments" property with the _id of the new note
  db.Comment.create(req.body).then(dbComment => {
    return db.Article.findOneAndUpdate(
      {
        _id: req.params.id
      },
      {
        $push: {
          comments: dbComment._id
        }
      },
      {
        new: true
      }
    )
  }).then(dbArticle => {
    // If we were able to successfully update an Article, send it back to the client
    res.json(dbArticle)
  }).catch(err => {
    // If an error occurred, send it to the client
    res.json(err)
  })
})


// Start the server
app.listen(PORT, () => {
  console.log("App running on port " + PORT + "!");
});


