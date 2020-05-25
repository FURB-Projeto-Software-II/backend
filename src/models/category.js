const mongoose = require("mongoose")

const CategorySchema = new mongoose.Schema({
	name: {
		type: String,
		require: true,
	},
    weight: {
        type: String,
    },
    size: {
        type: String,
    },
})

mongoose.model("Category", CategorySchema)
