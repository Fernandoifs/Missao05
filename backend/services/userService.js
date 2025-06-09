const users = require('../data/users');

function login({ username, password }) {
  return users.find(u => u.username === username && u.password === password);
}

module.exports = { login };