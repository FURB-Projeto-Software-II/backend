const mongoose = require("mongoose")
const requireDir = require("require-dir")

requireDir("./../models")

const Order = mongoose.model("Order")
const User = mongoose.model("User")
const Adress = mongoose.model("Adress")

exports.list = async (req, res) => {
    const order = await Order.find()
    res.send(order)
}

exports.get = async (req, res) => {
    try{
        const order = await Order.findById(req.params.id)
	    res.send(order)
    } catch (e) {
        res.status(500).send("Alguma coisa deu errado")
    }
}

exports.save = async (req, res) => {
    
    let order = await Order.findById(req.params.id)

    if(order == null) order = new Order()

    console.log(req.body)
    order.id_client = req.body.id_client || order.id_client
    order.id_storage = req.body.id_storage || order.id_storage
    order.id_category = req.body.id_category || order.id_category
    order.id_adress_delivery = req.body.id_adress_delivery || order.id_adress_delivery
    order.description = req.body.description || order.description
    order.weight = req.body.weight || order.weight
    order.size = req.body.size || order.size

    await order.save()
    
    res.send(order)
    
}

exports.delete = async (req, res) => {

    await Order.deleteOne({ _id: req.params.id})

    res.send({})

}
