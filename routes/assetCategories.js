const express = require('express');
const router = express.Router();
const AssetCategory = require('../models/assetcategory');

router.get('/', async (req, res) => {
  try {
    const assetcategories = await AssetCategory.findAll({ order: [['id', 'ASC']] });
    res.render('assetcategory', { assetcategories });
  } catch (error) {
    console.error('Error fetching asset categories:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/add', (req, res) => {
  res.render('assetcategory_form', { category: {}, action: 'Add' });
});

router.post('/add', async (req, res) => {
  try {
    await AssetCategory.create(req.body);
    res.redirect('/assetcategory');
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).send('Failed to add asset category');
  }
});

router.get('/edit/:id', async (req, res) => {
  try {
    const category = await AssetCategory.findByPk(req.params.id);
    if (!category) {
      return res.redirect('/assetcategory');
    }
    res.render('assetcategory_form', { category, action: 'Edit' });
  } catch (error) {
    console.error('Error loading edit form:', error);
    res.status(500).send('Failed to load edit form');
  }
});

router.post('/edit/:id', async (req, res) => {
  try {
    await AssetCategory.update(req.body, { where: { id: req.params.id } });
    res.redirect('/assetcategory');
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).send('Failed to update asset category');
  }
});

router.get('/delete/:id', async (req, res) => {
  try {
    await AssetCategory.destroy({ where: { id: req.params.id } });
    res.redirect('/assetcategory');
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).send('Failed to delete asset category');
  }
});

module.exports = router;
