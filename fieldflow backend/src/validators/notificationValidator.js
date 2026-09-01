const { body } = require('express-validator');

const notificationValidator = {
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required'),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message content is required')
  ]
};

module.exports = notificationValidator;
