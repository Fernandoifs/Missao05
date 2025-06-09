const express = require('express');
const router = express.Router();
const { login } = require('../services/userService');
const jwt = require('jsonwebtoken');


router.post('/login', (req, res) => {
  const user = login(req.body);
  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const token = jwt.sign(
    {
      username: user.username,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    token,
    username: user.username,
    role: user.role
  });
});

module.exports = router;
