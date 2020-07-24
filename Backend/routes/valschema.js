const Joi = require('joi') 
const valschema = { 
  Employee: Joi.object().keys({ 
    empId: Joi.number().required(),
    name:Joi.string().pattern(new RegExp('^([^0-9]*)$')).required(),
	work: Joi.string().required(),
	deskpos: Joi.number().integer().min(0).required(),
  }) 
  // define all the other schemas below 
}; 
module.exports = valschema;

/*

*/