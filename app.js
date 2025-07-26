const express = require('express');
const path = require('path');
const app = express();


app.use(express.urlencoded({ extended: true }));

const session = require('express-session');

app.use(session({
  secret: 'sgkjsdnhfdjvjfvnxdmmvjnlldksjnkz', 
  resave: false,
  saveUninitialized: true
}));

const employeeRoutes = require('./routes/employees');
const assetCategoryRoutes = require('./routes/assetCategories'); 
const assetsRouter = require('./routes/assets');
const issuesRouter = require('./routes/issues');
const stockRouter = require('./routes/stocks');
const returnRouter = require('./routes/returns');
const scrapRouter = require('./routes/scraps');
const historyRouter = require('./routes/history');

app.use('/employee', employeeRoutes);
app.use('/assetcategory', assetCategoryRoutes); 
app.use('/asset', assetsRouter);
app.use('/issue', issuesRouter);
app.use('/stock', stockRouter);
app.use('/return', returnRouter);
app.use('/scrap', scrapRouter);
app.use('/history', historyRouter);

const sequelize = require('./db');

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

app.use('/public', express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => res.redirect('/employee'));

sequelize.authenticate().then(() => {
  console.log('DB connected');
  app.listen(4000, () => console.log('Server running on http://localhost:4000'));
}).catch(err => {
  console.error('DB connection failed:', err);
});
