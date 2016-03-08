'use strict';

var Joi = require(`joi`);

module.exports = Joi.object().keys({
  name: Joi.string()
});
