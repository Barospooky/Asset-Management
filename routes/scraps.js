const express = require('express');
const router = express.Router();
const Asset = require('../models/asset');
const  AssetScrap  = require('../models/scrap');
const AssetHistory = require('../models/history');
const { scrapRules } = require('../validators');
const { getValidationErrors } = require('../utils/validation');

async function loadScrapFormData() {
  return {
    assets: await Asset.findAll({
      where: { status: 'Available' },
      order: [['serial_number', 'ASC']],
    }),
  };
}

function renderScrapForm(res, data) {
  res.render('scrap', {
    ...data,
    errors: data.errors || {},
    formData: data.formData || {},
    title: 'Scrap Asset',
  });
}

router.get('/', async (req, res) => {
  try {
    renderScrapForm(res, await loadScrapFormData());
  } catch (err) {
    throw err;
  }
});


router.post('/new', scrapRules, async (req, res, next) => {
  try {
    const { asset_id, scrap_reason, notes } = req.body;
    const errors = getValidationErrors(req);

    if (errors) {
      return renderScrapForm(res.status(422), {
        ...(await loadScrapFormData()),
        errors,
        formData: req.body,
      });
    }

    const assetM = await Asset.findByPk(asset_id);

    if (!assetM) {
      return renderScrapForm(res.status(422), {
        ...(await loadScrapFormData()),
        errors: { asset_id: 'Select a valid asset to scrap.' },
        formData: req.body,
      });
    }

    if (assetM.status !== 'Available') {
      return renderScrapForm(res.status(422), {
        ...(await loadScrapFormData()),
        errors: { asset_id: 'Only available assets can be scrapped.' },
        formData: req.body,
      });
    }

    await AssetScrap.create({ asset_id, scrap_reason, notes });

    await Asset.update(
      {  status: 'Scraped' },
      { where: { id: asset_id } }
    );

    
    const assetName = assetM ? `${assetM.serial_number} - ${assetM.make} ${assetM.model}` : 'Unknown';

    await AssetHistory.create({
      asset_name: assetName,
      action_type: 'Scraped',
      action_date: new Date(),
      remarks: scrap_reason
    });

    req.flash('success', 'Asset scrapped successfully.');
    
    res.redirect('/scrap');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
