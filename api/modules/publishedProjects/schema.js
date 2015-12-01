var Joi = require('joi');

module.exports = Joi.object().keys({
  now: Joi.date().required()
});
