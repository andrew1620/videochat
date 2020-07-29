const express = require("express");
const router = express.Router();

const controller = require('../internal/controllers/auth');

router.get("/auth", (req, res) => {
  res.json({ server: "works" });
});
router.post('/auth', controller.login);

module.exports = router;
