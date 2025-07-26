const express = require('express');
const router = express.Router();
const AssetHistory = require('../models/history');

router.get('/', async (req, res) => {
  try {
    const assetHistories = await AssetHistory.findAll({
      order: [['action_date', 'DESC']]
    });

    res.render('history', { assetHistories });
    console.log(assetHistories);

  } catch (error) {
    console.error('Error loading asset history:', error);
    res.status(500).send(error);
  }
});

module.exports = router; 
