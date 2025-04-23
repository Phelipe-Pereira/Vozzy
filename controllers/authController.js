const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ erro: "Usuário já existe" });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(201).json({ token });
  } catch (err) {
    return res.status(500).json({ erro: "Erro ao criar usuário" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ erro: "O campo email é obrigatório" });
    }
    if (!password) {
      return res.status(400).json({ erro: "O campo senha é obrigatório" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ erro: "Formato de email inválido" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ erro: "Email ou senha inválidos" });
    }

    const senhaValida = await user.checkPassword(password);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Email ou senha inválidos" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    return res.status(500).json({ 
      erro: "Erro ao fazer login",
      detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

async function logout(req, res) {
  res.clearCookie('token');
  return res.status(200).json({ mensagem: "Logout realizado com sucesso" });
}

async function getProfile(req, res) {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    return res.status(500).json({ erro: "Erro ao buscar perfil" });
  }
}

async function updateProfile(req, res) {
  const { name, email } = req.body;

  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    await user.update({ name, email });

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    return res.status(500).json({ erro: "Erro ao atualizar perfil" });
  }
}

async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(currentPassword, user.password);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha atual incorreta" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    return res.status(200).json({ mensagem: "Senha alterada com sucesso" });
  } catch (err) {
    return res.status(500).json({ erro: "Erro ao alterar senha" });
  }
}

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword
};



