const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const { requireLogin } = require('./middleware/auth');
const { applySecurityHeaders, assignRequestLocals } = require('./middleware/security');

require('dotenv').config();

const app = express();
const sequelize = require('./db');

if (!process.env.SESSION_SECRET) {
  console.warn('SESSION_SECRET is not set. Falling back to an insecure development secret.');
}

app.locals.currentPath = '';
app.locals.currentUser = null;
app.locals.pageMessages = {
  error: [],
  success: [],
};

const authRouter = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const assetCategoryRoutes = require('./routes/assetCategories');
const assetsRouter = require('./routes/assets');
const issuesRouter = require('./routes/issues');
const stockRouter = require('./routes/stocks');
const returnRouter = require('./routes/returns');
const scrapRouter = require('./routes/scraps');
const historyRouter = require('./routes/history');

app.disable('x-powered-by');
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : 0);
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));
app.use(applySecurityHeaders);
app.use(session({
  secret: process.env.SESSION_SECRET || 'development-session-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 8 * 60 * 60 * 1000,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
}));
app.use(flash());
app.use(assignRequestLocals);
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);

app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/employee');
  }

  res.redirect('/auth/login');
});

app.use(requireLogin);
app.use('/employee', employeeRoutes);
app.use('/assetcategory', assetCategoryRoutes);
app.use('/asset', assetsRouter);
app.use('/issue', issuesRouter);
app.use('/stock', stockRouter);
app.use('/return', returnRouter);
app.use('/scrap', scrapRouter);
app.use('/history', historyRouter);

app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page not found',
    message: 'The page you requested does not exist.',
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', {
    title: 'Application error',
    message: 'An unexpected error occurred while processing your request.',
  });
});

sequelize.authenticate().then(() => {
  console.log('DB connected');
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}).catch((err) => {
  console.error('DB connection failed:', err);
});
