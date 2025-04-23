const pageController = {
    renderIndex: (req, res) => {
        res.render('pages/index');
    },

    renderLogin: (req, res) => {
        res.render('pages/login');
    },

    renderRegister: (req, res) => {
        res.render('pages/register');
    },

    renderDashboard: (req, res) => {
        res.render('pages/dashboard');
    },

    renderCriarProduto: (req, res) => {
        res.render('pages/produtos/criar');
    },

    renderCriarCategoria: (req, res) => {
        res.render('pages/categorias/criar');
    },

    renderCriarFeedback: (req, res) => {
        res.render('pages/feedbacks/criar');
    }
};

module.exports = pageController; 