const mongoose = require("mongoose")

const CategorySchema = new mongoose.Schema({
	name: {
		type: String,
		require: true,
	},
})

mongoose.model("Category", CategorySchema)
