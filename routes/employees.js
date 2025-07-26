const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');
const { Op } = require('sequelize');

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
  });
});

router.get('/add', (req, res) => {
  res.render('employee_form', { employee: {}, action: 'Add' });
});

router.post('/add', async (req, res) => {
  try {
    await Employee.create({
      name: req.body.name,
      email: req.body.email,
      status: req.body.status || 'active',
      join_date: req.body.join_date || null,
      leave_date: req.body.leave_date || null
    });
    res.redirect('/employee');
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).render('error', { message: err.message });
  }
});

router.get('/edit/:id', async (req, res) => {
  const employee = await Employee.findByPk(req.params.id);
  res.render('employee_form', { employee, action: 'Edit' });
});

router.post('/edit/:id', async (req, res) => {
  await Employee.update({
    name: req.body.name,
    email: req.body.email,
    status: req.body.status,
    join_date: req.body.join_date || null,
    leave_date: req.body.leave_date || null
  }, {
    where: { id: req.params.id }
  });
  res.redirect('/employee');
});

router.get('/delete/:id', async (req, res) => {
    try {
  await Employee.destroy({ where: { id: req.params.id } });
  res.redirect('/employee');
    }
    catch (err) {
    res.status(500).render('error', { message: err });
  }
});

module.exports = router;
