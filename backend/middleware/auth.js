const jwt = require('jsonwebtoken');
const users = require('../data/users');

function authMiddleware(roles = []) {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Não autorizado' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = users.find(u => u.username === payload.username);

      console.log('Payload do token:', payload);
      console.log('Usuário encontrado:', user);
      console.log('Roles permitidos:', roles);

      if (!user) {
        return res.status(403).json({ message: 'Usuário não encontrado' });
      }

      if (
        roles.length &&
        !roles.map(r => r.toLowerCase()).includes(user.role.toLowerCase())
      ) {
        return res.status(403).json({ message: 'Acesso negado' });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  };
}

module.exports = authMiddleware;
