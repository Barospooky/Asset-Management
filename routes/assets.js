const express = require('express');
const router = express.Router();
const Asset = require('../models/asset');
const { Op } = require('sequelize');
const sequelize = require('../db'); 

router.get('/', async (req, res) => {
  const { assetcategory = '' } = req.query;

  const where = {};
  if (assetcategory) where.asset_type = assetcategory;

  try {
    const assets = await Asset.findAll({
      where,
      order: [['id', 'ASC']],
      raw: true
    });

    const categories = await Asset.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('asset_type')), 'name']],
      raw: true
    });

    res.render('asset', {
      assets,
      categories,
      assetCategory: assetcategory, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/add', (req, res) => {
  res.render('asset_form', { asset: {}, action: 'Add' });
});

router.post('/add', async (req, res) => {
  try {
    await Asset.create(req.body);
    res.redirect('/asset');
  } catch (error) {
    console.error('Error adding asset:', error);
    res.status(500).send('Failed to add asset ');
  }
});

router.get('/edit/:id', async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) {
      return res.redirect('/asset');
    }
    res.render('asset_form', { asset, action: 'Edit' });
  } catch (error) {
    console.error('Error loading edit form:', error);
    res.status(500).send('Failed to load edit form');
  }
});

router.post('/edit/:id', async (req, res) => {
  try {
    await Asset.update(req.body, { where: { id: req.params.id } });
    res.redirect('/asset');
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).send('Failed to update asset');
  }
});

router.get('/delete/:id', async (req, res) => {
  try {
    await Asset.destroy({ where: { id: req.params.id } });
    res.redirect('/asset');
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).send('Failed to delete asset');
  }
});


module.exports = router;
