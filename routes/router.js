const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const pageController = require("../controllers/pageController");
const productController = require("../controllers/productController");
const categoryController = require("../controllers/categoryController");
const feedbackController = require("../controllers/feedbackController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/", pageController.renderIndex);
router.get("/login", pageController.renderLogin);
router.get("/register", pageController.renderRegister);
router.get("/dashboard", pageController.renderDashboard);
router.get("/produtos/criar", pageController.renderCriarProduto);
router.get("/categorias/criar", pageController.renderCriarCategoria);
router.get("/feedbacks/criar", pageController.renderCriarFeedback);

router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);

const apiRouter = express.Router();
apiRouter.use(authenticateToken);

apiRouter.get("/products", productController.getProducts);
apiRouter.post("/products", productController.createProduct);
apiRouter.put("/products/:id", productController.updateProduct);
apiRouter.delete("/products/:id", productController.deleteProduct);

apiRouter.get("/categories", categoryController.getCategories);
apiRouter.post("/categories", categoryController.createCategory);
apiRouter.put("/categories/:id", categoryController.updateCategory);
apiRouter.delete("/categories/:id", categoryController.deleteCategory);

apiRouter.get("/feedbacks", feedbackController.getFeedbacks);
apiRouter.post("/feedbacks", feedbackController.createFeedback);
apiRouter.delete("/feedbacks/:id", feedbackController.deleteFeedback);

router.use("/api", apiRouter);

module.exports = router; 