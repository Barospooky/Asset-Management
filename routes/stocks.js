const express = require('express');
const router = express.Router();
const Asset = require('../models/asset');

router.get('/', async (req, res) => {
  try {
    const assets = await Asset.findAll({
      where: { status: 'Available' }, 
      raw: true
    });

    let totalValue = 0;

    assets.forEach(asset => {
      totalValue += parseFloat(asset.purchase_price || 0);
    });

    res.render('stock', { assets, totalValue });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading stock view');
  }
});

module.exports = router;
