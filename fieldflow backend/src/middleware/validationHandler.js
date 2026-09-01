const { validationResult } = require('express-validator');

const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Format error message to be clean and simple
    const firstError = errors.array()[0];
    const message = `${firstError.path || firstError.param}: ${firstError.msg}`;
    return res.status(400).json({ message });
  }
  next();
};

module.exports = validationHandler;
