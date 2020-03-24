const mongoose = require("mongoose")
const requireDir = require("require-dir")

requireDir("./../models")

const Category = mongoose.model("Category")

exports.list = async (req, res) => {
    res.send(await Category.find())
}

exports.get = async (req, res) => {
    res.send(await Category.findById(req.params.id))
}

exports.save = async (req, res) => {
    
    let category = await Category.findById(req.params.id)

    if(category == null) category = new Category()

    category.name = req.body.name || category.name

    await category.save()
    
    res.send(category)

}

exports.delete = async (req, res) => {
    await Category.deleteOne({ _id: req.params.id })
    res.send({})

}
