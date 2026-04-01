const { validationResult } = require('express-validator');

function getValidationErrors(req) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return null;
  }

  return result.array().reduce((errors, issue) => {
    if (!errors[issue.path]) {
      errors[issue.path] = issue.msg;
    }

    return errors;
  }, {});
}

module.exports = {
  getValidationErrors,
};
