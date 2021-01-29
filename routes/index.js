var express = require("express");
var router = express.Router();
const { requiredFieldValidator, jsonFieldValidator } = require("../validators");

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
  requiredFieldValidator("rule"),
  requiredFieldValidator("data"),
  jsonFieldValidator("rule"),
  function (req, res, next) {
    res.status(200).json({});
  }
);

module.exports = router;
