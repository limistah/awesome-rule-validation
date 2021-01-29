var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).json({
    message: "My Rule-Validation API",
    status: "success",
    data: {
      name: "Aleem Isiaka",
      github: "@limistah",
      email: "aleemisiaka@gmail.com",
      mobile: "08120254644",
      twitter: "@limistah",
    },
  });
});

/* GET home page. */
router.post(
  "/validate-rule",
  function validateRuleField(req, res, next) {
    const { rule } = req.body;
    if (!rule) {
      return res.status(400).json({
        message: "rule is required.",
        status: "error",
        data: null,
      });
    }

    next();
  },
  function validateDataField(req, res, next) {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({
        message: "data is required.",
        status: "error",
        data: null,
      });
    }

    next();
  },
  function (req, res, next) {
    res.status(200).json({});
  }
);

module.exports = router;
