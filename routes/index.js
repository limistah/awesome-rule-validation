var express = require("express");
var router = express.Router();
const Joi = require("joi");
const { getController, postController } = require("../controllers/index");
const {
  requiredFieldValidator,
  jsonFieldValidator,
  joiValidator,
  invalidNestedFieldValidator,
  fieldExistInDataValidator,
} = require("../validators");

/* GET / */
router.get("/", getController);

/* GET /validate-rule */
router.post(
  "/validate-rule",
  [
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
    invalidNestedFieldValidator,
    fieldExistInDataValidator,
  ],
  postController
);

module.exports = router;
