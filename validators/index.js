const dotprop = require("dotprop");

/**
 * Checks if a field exists in the body of a request
 *
 * @param {string} fieldName The name of the field to validate in the body of the request
 *
 * @returns {function} An express middleware
 */
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

/**
 * Ensures that an expected JSON field contains a valid JSON object
 *
 * @param {string} fieldName The name of the field to validate in the body of the request
 * @param {boolean} excludeFailingStrings Determines if the validation should pass for invalid JSON string or value
 *
 * @returns {function} An express middleware
 */
const jsonFieldValidator = (fieldName = "", excludeFailingStrings = false) => (
  req,
  res,
  next
) => {
  let fieldValue = req.body[fieldName];

  try {
    // Detects if the constructor is an object
    const fieldValueIsObject = fieldValue.constructor === Object;

    // In anycase the value is an array, we want to skip since JSON can mean array of values.
    // But, if it is not an array and the field is not a valid object, uhmm...
    // We want to test the string to be a valid JSON object
    if (!Array.isArray(fieldValue) && !fieldValueIsObject) {
      const parsedfieldValue = JSON.parse(fieldValue);
      // After attempting to parse the value, in anycase the parsing is done
      // without an error, we should check if the result is an actual Object
      if (parsedfieldValue.constructor !== Object) {
        // If it is not an Object, we don't trust the value, we throw!
        throw new Error(`${fieldName} should be an object.`);
      }
      // oh, okay, the value is parsed, and it is an object
      // Update the actual field on the request body, reason? It might be a string on the body, and parsing it mean we don't have to parse it elsewhere, got it?
      req.body[fieldName] = parsedfieldValue;
    }
    // On to the next one!!!
    next();
  } catch (error) {
    // Yeah, the parsing failed, but we want to allow failing strings and values
    if (excludeFailingStrings) {
      // We move to next one
      return next();
    } else {
      // No, we don't want to allow failing values
      // We just return an error to the client.
      // Easy, enough, yeah!!!
      return res.status(400).json({
        message: `${fieldName} should be an object.`,
        status: "error",
        data: null,
      });
    }
  }
};

/**
 * A simple middleware to validate a field in the body of a request using Joi validation definition.
 * @param {string} fieldName The name of the field that should be validated
 * @param {object} validationSchema A valid Joi validation schema. See
 */
const joiValidator = (fieldName = "", validationSchema) => (req, res, next) => {
  try {
    const fieldValue = req.body[fieldName];
    // Validate the field agains the schema
    const { error, value } = validationSchema.validate(fieldValue);
    // error = {details: [{message: ""}]}
    if (error && error.details.length) {
      // Pick the first error object from the details
      const errorDetails = error.details[0];

      return res.status(400).json({
        // Parse the message to reflect the expected output
        message: `${fieldName}.${errorDetails.message
          .replace('"', "")
          .replace('"', "")}.`,
        status: "error",
        data: null,
      });
    }
    return next();
  } catch (error) {
    // If we reach here, that is an application error, throw to the error middleware
    next(error);
  }
};

/**
 *
 * Validates that the nested field notation does not exceed a threshold
 *
 * @param {object} req Express Request object
 * @param {object} res Express Response object
 * @param {function} next Express Next function
 */
function invalidNestedFieldValidator(req, res, next) {
  let { rule } = req.body;
  // We want to allow "profession.designer" and not "user.profession.designer"
  if (rule.field.split(".").length > 2) {
    return res.status(400).json({
      message: "Invalid JSON payload passed.",
      status: "error",
      data: null,
    });
  }
  next();
}

/**
 *
 * Ensures that a field value exists as a property of the data object in the body
 *
 * @param {object} req Express Request object
 * @param {object} res Express Response object
 * @param {function} next Express Next function
 */
function fieldExistInDataValidator(req, res, next) {
  let { rule, data } = req.body;
  // Dot prop selects values from an object using the dot notation
  // so we could use "a.b" to get `2` from { a: { b: "2" } }
  let field_value = dotprop(data, rule.field);

  if (!field_value) {
    return res.status(400).json({
      message: `field ${rule.field} is missing from data.`,
      status: "error",
      data: null,
    });
  }
  next();
}
module.exports = {
  requiredFieldValidator,
  jsonFieldValidator,
  joiValidator,
  invalidNestedFieldValidator,
  fieldExistInDataValidator,
};
