const dotprop = require("dotprop");

const getController = (req, res, next) => {
  return res.status(200).json({
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
};

const postController = (req, res, next) => {
  try {
    const { data, rule } = req.body;
    let { condition, condition_value, field } = rule;

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
  } catch (error) {
    next(error);
  }
};

module.exports = { getController, postController };
