const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
    id_client: {
        required: true,
        type: String,
    },
    id_storage: {
        required: true,
        type: String,
    },
    id_category: {
        required: true,
        type: String,
    },
    id_adress_delivery:{
        type: String,
    },
    description: {
        type: String,
    },
    weight: {
        type: String,
    },
    size: {
        type: String,
    },
})

mongoose.model("Order", OrderSchema)
