function errorHandler(err, req, res, next) {
    console.error("[ERRO]", err.message);
    return res.status(err.status || 500).json({ erro: err.message });
  }
  
  module.exports = errorHandler;