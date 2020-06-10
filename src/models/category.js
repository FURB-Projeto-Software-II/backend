const mongoose = require("mongoose")

const CategorySchema = new mongoose.Schema({
	name: {
		type: String,
		require: true,
	},
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
})

mongoose.model("Category", CategorySchema)
