const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data, isComment) {
  let errors = {};
  data.text = !isEmpty(data.text) ? data.text : "";
  data.subject = !isEmpty(data.subject) ? data.subject : "";
  data.tags = !isEmpty(data.tags) ? data.tags : "";

  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "Post must be between 10 and 300 characters";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }
  if (isComment !== true) {
    if (Validator.isEmpty(data.subject)) {
      errors.subject = "Subject field is required";
    }
    if (data.tags.length === 0) {
      errors.tags = "Tags field is required";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
