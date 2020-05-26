const mongoose = require("mongoose")
const requireDir = require("require-dir")

requireDir("./../models")

const User = mongoose.model("User")
const Adress = mongoose.model("Adress")

exports.get = async (req, res) => {
    try{
        const user = await User.findById(req.userId)
        const { name, email } = user
	    res.send({ name, email })
    } catch (e) {
        res.status(500).send("Alguma coisa deu errado")
    }
}