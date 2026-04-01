const express = require('express');
const router = express.Router();
const AssetCategory = require('../models/assetcategory');
const { Op } = require('sequelize');
const { assetCategoryRules, positiveIdParamRule } = require('../validators');
const { getValidationErrors } = require('../utils/validation');

function normalizeCategoryPayload(body) {
  return {
    name: (body.name || '').trim(),
    description: (body.description || '').trim(),
  };
}

function renderCategoryForm(res, { action, category, errors = {}, status = 200 }) {
  res.status(status).render('assetcategory_form', {
    action,
    category,
    errors,
    title: `${action} Asset Category`,
  });
}

router.get('/', async (req, res) => {
  try {
    const assetcategories = await AssetCategory.findAll({ order: [['id', 'ASC']] });
    res.render('assetcategory', { assetcategories, title: 'Asset Categories' });
  } catch (error) {
    throw error;
  }
});


router.get('/add', (req, res) => {
  renderCategoryForm(res, { action: 'Add', category: {} });
});

router.post('/add', assetCategoryRules, async (req, res, next) => {
  const categoryData = normalizeCategoryPayload(req.body);
  const errors = getValidationErrors(req);

  if (errors) {
    return renderCategoryForm(res, {
      action: 'Add',
      category: categoryData,
      errors,
      status: 422,
    });
  }

  try {
    const existingCategory = await AssetCategory.findOne({
      where: { name: categoryData.name },
    });

    if (existingCategory) {
      return renderCategoryForm(res, {
        action: 'Add',
        category: categoryData,
        errors: { name: 'This asset category already exists.' },
        status: 422,
      });
    }

    await AssetCategory.create(categoryData);
    req.flash('success', 'Asset category created successfully.');
    res.redirect('/assetcategory');
  } catch (error) {
    next(error);
  }
});

router.get('/edit/:id', async (req, res) => {
  try {
    const category = await AssetCategory.findByPk(req.params.id);
    if (!category) {
      req.flash('error', 'Asset category not found.');
      return res.redirect('/assetcategory');
    }
    renderCategoryForm(res, { action: 'Edit', category });
  } catch (error) {
    throw error;
  }
});

router.post('/edit/:id', positiveIdParamRule, assetCategoryRules, async (req, res, next) => {
  const categoryData = normalizeCategoryPayload(req.body);
  const errors = getValidationErrors(req);

  if (errors) {
    return renderCategoryForm(res, {
      action: 'Edit',
      category: { ...categoryData, id: req.params.id },
      errors,
      status: 422,
    });
  }

  try {
    const category = await AssetCategory.findByPk(req.params.id);

    if (!category) {
      req.flash('error', 'Asset category not found.');
      return res.redirect('/assetcategory');
    }

    const nameOwner = await AssetCategory.findOne({
      where: {
        name: categoryData.name,
        id: { [Op.ne]: req.params.id },
      },
    });

    if (nameOwner) {
      return renderCategoryForm(res, {
        action: 'Edit',
        category: { ...categoryData, id: req.params.id },
        errors: { name: 'Another category already uses this name.' },
        status: 422,
      });
    }

    await AssetCategory.update(categoryData, { where: { id: req.params.id } });
    req.flash('success', 'Asset category updated successfully.');
    res.redirect('/assetcategory');
  } catch (error) {
    next(error);
  }
});

router.post('/delete/:id', positiveIdParamRule, async (req, res, next) => {
  const errors = getValidationErrors(req);

  if (errors) {
    req.flash('error', errors.id);
    return res.redirect('/assetcategory');
  }

  try {
    await AssetCategory.destroy({ where: { id: req.params.id } });
    req.flash('success', 'Asset category deleted successfully.');
    res.redirect('/assetcategory');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
