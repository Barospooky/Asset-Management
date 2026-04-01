const { body, param } = require('express-validator');

const EMPLOYEE_STATUSES = ['active', 'inactive'];
const ASSET_STATUSES = ['Available', 'Issued', 'Scraped'];
const FALLBACK_ASSET_TYPES = ['Laptop', 'Mobile Phone', 'Drill Machine', 'Screw Driver'];

const positiveIdParamRule = [
  param('id')
    .trim()
    .isInt({ gt: 0 })
    .withMessage('A valid record id is required.')
    .toInt(),
];

const loginRules = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Enter a valid email address.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters.'),
];

const employeeRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('Name must be between 2 and 80 characters.'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Enter a valid employee email address.')
    .normalizeEmail(),
  body('status')
    .trim()
    .isIn(EMPLOYEE_STATUSES)
    .withMessage('Select a valid employee status.'),
  body('join_date')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('Join date must be a valid date.'),
  body('leave_date')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('Leave date must be a valid date.'),
  body('leave_date').custom((leaveDate, { req }) => {
    if (!leaveDate || !req.body.join_date) {
      return true;
    }

    if (new Date(leaveDate) < new Date(req.body.join_date)) {
      throw new Error('Leave date cannot be earlier than join date.');
    }

    return true;
  }),
];

const assetRules = [
  body('serial_number')
    .trim()
    .isLength({ min: 3, max: 80 })
    .withMessage('Serial number must be between 3 and 80 characters.'),
  body('make')
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('Make must be between 2 and 80 characters.'),
  body('model')
    .trim()
    .isLength({ min: 1, max: 80 })
    .withMessage('Model must be between 1 and 80 characters.'),
  body('asset_type')
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('Select a valid asset category.'),
  body('purchase_date')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('Purchase date must be a valid date.'),
  body('purchase_price')
    .optional({ values: 'falsy' })
    .isFloat({ min: 0 })
    .withMessage('Purchase cost must be zero or greater.')
    .toFloat(),
  body('status')
    .trim()
    .isIn(ASSET_STATUSES)
    .withMessage('Select a valid asset status.'),
];

const assetCategoryRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('Category name must be between 2 and 80 characters.'),
  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 300 })
    .withMessage('Description must be 300 characters or less.'),
];

const issueRules = [
  body('employee_id')
    .trim()
    .isInt({ gt: 0 })
    .withMessage('Select an employee.')
    .toInt(),
  body('asset_category_id')
    .trim()
    .isInt({ gt: 0 })
    .withMessage('Select an asset category.')
    .toInt(),
  body('asset_id')
    .trim()
    .isInt({ gt: 0 })
    .withMessage('Select an available asset.')
    .toInt(),
  body('issue_date')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('Issue date must be a valid date.'),
  body('remarks')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Remarks must be 500 characters or less.'),
];

const returnRules = [
  body('employee_id')
    .trim()
    .isInt({ gt: 0 })
    .withMessage('Select an employee.')
    .toInt(),
  body('asset_category_id')
    .trim()
    .isInt({ gt: 0 })
    .withMessage('Select an asset category.')
    .toInt(),
  body('asset_id')
    .trim()
    .isInt({ gt: 0 })
    .withMessage('Select an issued asset.')
    .toInt(),
  body('return_date')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('Return date must be a valid date.'),
  body('remarks')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Remarks must be 500 characters or less.'),
];

const scrapRules = [
  body('asset_id')
    .trim()
    .isInt({ gt: 0 })
    .withMessage('Select an available asset.')
    .toInt(),
  body('scrap_reason')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Scrap reason must be between 5 and 200 characters.'),
  body('notes')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must be 500 characters or less.'),
];

module.exports = {
  ASSET_STATUSES,
  EMPLOYEE_STATUSES,
  FALLBACK_ASSET_TYPES,
  assetCategoryRules,
  assetRules,
  employeeRules,
  issueRules,
  loginRules,
  positiveIdParamRule,
  returnRules,
  scrapRules,
};
