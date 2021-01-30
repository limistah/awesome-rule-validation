var express = require("express");
var router = express.Router();
const Joi = require("joi");
const dotprop = require("dotprop");
const { getController, postController } = require("../controllers/index");
const {
  requiredFieldValidator,
  jsonFieldValidator,
  joiValidator,
} = require("../validators");
const { log } = require("debug");

/* GET home page. */
router.get("/", getController);

/* GET home page. */
router.post(
  "/validate-rule",
  requiredFieldValidator("rule"),
  requiredFieldValidator("data"),
  jsonFieldValidator("rule"),
  jsonFieldValidator("data", true),
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
  function invalidNestedFieldValidator(req, res, next) {
    let { rule } = req.body;
    if (rule.field.split(".").length > 2) {
      return res.status(400).json({
        message: "Invalid JSON payload passed.",
        status: "error",
        data: null,
      });
    }
    next();
  },
  function fieldExistInDataValidator(req, res, next) {
    let { rule, data } = req.body;
    let field_value = dotprop(data, rule.field);

    if (!field_value) {
      return res.status(400).json({
        message: `field ${rule.field} is missing from data.`,
        status: "error",
        data: null,
      });
    }
    next();
  },
  postController
);

module.exports = router;
