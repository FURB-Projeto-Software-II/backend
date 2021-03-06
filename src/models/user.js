const mongoose = require("mongoose")

const AdressSchema = new mongoose.Schema({
	zipcode: {
		type: String,
	},
	state: {
		type: String,
	},
	city: {
		type: String,
	},
	neighborhood: {
		type: String,
	},
	street: {
		type: String,
	},
	number: {
		type: String,
	},
	complement: {
		type: String,
	},
	lat: {
		type: String,
	},
	lng: {
		type: String,
	},
	primary: {
		type: Boolean,
		default: false,
	}
})

mongoose.model("Adress", AdressSchema)

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		require: true,
	},
	email: {
		type: String,
		require: true,
	},
	password: {
		type: String,
		require: true,
	},
	cpf: {
		type: String,
		require: true,
	},
	cnpj: {
		type: String,
		require: true,
	},
	type: {
		type: Number,
		require: true,
	},
	distance: {
		type: Number,
		require: true,
	},
	adresses: [
		AdressSchema
		/*{
			zipcode: String,
			state: String,
			city: String,
			neighbor: String,
			street: String,
			number: String,
			complement: String,
		}*/
	],
})

mongoose.model("User", UserSchema)
