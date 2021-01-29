var express = require("express");
var router = express.Router();
const Joi = require("joi");
const {
  requiredFieldValidator,
  jsonFieldValidator,
  joiValidator,
} = require("../validators");

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
  jsonFieldValidator("data"),
  joiValidator(
    "rule",
    Joi.object().keys({
      field: Joi.string().required(),
      condition: Joi.string()
        .required()
        .valid("eq", "neq", "gt", "gte", "contains"),
      condition_value: Joi.string().required(),
    })
  ),
  joiValidator(
    "data",
    Joi.alternatives().try(Joi.object(), Joi.string(), Joi.array())
  ),

  function fieldExistInDataValidator(req, res, next) {
    let { rule, data } = req.body;

    if (!data[rule.field]) {
      return res.status(400).json({
        message: `field ${rule.field} is missing from data.`,
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
