var express = require("express");
var router = express.Router();
const Joi = require("joi");
const dotprop = require("dotprop");
const {
  requiredFieldValidator,
  jsonFieldValidator,
  joiValidator,
} = require("../validators");
const { log } = require("debug");

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
    const { data, rule } = req.body;
    const { condition, condition_value, field } = rule;

    let status_code = 200;
    let status = "success";
    let error = false;
    let field_value = dotprop(data, field);
    const valueAtIndex = field_value || data[field];
    let message = `field ${field} successfully validated.`;

    let validation_failed = false;

    if (condition === "eq") {
      if (valueAtIndex !== condition_value) {
        validation_failed = true;
        message = `field ${field} failed validation.`;
      }
    }

    if (condition === "neq") {
      if (valueAtIndex === condition_value) {
        validation_failed = true;
        message = `field ${field} failed validation.`;
      }
    }

    if (condition === "contains") {
      const valueAtIndex = data[field];
      if (valueAtIndex !== field_value) {
        validation_failed = true;
        message = `field ${field} is missing from data.`;
      }
    }

    if (condition === "gt") {
      if (parseInt(valueAtIndex) <= parseInt(condition_value)) {
        validation_failed = true;
        message = `field ${field} failed validation.`;
      }
    }

    if (condition === "gte") {
      if (parseInt(valueAtIndex) < parseInt(condition_value)) {
        validation_failed = true;
        message = `field ${field} failed validation.`;
      }
    }

    if (validation_failed) {
      status_code = 400;
      status = "error";
      error = true;
    }

    return res.status(status_code).json({
      message,
      status,
      data: {
        validation: {
          error,
          field,
          field_value,
          condition,
          condition_value,
        },
      },
    });
  }
);

module.exports = router;
