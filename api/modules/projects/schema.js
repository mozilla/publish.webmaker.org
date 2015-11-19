var Joi = require('joi');

module.exports = Joi.object().keys({
  title: Joi.string().required(),
  user_id: Joi.number().integer().required(),
  date_created: Joi.date().required(),
  date_updated: Joi.date().required(),
  description: Joi.string().allow('').allow(null),
  tags: Joi.string().allow(null),
  published_id: Joi.number().allow(null),
  readonly: Joi.boolean().allow(null),
  client: Joi.string().allow(null)
});
