const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken')
const env = require("./src/env")

const app = express()

const AuthController = require("./src/controllers/AuthController")
const UserController = require("./src/controllers/UserController")
const AdressController = require("./src/controllers/AdressController")
const CategoryController = require("./src/controllers/CategoryController")
const OrderController = require("./src/controllers/OrderController")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose.connect("mongodb+srv://root:root@cluster0-qmd8d.mongodb.net/test?retryWrites=true&w=majority", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})

app.get("/", (req, res) => res.send("Ola Mundo"))

app.post("/auth/login", AuthController.login)
app.post("/auth/register", AuthController.register)

app.get("/user", verifyJWT, UserController.get)

app.get("/user/adress", verifyJWT, AdressController.list)
app.get("/user/adress/:id", verifyJWT, AdressController.get)
app.post("/user/adress", verifyJWT, AdressController.save)
app.put("/user/adress/:id", verifyJWT, AdressController.save)
app.delete("/user/adress/:id", verifyJWT, AdressController.delete)

app.get("/category", verifyJWT, CategoryController.list)
app.get("/category/:id", verifyJWT, CategoryController.get)
app.post("/category", verifyJWT, CategoryController.save)
app.put("/category/:id", verifyJWT, CategoryController.save)
app.delete("/category/:id", verifyJWT, CategoryController.delete)

app.get("/order", verifyJWT, OrderController.list)
app.get("/order/:id", verifyJWT, OrderController.get)
app.post("/order/", verifyJWT, OrderController.save)
app.put("/order/:id", verifyJWT, OrderController.save)
app.delete("/order/:id", verifyJWT, OrderController.delete)

// Global error handler - route handlers/middlewares which throw end up here
app.use((err, req, res, next) => {
    // response to user with 403 error and details
    console.log("err", err)
});

function verifyJWT(req, res, next) { 
    var token = req.headers['authorization']
    if (!token) 
        return res.status(401).send({ auth: false, message: 'Token não informado.' })
    
    jwt.verify(token, env.secret, function(err, decoded) { 
        if (err) 
            return res.status(500).send({ auth: false, message: 'Token inválido.' })
        
        req.userId = decoded.id
        next()
    })
}   

app.listen(3001)