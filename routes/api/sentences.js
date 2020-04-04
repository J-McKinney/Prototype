const router = require("express").Router();
const sentencesController = require("../../controllers/sentencesController");

router.route("/sentence/:sentence").post(sentenceController.create);

// Matches with "/api/sentences"
router.route("/")
  .get(sentencesController.findAll)
  .post(sentencesController.create);

// Matches with "/api/sentences/:id"
router
  .route("/:id")
  .get(sentencesController.findById)
  .put(sentencesController.update)
  .delete(sentencesController.remove);

module.exports = router;
