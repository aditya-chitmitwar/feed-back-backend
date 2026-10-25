const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateRequest, issueToken } = require('../middleware/auth');
const { createFeedbackRecord } = require('../services/airtable.service');

const router = express.Router();

const normalizeFeedbackBody = (req, res, next) => {
  const bodyData = req.body || {};

  req.body = {
    name: bodyData.name ?? bodyData.Name ?? '',
    email: bodyData.email ?? bodyData.Email ?? '',
    feedback: bodyData.feedback ?? bodyData.Feedback ?? '',
  };

  next();
};

router.post(
  '/auth/login',
  [body('apiKey').exists().withMessage('API key is required.')],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    return issueToken(req, res, next);
  }
);

router.post(
  '/feedback',
  //authenticateRequest,
  normalizeFeedbackBody,
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required.')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters.'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required.')
      .isEmail()
      .withMessage('Please provide a valid email address.'),
    body('feedback')
      .trim()
      .notEmpty()
      .withMessage('Feedback is required.')
      .isLength({ min: 10, max: 2000 })
      .withMessage('Feedback must be between 10 and 2000 characters.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, email, feedback } = req.body;

    try {
      const record = await createFeedbackRecord({
        name,
        email,
        feedback,
      });

      return res.status(201).json({
        success: true,
        message: 'Feedback submitted successfully.',
        data: {
          id: record.id,
          name,
          email,
          feedback,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to save feedback to Airtable.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

module.exports = router;
