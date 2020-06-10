const mongoose = require("mongoose")
const requireDir = require("require-dir")

requireDir("./../models")

const User = mongoose.model("User")
const Adress = mongoose.model("Adress")

const removeNulls = adresses => adresses.filter(item => item != null)

exports.list = async (req, res) => {
    const user = await User.findById(req.userId)
    res.send(user.adresses)
}

exports.get = async (req, res) => {
    const user = await User.findById(req.query.user_id || req.userId)
    const adresses = removeNulls(user.adresses)
    res.send(adresses.find(adress => adress._id == req.params.id))
}

exports.save = async (req, res) => {
    
    let user = await User.findById(req.userId)

    user.adresses = removeNulls(user.adresses)

    const first = user.adresses.length == 0
    
    let adress = user.adresses.find(adress => adress._id == req.params.id)

    if(typeof adress == "undefined") { 
        adress = new Adress()
        user.adresses.push(adress)
    }

    adress.primary = first

    adress.zipcode = req.body.zipcode || adress.zipcode
    adress.state = req.body.state || adress.state
    adress.city = req.body.city || adress.city
    adress.neighborhood = req.body.neighborhood || adress.neighborhood
    adress.street = req.body.street || adress.street
    adress.number = req.body.number || adress.number
    adress.complement = req.body.complement || adress.complement
    adress.lat = req.body.lat || adress.lat
    adress.lng = req.body.lng || adress.lng

    user.adresses = user.adresses.map(item => {
        if(item._id == adress._id) return adress
        return item
    })

    await user.save()

    res.send(adress)

}

exports.delete = async (req, res) => {

    let user = await User.findById(req.userId)

    user.adresses = removeNulls(user.adresses)
    user.adresses = user.adresses.filter(item => item._id != req.params.id)

    await user.save()

    res.send({})

}

exports.setAsPrimary = async (req, res) => {
    
    let user = await User.findById(req.userId)

    user.adresses = removeNulls(user.adresses)
    
    let adress = user.adresses.find(adress => adress._id == req.params.id)

    if(typeof adress == "undefined") return res.send({})

    user.adresses = user.adresses.map(item => {
        item.primary = item._id == req.params.id
        return item
    })

    await user.save()

    res.send(adress)

}