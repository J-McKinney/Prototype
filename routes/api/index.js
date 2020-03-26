const router = require("express").Router();
const sentenceRoutes = require("./sentences");

// Sentence routes
router.use("/sentences", sentenceRoutes);

module.exports = router;
