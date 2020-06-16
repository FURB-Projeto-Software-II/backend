const mongoose = require("mongoose")
const requireDir = require("require-dir")

requireDir("./../models")

const Order = mongoose.model("Order")
const User = mongoose.model("User")
const Adress = mongoose.model("Adress")
const Category = mongoose.model("Category")

const buildOrderData = async (order) => {
    let storage = await User.findById(order.id_storage).select("name adresses")
    let client = await User.findById(order.id_client).select("name adresses")
    const category = await Category.findById(order.id_category).select("name")
    const adress = client.adresses.find(adress => adress.id = order.id_adress_delivery)
    client.adresses = undefined
    return { order, client, storage, category, adress }
}

exports.list = async (req, res) => {
    const user = await User.findById(req.userId)

    const filter = (user.type == 1) ? { id_storage: req.userId } : { id_client: req.userId }

    const orders = await Order.find(filter)
    
    res.send(orders)
}

exports.getOpen = async (req, res) => {
    const order = await Order.find({
        id_client: req.userId,
        received: false
    })
    res.send(order)
}

exports.getReceived = async (req, res) => {
    const order = await Order.find({
        id_client: req.userId,
        received: true
    })
    res.send(order)
}

exports.get = async (req, res) => {
    try{
        const order = await Order.findById(req.params.id)
	    res.send(await buildOrderData(order))
    } catch (e) {
        res.status(500).send("Alguma coisa deu errado")
    }
}

exports.save = async (req, res) => {
    
    let order = await Order.findById(req.params.id)

    const category = await Category.findById(req.body.id_category)
    if (category == null) return res.status(402).send("Categoria não encontrada!")

    if (order == null) order = new Order()

    order.id_client = req.userId
    order.id_storage = req.body.id_storage || order.id_storage
    order.id_category = req.body.id_category || order.id_category
    order.id_adress_delivery = req.body.id_adress_delivery || order.id_adress_delivery
    order.description = req.body.description || order.description
    order.weight = req.body.weight || order.weight
    order.size = req.body.size || order.size
    order.price = category.price

    await order.save()
    
    res.send(order)
    
}

exports.delete = async (req, res) => {

    await Order.deleteOne({ _id: req.params.id})

    res.send({})

}

exports.received = async (req, res) => {

    const order = await Order.findById(req.params.id)

    if (order == null) return res.status(402).send("Ordem nao encontrada")
    if (order.id_client != req.userId) return res.status(401).send("Usuário inválido")
    if (order.status == 1) return res.status(402).send("Ordem ja recebida")

    order.status = 1
    order.recive_date = Date.now()

    order.save()

    res.status(200).send("Ordem recebida!")

}

exports.delivered = async (req, res) => {

    const order = await Order.findById(req.params.id)

    if (order == null) return res.status(402).send("Ordem nao encontrada")
    if (order.id_client != req.userId) return res.status(401).send("Usuário inválido")
    if (order.status == 2) return res.status(402).send("Entrega ja realizada")

    order.status = 2
    order.delivery_date = Date.now()

    order.save()

    res.status(200).send("Entrega realizada com sucesso!")

}