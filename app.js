const express = require('express');
const cors = require('cors');
const path = require('path');
const { syncDatabase } = require('./models');
const router = require('./routes/router');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

syncDatabase().then(() => {
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
});


