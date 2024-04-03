
const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const expressAsyncErrors = require('express-async-errors');

let planets = [
  {
    id: 1,
    name: 'Earth',
  },
  {
    id: 2,
    name: 'Mars',
  },
];

const app = express();

app.use(express.json()); 
app.use(morgan('dev')); 

app.get('/planets', (req, res) => {
  res.json(planets);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

expressAsyncErrors();
