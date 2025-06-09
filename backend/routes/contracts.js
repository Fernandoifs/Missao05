const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getContracts } = require('../services/contractService');

router.get('/', auth(['admin']), (req, res) => {
  const { empresa, inicio } = req.query;
  
  const data = getContracts(empresa, inicio);
  if (!data.length) return res.status(404).json({ message: 'Nenhum contrato encontrado' });

  res.json({ data });
});

module.exports = router;
