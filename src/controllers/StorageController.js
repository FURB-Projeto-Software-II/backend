const mongoose = require("mongoose")
const requireDir = require("require-dir")

requireDir("./../models")

const User = mongoose.model("User")
const Adress = mongoose.model("Adress")

const distance = (lat1, lng1, lat2, lng2) => {
    const p = 0.017453292519943295
    const c = Math.cos
    const a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lng2 - lng1) * p))/2
  
    return 12742 * Math.asin(Math.sqrt(a)) // 2 * R; R = 6371 km
  }

const getDistanceToStorage = (adress, storage) => {
    if (storage.adresses[0].lat == null || storage.adresses[0].lng == null) return 99999999
    return distance(adress.lat, adress.lng, storage.adresses[0].lat, storage.adresses[0].lng)
}

exports.get = async (req, res) => {
    const storages = await User.find({ type: 1 })
    res.send(storages)
}

exports.nearby = async (req, res) => {
    let storages = await User.find({ type: 1 })

    const user = await User.findById(req.userId)
    if (user.adresses == null) res.send(storages)
    
    const user_adress = user.adresses[0]
    if (user_adress.lat == null || user_adress.lng == null) res.send(storages)

    storages.map(storage => storage.distance = getDistanceToStorage(user.adresses[0], storage))
    storages.sort((a, b) => (a.distance > b.distance) ? 1 : -1)

    res.send(storages.slice(0, 10))
}