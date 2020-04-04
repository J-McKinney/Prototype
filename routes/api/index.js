const router = require("express").Router();
const sentenceRoutes = require("./sentence");

// Sentence routes
router.use("/sentence", sentenceRoutes);

module.exports = router;
