const express = require('express');
const router = express.Router();
const AssetReturn = require('../models/return');
const Employee = require('../models/employee');
const Asset = require('../models/asset');
const AssetCategory = require('../models/assetcategory');
const AssetHistory = require('../models/history');
const { returnRules } = require('../validators');
const { getValidationErrors } = require('../utils/validation');

async function loadReturnFormData() {
  const [employees, availableAssets, categories] = await Promise.all([
    Employee.findAll({ order: [['name', 'ASC']] }),
    Asset.findAll({ where: { status: 'Issued' }, order: [['serial_number', 'ASC']] }),
    AssetCategory.findAll({ order: [['name', 'ASC']] }),
  ]);

  return {
    availableAssets,
    categories,
    employees,
  };
}

function renderReturnForm(res, data) {
  res.render('return', {
    ...data,
    errors: data.errors || {},
    formData: data.formData || {},
    returnDate: data.returnDate || new Date().toISOString().split('T')[0],
    title: 'Return Asset',
  });
}

router.get('/', async (req, res) => {
  const formOptions = await loadReturnFormData();
  renderReturnForm(res, formOptions);
});

router.post('/new', returnRules, async (req, res, next) => {
  const { employee_id, asset_id, asset_category_id, return_date, remarks } = req.body;
  const errors = getValidationErrors(req);

  if (errors) {
    return renderReturnForm(res.status(422), {
      ...(await loadReturnFormData()),
      errors,
      formData: req.body,
      returnDate: req.body.return_date,
    });
  }

  try {
    const [employee, asset, category] = await Promise.all([
      Employee.findByPk(employee_id),
      Asset.findByPk(asset_id),
      AssetCategory.findByPk(asset_category_id),
    ]);

    if (!employee || !asset || !category) {
      return renderReturnForm(res.status(422), {
        ...(await loadReturnFormData()),
        errors: { form: 'Select valid employee, asset category, and asset values.' },
        formData: req.body,
        returnDate: req.body.return_date,
      });
    }

    if (asset.status !== 'Issued') {
      return renderReturnForm(res.status(422), {
        ...(await loadReturnFormData()),
        errors: { asset_id: 'Only issued assets can be returned.' },
        formData: req.body,
        returnDate: req.body.return_date,
      });
    }

    await AssetReturn.create({
      employee_id,
      asset_id,
      asset_category_id,
      return_date,
      remarks
    });

    await Asset.update({ status: 'Available' }, { where: { id: asset_id } });

    const employeeName = employee ? employee.name : 'Unknown';
    const assetName = asset ? `${asset.serial_number} - ${asset.make} ${asset.model}` : 'Unknown';

    await AssetHistory.create({ 
      asset_name: assetName,
      employee_name: employeeName,
      action_type: 'Returned',
      action_date: return_date,
      remarks: remarks
    });

    req.flash('success', 'Asset returned successfully.');
    res.redirect('/return');

  } catch (error) {
    next(error);
  }
});

module.exports = router;
