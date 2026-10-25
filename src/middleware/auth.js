const jwt = require('jsonwebtoken');
const { API_KEY, JWT_SECRET } = require('../config/env');

const authenticateRequest = (req, res, next) => {
  const apiKeyHeader = req.headers['x-api-key'];
  const authHeader = req.headers.authorization;

  if (apiKeyHeader) {
    if (apiKeyHeader !== API_KEY) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key.',
      });
    }

    return next();
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Send a valid Bearer token or X-API-Key header.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const issueToken = (req, res) => {
  const { apiKey } = req.body || {};

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({
      success: false,
      message: 'Invalid API key.',
    });
  }

  const token = jwt.sign(
    {
      sub: 'feedback-service',
      scope: 'feedback:write',
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return res.status(200).json({
    success: true,
    token,
    expiresIn: '1h',
  });
};

module.exports = {
  authenticateRequest,
  issueToken,
};
