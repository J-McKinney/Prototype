const router = require("express").Router();
const sentenceController = require("../../controllers/sentenceController");

router.route("/sentence/:sentence").post(sentenceController.create);

// Matches with "/api/sentences"
router.route("/")
  .get(sentenceController.findAll)
  .post(sentenceController.create);

// Matches with "/api/sentences/:id"
router
  .route("/:id")
  .get(sentenceController.findById)
  .put(sentenceController.update)
  .delete(sentenceController.remove);

module.exports = router;
