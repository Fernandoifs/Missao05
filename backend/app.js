const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// usei cors sem parametros, mas correto seria limitar o acesso
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/contracts', require('./routes/contracts'));

module.exports = app;
