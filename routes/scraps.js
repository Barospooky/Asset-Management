const express = require('express');
const router = express.Router();
const Asset = require('../models/asset');
const  AssetScrap  = require('../models/scrap');
const AssetHistory = require('../models/history');

router.get('/', async (req, res) => {
try{
  const assets = await Asset.findAll({ where: { status: 'Available' } });
  const message = req.session.message;
  delete req.session.message; 


  res.render('scrap', { assets,message });}


  catch (err) {
    console.error('Error loading scrap form:', err);
    res.status(500).send('Server Error');
  }
});


router.post('/new', async (req, res) => {
  try {
    const { asset_id, scrap_reason, notes } = req.body;

    await AssetScrap.create({ asset_id, scrap_reason, notes });

    await Asset.update(
      {  status: 'Retired' },
      { where: { id: asset_id } }
    );

    
    const assetM = await Asset.findByPk(asset_id);
    const assetName = assetM ? `${assetM.serial_number} - ${assetM.make} ${assetM.model}` : 'Unknown';

    await AssetHistory.create({
      asset_name: assetName,
      action_type: 'scraped',
      action_date: new Date(),
      remarks: scrap_reason
    });

    req.session.message = { type: 'success', text: 'Asset scraped successfully.' };
    
    res.redirect('/scrap');
  } catch (err) {
    console.error('Error scrapping asset:', err);
    res.status(500).send(err);
  }
});

module.exports = router;
