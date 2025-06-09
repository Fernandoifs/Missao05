const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const users = require('../data/users');

router.get('/', auth(['admin']), (req, res) => {
  res.json({ data: users });
});

module.exports = router;
