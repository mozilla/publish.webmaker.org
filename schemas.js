/*
 * Validation schemas for incoming requests
*/

var Joi = require('joi');

exports.file = Joi.object().keys({
  path: Joi.string().required(),
  size: Joi.number().integer().positive(),
  data: Joi.binary().required()
});

exports.project = Joi.object().keys({
  // This might change based on future restrictions we add to project names
  name: Joi.string().required(),
  username: Joi.string().required(),
  isPublic: Joi.boolean().required(),
  files: Joi.array().items(exports.file)
});

exports.qsIncludeFiles = Joi.object().keys({
  includeFiles: [Joi.string().valid('true', 'false'), Joi.boolean()]
}).optional();
