const Feedback = require("../models/feedback");
const User = require("../models/user");
const Product = require("../models/product");

async function createFeedback(req, res) {
  const { productId, rating, comment } = req.body;
  const userId = req.user.id;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(400).json({ erro: "Produto não encontrado" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ erro: "Avaliação deve ser entre 1 e 5" });
    }

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ erro: "Comentário é obrigatório" });
    }

    const feedback = await Feedback.create({ 
      userId, 
      productId, 
      rating, 
      comment 
    });

    const feedbackCompleto = await Feedback.findByPk(feedback.id, {
      include: [
        { 
          model: Product,
          as: 'Product',
          attributes: ['name']
        }
      ]
    });

    return res.status(201).json(feedbackCompleto);
  } catch (err) {
    console.error('Erro ao criar feedback:', err);
    return res.status(500).json({
      erro: "Erro ao criar feedback",
      detalhes: err.message
    });
  }
}

async function getFeedbacks(req, res) {
  try {
    const feedbacks = await Feedback.findAll({
      include: [
        { 
          model: Product,
          as: 'Product',
          attributes: ['name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(feedbacks);
  } catch (err) {
    console.error('Erro ao buscar feedbacks:', err);
    return res.status(500).json({
      erro: "Erro ao buscar feedbacks",
      detalhes: err.message
    });
  }
}

async function deleteFeedback(req, res) {
  const { id } = req.params;

  try {
    const feedback = await Feedback.findByPk(id);
    if (!feedback) {
      return res.status(404).json({ erro: "Feedback não encontrado" });
    }

    if (feedback.userId !== req.user.id) {
      return res.status(403).json({ erro: "Não autorizado" });
    }

    await feedback.destroy();
    return res.status(204).send();
  } catch (err) {
    console.error('Erro ao deletar feedback:', err);
    return res.status(500).json({
      erro: "Erro ao deletar feedback",
      detalhes: err.message
    });
  }
}

async function updateFeedback(req, res) {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const feedback = await Feedback.findByPk(id);
    if (!feedback) {
      return res.status(404).json({ erro: "Feedback não encontrado" });
    }

    if (feedback.userId !== req.user.id) {
      return res.status(403).json({ erro: "Não autorizado" });
    }

    // Validações
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ erro: "Avaliação deve ser entre 1 e 5" });
    }

    if (comment && comment.trim().length === 0) {
      return res.status(400).json({ erro: "Comentário não pode estar vazio" });
    }

    await feedback.update({ rating, comment });
    
    // Retornar o feedback atualizado com as relações
    const feedbackAtualizado = await Feedback.findByPk(id, {
      include: [
        { model: User, attributes: ['name'] },
        { model: Product, attributes: ['name'] }
      ]
    });
    
    return res.status(200).json(feedbackAtualizado);
  } catch (err) {
    console.error('Erro ao atualizar feedback:', err);
    return res.status(500).json({
      erro: "Erro ao atualizar feedback",
      detalhes: err.message
    });
  }
}

async function getFeedbackById(req, res) {
  const { id } = req.params;

  try {
    const feedback = await Feedback.findByPk(id, {
      include: [
        { model: User, attributes: ['name'] },
        { model: Product, attributes: ['name'] }
      ]
    });
      
    if (!feedback) {
      return res.status(404).json({ erro: "Feedback não encontrado" });
    }

    return res.status(200).json(feedback);
  } catch (err) {
    return res.status(500).json({
      erro: "Erro ao buscar feedback por ID",
      detalhes: err.message,
    });
  }
}

module.exports = {
  createFeedback,
  getFeedbacks,
  deleteFeedback,
  updateFeedback,
  getFeedbackById,
};
