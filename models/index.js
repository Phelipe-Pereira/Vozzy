const sequelize = require('../config/db');

const User = require('./user');
const Category = require('./category');
const Product = require('./product');
const Feedback = require('./feedback');

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados com sucesso!');
  } catch (error) {
    console.error('Erro ao sincronizar o banco de dados:', error);
    process.exit(1);
  }
};

const setupAssociations = () => {
  Product.belongsTo(Category, { 
    foreignKey: 'categoryId', 
    as: 'category'
  });
  Category.hasMany(Product, { 
    foreignKey: 'categoryId',
    as: 'products'
  });

  Feedback.belongsTo(User, { 
    foreignKey: 'userId',
    as: 'User',
    onDelete: 'CASCADE'
  });
  User.hasMany(Feedback, { 
    foreignKey: 'userId',
    as: 'feedbacks'
  });

  Feedback.belongsTo(Product, { 
    foreignKey: 'productId',
    as: 'Product',
    onDelete: 'CASCADE'
  });
  Product.hasMany(Feedback, { 
    foreignKey: 'productId',
    as: 'feedbacks'
  });
};

setupAssociations();

module.exports = {
  sequelize,
  User,
  Product,
  Category,
  Feedback,
  syncDatabase
}; 