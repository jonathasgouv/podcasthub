const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/:view', (req, res) => {
  view = req.params.view
  res.redirect(`..#view=${view}`);
});

app.get('/:view/:param1', (req, res) => {
  console.log(req.params)
  view = req.params.view
  param1 = req.params.param1
  res.redirect(`..#view=${view}&param1=${param1}`);
});

app.listen(3000, () => console.log('server started'));
