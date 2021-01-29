const requiredFieldValidator = (fieldName = "") => (req, res, next) => {
  const fieldValue = req.body[fieldName];

  if (fieldName && !fieldValue) {
    return res.status(400).json({
      message: `${fieldName} is required.`,
      status: "error",
      data: null,
    });
  }

  next();
};

const jsonFieldValidator = (fieldName = "") => (req, res, next) => {
  const rule = req.body[fieldName];

  try {
    const ruleIsObject = rule.constructor === Object;

    if (!ruleIsObject) {
      const parsedRule = JSON.parse(rule);
      if (parsedRule.constructor !== Object) {
        throw new Error(`${fieldName} should be an object.`);
      }
      req.body[fieldName] = parsedRule;
    }
    next();
  } catch (error) {
    return res.status(400).json({
      message: `${fieldName} should be an object.`,
      status: "error",
      data: null,
    });
  }
};

const joiValidator = (fieldName = "", validationSchema) => (req, res, next) => {
  try {
    const fieldValue = req.body[fieldName];
    const { error, value } = validationSchema.validate(fieldValue);
    if (error && error.details.length) {
      const errorDetails = error.details[0];

      return res.status(400).json({
        message: `${fieldName}.${errorDetails.message
          .replace('"', "")
          .replace('"', "")}.`,
        status: "error",
        data: null,
      });
    }
    return next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  requiredFieldValidator,
  jsonFieldValidator,
  joiValidator,
};
