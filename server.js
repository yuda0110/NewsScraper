const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')

// Our scraping tools ====
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require('axios')
const cheerio = require('cheerio')
// ====

const db = require('./models') // Require all models

const PORT = 3000;
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


// ************ Routes ************
// A GET route for scraping the https://www.infoworld.com/category/javascript/ website
app.get('/scrape', (req, res) => {
  // First, we grab the body of the html with axios
  axios.get('https://www.infoworld.com/category/javascript/').then(response => {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data)
    const domain = 'https://www.infoworld.com'

    // Headline - the title of the article
    // Summary - a short summary of the article
    // URL - the url to the original article
    // Feel free to add more content to your database (photos, bylines, and so on)

    $('.river-well.article').each((i, element) => {
      const result = {}

      result.headline = $(element).find('h3').find('a').text().trim()
      result.summary = $(element).find('h4').text().trim()
      result.url = `${domain}${$(element).find('h3').find('a').attr('href')}`
      result.imgUrl = $(element).find('img.lazy').attr('data-original')
      console.log(result)
    })

    // Send a message to the client
    res.send("Scrape Complete");

  })
})

// Start the server
app.listen(PORT, () => {
  console.log("App running on port " + PORT + "!");
});


