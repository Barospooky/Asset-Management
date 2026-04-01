const express = require('express');
const router = express.Router();
const AssetIssue = require('../models/issue');
const Employee = require('../models/employee');
const Asset = require('../models/asset');
const AssetCategory = require('../models/assetcategory');
const AssetHistory = require('../models/history');
const { issueRules } = require('../validators');
const { getValidationErrors } = require('../utils/validation');

async function loadIssueFormData() {
  const [employees, availableAssets, categories] = await Promise.all([
    Employee.findAll({ order: [['name', 'ASC']] }),
    Asset.findAll({ where: { status: 'Available' }, order: [['serial_number', 'ASC']] }),
    AssetCategory.findAll({ order: [['name', 'ASC']] }),
  ]);

  return {
    availableAssets,
    categories,
    employees,
  };
}

function renderIssueForm(res, data) {
  res.render('issue', {
    ...data,
    errors: data.errors || {},
    formData: data.formData || {},
    issueDate: data.issueDate || new Date().toISOString().split('T')[0],
    title: 'Issue Asset',
  });
}

router.get('/', async (req, res) => {
  const formOptions = await loadIssueFormData();
  renderIssueForm(res, formOptions);
});

router.post('/new', issueRules, async (req, res, next) => {
  const { employee_id, asset_id, asset_category_id, issue_date, remarks } = req.body;
  const errors = getValidationErrors(req);

  if (errors) {
    return renderIssueForm(res.status(422), {
      ...(await loadIssueFormData()),
      errors,
      formData: req.body,
      issueDate: req.body.issue_date,
    });
  }

  try {
    const [employee, asset, category] = await Promise.all([
      Employee.findByPk(employee_id),
      Asset.findByPk(asset_id),
      AssetCategory.findByPk(asset_category_id),
    ]);

    if (!employee || !asset || !category) {
      return renderIssueForm(res.status(422), {
        ...(await loadIssueFormData()),
        errors: { form: 'Select valid employee, asset category, and asset values.' },
        formData: req.body,
        issueDate: req.body.issue_date,
      });
    }

    if (asset.status !== 'Available') {
      return renderIssueForm(res.status(422), {
        ...(await loadIssueFormData()),
        errors: { asset_id: 'Only available assets can be issued.' },
        formData: req.body,
        issueDate: req.body.issue_date,
      });
    }

    await AssetIssue.create({
      employee_id,
      asset_id,
      asset_category_id,
      issue_date,
      remarks
    });
    
    await Asset.update({ status: 'Issued' }, { where: { id: asset_id } });

    const employeeName = employee ? employee.name : 'Unknown';
    const assetName = asset ? `${asset.serial_number} - ${asset.make} ${asset.model}` : 'Unknown';


    await AssetHistory.create({
      asset_name: assetName,
      employee_name: employeeName,
      action_type: 'Issued',
      action_date: issue_date,
      remarks: remarks
    });


    req.flash('success', 'Asset issued successfully.');
    res.redirect('/issue');

  } catch (error) {
    next(error);
  }
});

module.exports = router;
