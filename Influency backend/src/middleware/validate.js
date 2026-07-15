const Joi = require("joi");

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    next();
  };
}

const schemas = {
  followRequest: Joi.object({
    from: Joi.string().hex().length(24).required(),
    to: Joi.string().hex().length(24).required(),
  }),
  followRespond: Joi.object({
    status: Joi.string().valid("accepted", "rejected").required(),
  }),
  conversationCreate: Joi.object({
    userA: Joi.string().hex().length(24).required(),
    userB: Joi.string().hex().length(24).required(),
  }),
  sendMessage: Joi.object({
    conversationId: Joi.string().hex().length(24).required(),
    sender: Joi.string().hex().length(24).required(),
    text: Joi.string().trim().min(1).max(2000).required(),
  }),
};

module.exports = { validate, schemas };