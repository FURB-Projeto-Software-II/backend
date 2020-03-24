const mongoose = require("mongoose")
const requireDir = require("require-dir")

requireDir("./../models")

const User = mongoose.model("User")
const Adress = mongoose.model("Adress")

exports.list = async (req, res) => {
    const user = await User.findById(req.userId)
    res.send(user.adresses)
}

exports.get = async (req, res) => {
    const user = await User.findById(req.userId)
    res.send(user.adresses.find(adress => adress._id = req.params.id))
}

exports.save = async (req, res) => {
    
    let user = await User.findById(req.userId)

    user.adresses = user.adresses.filter(item => item != null)
    
    let adress = user.adresses.find(adress => adress._id = req.params.id)

    if(typeof adress == "undefined") { 
        adress = new Adress()
        user.adresses.push(adress)
    }

    adress.zipcode = req.body.zipcode || adress.zipcode
    adress.state = req.body.state || adress.state
    adress.city = req.body.city || adress.city
    adress.neighborhood = req.body.neighborhood || adress.neighborhood
    adress.street = req.body.street || adress.street
    adress.number = req.body.number || adress.number
    adress.complement = req.body.complement || adress.complement

    user.adresses = user.adresses.map(item => {
        if(item._id == adress._id) return adress
        return item
    })

    await user.save()

    res.send(adress)

}

exports.delete = async (req, res) => {

    let user = await User.findById(req.userId)

    user.adresses = user.adresses.filter(item => item != null)
    user.adresses = user.adresses.filter(item => item._id != req.params.id)

    await user.save()

    res.send({})

}
