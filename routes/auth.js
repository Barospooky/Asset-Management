const crypto = require('crypto');
const express = require('express');
const { requireGuest } = require('../middleware/auth');
const { loginRules } = require('../validators');
const { getValidationErrors } = require('../utils/validation');

const LOCK_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const router = express.Router();

function safeCompare(left, right) {
  const leftBuffer = Buffer.from(String(left || ''));
  const rightBuffer = Buffer.from(String(right || ''));

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function getConfiguredCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || 'user@example.com',
    password: process.env.ADMIN_PASSWORD || 'password123',
  };
}

function getRemainingLockTime(req) {
  if (!req.session.lockUntil) {
    return 0;
  }

  return Math.max(0, req.session.lockUntil - Date.now());
}

router.get('/login', requireGuest, (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.render('login', {
    errors: {},
    formData: { email: '' },
    title: 'Sign in',
  });
});

router.post('/login', requireGuest, loginRules, (req, res) => {
  const errors = getValidationErrors(req) || {};
  const formData = {
    email: req.body.email || '',
  };

  const remainingLockTime = getRemainingLockTime(req);
  if (remainingLockTime > 0) {
    errors.form = `Too many failed attempts. Try again in ${Math.ceil(remainingLockTime / 60000)} minute(s).`;
  }

  if (Object.keys(errors).length) {
    return res.status(422).render('login', {
      errors,
      formData,
      title: 'Sign in',
    });
  }

  const credentials = getConfiguredCredentials();
  const isEmailMatch = safeCompare(req.body.email, credentials.email);
  const isPasswordMatch = safeCompare(req.body.password, credentials.password);

  if (isEmailMatch && isPasswordMatch) {
    req.session.failedLoginAttempts = 0;
    req.session.lockUntil = null;
    req.session.user = {
      email: credentials.email,
      role: 'admin',
    };
    req.flash('success', 'Welcome back.');
    return res.redirect('/employee');
  }

  const attempts = (req.session.failedLoginAttempts || 0) + 1;
  req.session.failedLoginAttempts = attempts;

  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    req.session.lockUntil = Date.now() + LOCK_WINDOW_MS;
    req.session.failedLoginAttempts = 0;
  }

  return res.status(401).render('login', {
    errors: {
      form: 'Invalid email or password.',
    },
    formData,
    title: 'Sign in',
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;
