require('dotenv').config()
const express = require('express');
const { range } = require('express/lib/request');
const path = require('path');
const { Pool } = require('pg');
const urlencodedParser = require('urlencoded-parser');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const ebaySearch = require('./ebaySearch.js').ebaySearch;
pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
      rejectUnauthorized: false
    }
});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(urlencodedParser)
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT * FROM training_info");
      const results = { 'results': (result) ? result.rows : null};
      console.log(results);
      res.render('pages/cpu', results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
