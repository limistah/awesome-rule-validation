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

module.exports = {
  requiredFieldValidator,
};
