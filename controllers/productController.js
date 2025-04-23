const Product = require("../models/product");
const Category = require("../models/category");

async function createProduct(req, res) {
  const { name, description, price, categoryId } = req.body;

  try {
    // Validar se a categoria existe
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ erro: "Categoria não encontrada" });
    }

    const product = await Product.create({ name, description, price, categoryId });
    return res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({
      erro: "Erro ao criar produto",
      detalhes: err.message,
    });
  }
}

async function getProducts(req, res) {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, as: 'category' }],
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({
      erro: "Erro ao buscar produtos",
      detalhes: err.message,
    });
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    await product.destroy();
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({
      erro: "Erro ao deletar produto",
      detalhes: err.message,
    });
  }
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, description, price, categoryId } = req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    // Validar se a categoria existe
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(400).json({ erro: "Categoria não encontrada" });
      }
    }

    await product.update({ name, description, price, categoryId });
    
    // Buscar o produto atualizado com a categoria
    const updatedProduct = await Product.findByPk(id, {
      include: [{ model: Category, as: 'category' }]
    });
    
    return res.status(200).json(updatedProduct);
  } catch (err) {
    return res.status(500).json({
      erro: "Erro ao atualizar produto",
      detalhes: err.message,
    });
  }
}

async function getProductById(req, res) {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id, {
      include: [{ model: Category, as: 'category' }]
    });
    
    if (!product) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({
      erro: "Erro ao buscar produto por ID",
      detalhes: err.message,
    });
  }
}

module.exports = {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  getProductById,
};
