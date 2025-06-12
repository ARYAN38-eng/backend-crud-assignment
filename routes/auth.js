const express = require('express');
const router = express.Router();
const { generateToken } = require('../middlewares/auth');

// Dummy user
const fakeUser = { id: 1, username: 'admin', role: 'admin' };

router.post('/login', (req, res) => {
  const { username } = req.body;
  if (username === fakeUser.username) {
    const token = generateToken(fakeUser);
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid user' });
  }
});

module.exports = router;
