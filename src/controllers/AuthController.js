const mongoose = require("mongoose")
const requireDir = require("require-dir")
const jwt = require('jsonwebtoken')
const passwordHash = require('password-hash')

requireDir("./../models")

const User = mongoose.model("User")

const expiresTime = 3600 // 1 hour 

const findUserByEmail = async (email) => {
    const users = await User.find({
        email, 
    })

    return typeof users[0] == "undefined" ? null : users[0]
}

const generateToken = user_id => jwt.sign({ user_id }, process.env.SECRET_JWT_KEY, { expiresIn: expiresTime })

const register = async (req, res, type) => {

    try {
        let { email, password, name, cpf, cnpj } = req.body

        if(await findUserByEmail(email) != null) {
            res.status(502).send("E-mail ja cadastrado")
            return
        } 
    
        password = passwordHash.generate(password)

        let user = await User.create({ email, password, name, cpf, cnpj, type })
    
        const token = generateToken(user.id)

        res.status(201).send({ auth: true, token })
    } catch (e) {
        res.status(500).send(`Aconteceu algum erro`)
    }
}

exports.registerClient = async (req, res) => register(req, res, 0)

exports.registerStorage = async (req, res) => register(req, res, 1)

exports.login = async (req, res) => {
    try{

        const { email, password } = req.body

        const users = await User.find({
            email, 
        })
    
        if(users.length == 0) {
            res.status(401).send("E-mail ou senha incorretos")
            return
        }

        const user = users[0]
    
        if(!passwordHash.verify(password, user.password)) {
            res.status(401).send("E-mail ou senha incorretos")
            return 
        }
    
        const token = generateToken(user.id)
    
        res.status(200).send({ auth: true, token })
    } catch (e) {
        res.status(500).send("Alguma coisa deu errado")
    }

}