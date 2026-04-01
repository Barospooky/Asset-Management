const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');
const { Op } = require('sequelize');
const { EMPLOYEE_STATUSES, employeeRules, positiveIdParamRule } = require('../validators');
const { getValidationErrors } = require('../utils/validation');

function normalizeEmployeePayload(body) {
  return {
    name: (body.name || '').trim(),
    email: (body.email || '').trim().toLowerCase(),
    status: body.status || 'active',
    join_date: body.join_date || null,
    leave_date: body.leave_date || null,
  };
}

function renderEmployeeForm(res, { action, employee, errors = {}, status = 200 }) {
  res.status(status).render('employee_form', {
    action,
    employee,
    errors,
    statusOptions: EMPLOYEE_STATUSES,
    title: `${action} Employee`,
  });
}

router.get('/', async (req, res) => {
  const { status = 'all', search = '' } = req.query;

  const where = {};
  if (status !== 'all') where.status = status;
  if (search) where.name = { [Op.iLike]: `%${search}%` };

  const employees = await Employee.findAll({
    where,
    order: [['name', 'ASC']],
    raw: true,
  });

  res.render('employee', {
    employees,
    selectedStatus: status,
    searchText: search,
    title: 'Employees',
  });
});

router.get('/add', (req, res) => {
  renderEmployeeForm(res, { action: 'Add', employee: {} });
});

router.post('/add', employeeRules, async (req, res, next) => {
  const employeeData = normalizeEmployeePayload(req.body);
  const errors = getValidationErrors(req);

  if (errors) {
    return renderEmployeeForm(res, {
      action: 'Add',
      employee: employeeData,
      errors,
      status: 422,
    });
  }

  try {
    const existingEmployee = await Employee.findOne({
      where: { email: employeeData.email },
    });

    if (existingEmployee) {
      return renderEmployeeForm(res, {
        action: 'Add',
        employee: employeeData,
        errors: { email: 'An employee with this email already exists.' },
        status: 422,
      });
    }

    await Employee.create(employeeData);
    req.flash('success', 'Employee created successfully.');
    res.redirect('/employee');
  } catch (err) {
    next(err);
  }
});

router.get('/edit/:id', async (req, res) => {
  const employee = await Employee.findByPk(req.params.id);
  if (!employee) {
    req.flash('error', 'Employee not found.');
    return res.redirect('/employee');
  }

  renderEmployeeForm(res, { action: 'Edit', employee });
});

router.post('/edit/:id', positiveIdParamRule, employeeRules, async (req, res, next) => {
  const employeeData = normalizeEmployeePayload(req.body);
  const errors = getValidationErrors(req);

  if (errors) {
    return renderEmployeeForm(res, {
      action: 'Edit',
      employee: { ...employeeData, id: req.params.id },
      errors,
      status: 422,
    });
  }

  try {
    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      req.flash('error', 'Employee not found.');
      return res.redirect('/employee');
    }

    const emailOwner = await Employee.findOne({
      where: {
        email: employeeData.email,
        id: { [Op.ne]: req.params.id },
      },
    });

    if (emailOwner) {
      return renderEmployeeForm(res, {
        action: 'Edit',
        employee: { ...employeeData, id: req.params.id },
        errors: { email: 'Another employee is already using this email address.' },
        status: 422,
      });
    }

    await Employee.update(employeeData, {
      where: { id: req.params.id },
    });

    req.flash('success', 'Employee updated successfully.');
    res.redirect('/employee');
  } catch (err) {
    next(err);
  }
});

router.post('/delete/:id', positiveIdParamRule, async (req, res, next) => {
  const errors = getValidationErrors(req);

  if (errors) {
    req.flash('error', errors.id);
    return res.redirect('/employee');
  }

  try {
    await Employee.destroy({ where: { id: req.params.id } });
    req.flash('success', 'Employee deleted successfully.');
    res.redirect('/employee');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
