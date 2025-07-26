const express = require('express');
const router = express.Router();
const AssetIssue = require('../models/issue');
const Employee = require('../models/employee');
const Asset = require('../models/asset');
const AssetCategory = require('../models/assetcategory');
const AssetHistory = require('../models/history');

router.get('/', async (req, res) => {
  const employees = await Employee.findAll();
  const availableAssets = await Asset.findAll({ where: { status: 'Available' } });
  const categories = await AssetCategory.findAll();

 const message = req.session.message;
 delete req.session.message; 

 res.render('issue', {
      employees,
      availableAssets,
      categories,
      issueDate: new Date().toISOString().split('T')[0],
      message 
    });
});

router.post('/new', async (req, res) => {
  const { employee_id, asset_id, asset_category_id, issue_date, remarks } = req.body;

  try {
    await AssetIssue.create({
      employee_id,
      asset_id,
      asset_category_id,
      issue_date,
      remarks
    });
    
    await Asset.update({ status: 'Issued' }, { where: { id: asset_id } });

    const employee = await Employee.findByPk(employee_id);
    const asset = await Asset.findByPk(asset_id);

    const employeeName = employee ? employee.name : 'Unknown';
    const assetName = asset ? `${asset.serial_number} - ${asset.make} ${asset.model}` : 'Unknown';


    await AssetHistory.create({
      asset_name: assetName,
      employee_name: employeeName,
      action_type: 'Issued',
      action_date: issue_date,
      remarks: remarks
    });


    req.session.message = { type: 'success', text: 'Asset issued successfully.' };
    res.redirect('/issue');

  } catch (error) {
   console.error('Asset issue error:', error); // full error message
  req.session.message = { type: 'error', text: 'Failed to issue asset.' };
  res.status(500).send(error);
  }
});

module.exports = router;
