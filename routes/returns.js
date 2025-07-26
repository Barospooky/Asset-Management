const express = require('express');
const router = express.Router();
const AssetReturn = require('../models/return');
const Employee = require('../models/employee');
const Asset = require('../models/asset');
const AssetCategory = require('../models/assetcategory');
const AssetHistory = require('../models/history');

router.get('/', async (req, res) => {
  const employees = await Employee.findAll();
  const availableAssets = await Asset.findAll({ where: { status: 'Issued' } });
  const categories = await AssetCategory.findAll();

 const message = req.session.message;
 delete req.session.message; 

 res.render('return', {
      employees,
      availableAssets,
      categories,
      returnDate: new Date().toISOString().split('T')[0],
      message 
    });
});

router.post('/new', async (req, res) => {
  const { employee_id, asset_id, asset_category_id, return_date, remarks } = req.body;

  try {
    await AssetReturn.create({
      employee_id,
      asset_id,
      asset_category_id,
      return_date,
      remarks
    });

    await Asset.update({ status: 'Available' }, { where: { id: asset_id } });

    const employee = await Employee.findByPk(employee_id);
    const asset = await Asset.findByPk(asset_id);

    const employeeName = employee ? employee.name : 'Unknown';
    const assetName = asset ? `${asset.serial_number} - ${asset.make} ${asset.model}` : 'Unknown';

    await AssetHistory.create({ 
      asset_name: assetName,
      employee_name: employeeName,
      action_type: 'Returned',
      action_date: return_date,
      remarks: remarks
    });

    req.session.message = { type: 'success', text: 'Asset returned successfully.' };
    res.redirect('/return');

  } catch (error) {
    console.error(error);
    req.session.message = { type: 'error', text: 'Failed to return asset.' };
    res.status(500).send(error);
  }
});

module.exports = router;
