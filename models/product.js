const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Já existe um produto com este nome'
    },
    validate: {
      notEmpty: {
        msg: 'O nome do produto é obrigatório'
      },
      len: {
        args: [3, 100],
        msg: 'O nome deve ter entre 3 e 100 caracteres'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'A descrição do produto é obrigatória'
      },
      len: {
        args: [10, 1000],
        msg: 'A descrição deve ter entre 10 e 1000 caracteres'
      }
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      isDecimal: {
        msg: 'O preço deve ser um número decimal válido'
      },
      min: {
        args: [0],
        msg: 'O preço não pode ser negativo'
      }
    }
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'A categoria é obrigatória'
      }
    }
  }
}, {
  timestamps: true
});

module.exports = Product;
