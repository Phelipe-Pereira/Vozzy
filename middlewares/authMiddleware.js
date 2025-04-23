const jwt = require("jsonwebtoken");
const User = require("../models/user");

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido ou expirado" });
    }

    try {
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ error: "Erro ao autenticar usuário" });
    }
  });
}

module.exports = {
  authenticateToken
};