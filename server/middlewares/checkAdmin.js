const { User } = require('../models');

const checkAdmin = async (req, res, next) => {
  const adminUserId = req.headers['admin-user-id'];
  if (!adminUserId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await User.findByPk(adminUserId);
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = checkAdmin;
