var mongoose = require('mongoose');
var imageSchema = new mongoose.Schema(
{
	name:{
		type:String,
		required:true
	},
	desc:{
		type:String,
	},
	img:
	{
		data: Buffer,
		contentType: String
	}
});
module.exports = mongoose.model('Image', imageSchema);
