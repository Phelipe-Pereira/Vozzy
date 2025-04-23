const Category = require("../models/category");

async function createCategory(req, res) {
  try {
    console.log('Dados recebidos:', req.body);
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        erro: "O nome da categoria é obrigatório"
      });
    }

    console.log('Criando categoria com:', { name, description });
    const category = await Category.create({ name, description });
    console.log('Categoria criada:', category);
    return res.status(201).json(category);
  } catch (err) {
    console.error('Erro ao criar categoria:', err);
    return res.status(500).json({
      erro: "Erro ao criar categoria",
      detalhes: err.message,
    });
  }
}

async function getCategories(req, res) {
  try {
    const categories = await Category.findAll();
    return res.status(200).json(categories);
  } catch (err) {
    return res.status(500).json({
      erro: "Erro ao buscar categorias",
      detalhes: err.message,
    });
  }
}

async function deleteCategory(req, res) {
  const { id } = req.params;

  try {
    await Category.destroy({ where: { id } });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({
      erro: "Erro ao deletar categoria",
      detalhes: err.message,
    });
  }
}

async function updateCategory(req, res) {
  const { id } = req.params;
  const { name, description } = req.body;
  const active = req.body.active !== undefined ? req.body.active : undefined;

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ erro: "Categoria não encontrada" });
    }

    const updateData = { name, description };
    if (active !== undefined) {
      updateData.active = active;
    }

    await category.update(updateData);
    return res.status(200).json(category);
  } catch (err) {
    return res.status(500).json({
      erro: "Erro ao atualizar categoria",
      detalhes: err.message,
    });
  }
}

async function getCategoryById(req, res) {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ erro: "Categoria não encontrada" });
    }

    return res.status(200).json(category);
  } catch (err) {
    return res.status(500).json({
      erro: "Erro ao buscar categoria por ID",
      detalhes: err.message,
    });
  }
}

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
  getCategoryById,
}; 