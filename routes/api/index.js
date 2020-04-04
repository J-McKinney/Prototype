const router = require("express").Router();
const sentence = require("./sentence");

// Sentence routes
router.use("/sentence", sentence);

module.exports = router;
