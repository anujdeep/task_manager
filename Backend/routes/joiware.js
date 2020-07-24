const Joi = require('joi'); 
const joiware = (schema, property) => { 
  return (req, res, next) => { 
	  const { error } =  schema.validate(req.body)
	  const valid = error == null; 

	  if (valid) { 
		next(); 
	  } else { 
		
		const { details } = error;
		var msg="";
		if(details!=undefined || details!=null)
		msg = details.map(i => i.message).join(',');

		console.log("error", msg); 
		
	   res.status(202).json(msg) 
	   } 
  } 
} 
module.exports = joiware;