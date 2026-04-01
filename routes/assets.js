const express = require('express');
const router = express.Router();
const Asset = require('../models/asset');
const AssetCategory = require('../models/assetcategory');
const { Op } = require('sequelize');
const {
  ASSET_STATUSES,
  FALLBACK_ASSET_TYPES,
  assetRules,
  positiveIdParamRule,
} = require('../validators');
const { getValidationErrors } = require('../utils/validation');

async function getAssetCategoryOptions() {
  const categories = await AssetCategory.findAll({
    attributes: ['name'],
    order: [['name', 'ASC']],
    raw: true,
  });

  const categoryNames = categories
    .map(({ name }) => name)
    .filter(Boolean);

  return categoryNames.length ? categoryNames : FALLBACK_ASSET_TYPES;
}

function normalizeAssetPayload(body) {
  return {
    serial_number: (body.serial_number || '').trim(),
    make: (body.make || '').trim(),
    model: (body.model || '').trim(),
    asset_type: (body.asset_type || '').trim(),
    purchase_date: body.purchase_date || null,
    purchase_price: body.purchase_price || null,
    status: body.status || 'Available',
  };
}

async function renderAssetForm(res, { action, asset, errors = {}, status = 200 }) {
  res.status(status).render('asset_form', {
    action,
    asset,
    categoryOptions: await getAssetCategoryOptions(),
    errors,
    statusOptions: ASSET_STATUSES,
    title: `${action} Asset`,
  });
}

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

    const categoryNames = await getAssetCategoryOptions();
    const categories = categoryNames.map((name) => ({ name }));

    res.render('asset', {
      assets,
      categories,
      assetCategory: assetcategory, 
      title: 'Assets',
    });
  } catch (error) {
    throw error;
  }
});

router.get('/add', async (req, res, next) => {
  try {
    await renderAssetForm(res, { action: 'Add', asset: {} });
  } catch (error) {
    next(error);
  }
});

router.post('/add', assetRules, async (req, res, next) => {
  const assetData = normalizeAssetPayload(req.body);
  const errors = getValidationErrors(req);

  if (errors) {
    return renderAssetForm(res, {
      action: 'Add',
      asset: assetData,
      errors,
      status: 422,
    });
  }

  try {
    const existingAsset = await Asset.findOne({
      where: { serial_number: assetData.serial_number },
    });

    if (existingAsset) {
      return renderAssetForm(res, {
        action: 'Add',
        asset: assetData,
        errors: { serial_number: 'This serial number is already registered.' },
        status: 422,
      });
    }

    await Asset.create(assetData);
    req.flash('success', 'Asset created successfully.');
    res.redirect('/asset');
  } catch (error) {
    next(error);
  }
});

router.get('/edit/:id', async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) {
      req.flash('error', 'Asset not found.');
      return res.redirect('/asset');
    }
    await renderAssetForm(res, { action: 'Edit', asset });
  } catch (error) {
    throw error;
  }
});

router.post('/edit/:id', positiveIdParamRule, assetRules, async (req, res, next) => {
  const assetData = normalizeAssetPayload(req.body);
  const errors = getValidationErrors(req);

  if (errors) {
    return renderAssetForm(res, {
      action: 'Edit',
      asset: { ...assetData, id: req.params.id },
      errors,
      status: 422,
    });
  }

  try {
    const asset = await Asset.findByPk(req.params.id);

    if (!asset) {
      req.flash('error', 'Asset not found.');
      return res.redirect('/asset');
    }

    const serialOwner = await Asset.findOne({
      where: {
        serial_number: assetData.serial_number,
        id: { [Op.ne]: req.params.id },
      },
    });

    if (serialOwner) {
      return renderAssetForm(res, {
        action: 'Edit',
        asset: { ...assetData, id: req.params.id },
        errors: { serial_number: 'Another asset already uses this serial number.' },
        status: 422,
      });
    }

    await Asset.update(assetData, { where: { id: req.params.id } });
    req.flash('success', 'Asset updated successfully.');
    res.redirect('/asset');
  } catch (error) {
    next(error);
  }
});

router.post('/delete/:id', positiveIdParamRule, async (req, res, next) => {
  const errors = getValidationErrors(req);

  if (errors) {
    req.flash('error', errors.id);
    return res.redirect('/asset');
  }

  try {
    await Asset.destroy({ where: { id: req.params.id } });
    req.flash('success', 'Asset deleted successfully.');
    res.redirect('/asset');
  } catch (error) {
    next(error);
  }
});


module.exports = router;
