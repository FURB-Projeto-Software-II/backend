const mongoose = require("mongoose")
const requireDir = require("require-dir")
const jwt = require('jsonwebtoken')
const passwordHash = require('password-hash')
const env = require("./../env")

requireDir("./../models")

const User = mongoose.model("User")

const findUserByEmail = async (email) => {
    const users = await User.find({
        email, 
    })

    return typeof users[0] == "undefined" ? null : users[0]
}

exports.login = async (req, res) => {
    try{

        const { email, password } = req.body

        const users = await User.find({
            email, 
        })
    
        if(users.length == 0) {
            res.status(401).send("E-mail ou senha incorretos1")
            return
        }

        const user = users[0]
    
        if(!passwordHash.verify(password, user.password)) {
            res.status(401).send("E-mail ou senha incorretos2")
            return 
        }

        const id = user.id
    
        const token = jwt.sign({ id }, env.secret, { 
            expiresIn: 3600 // 1 hour 
        }); 
    
        res.status(200).send({ auth: true, token })
    } catch (e) {
        res.status(500).send("Alguma coisa deu errado")
    }

}

exports.register = async (req, res) => {

    try {
        let { email, password, name, cpf, cnpj } = req.body

        if(await findUserByEmail(email) != null) {
            res.status(502).send("E-mail ja cadastrado")
            return
        } 
    
        password = passwordHash.generate(password)
    
        let user = await User.create({ email, password, name, cpf, cnpj })
    
        const token = jwt.sign({ id: user.id }, env.secret, { 
            expiresIn: 3600 // 1 hour 
        }); 
    
        res.status(201).send({ auth: true, token })
    } catch (e) {
        res.status(500).send(`Aconteceu algum erro`)
    }

}