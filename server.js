const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken')
//const cors = require('cors')
require('dotenv').config()

const app = express()

const AuthController = require("./src/controllers/AuthController")
const UserController = require("./src/controllers/UserController")
const AdressController = require("./src/controllers/AdressController")
const CategoryController = require("./src/controllers/CategoryController")
const OrderController = require("./src/controllers/OrderController")
const StorageController = require("./src/controllers/StorageController")

//app.use(cors)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose.connect(process.env.MONGO_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})

app.get("/", (req, res) => res.send("Ola Mundo"))

// AUTH ROTES
app.post("/auth/login", AuthController.login)
app.post("/auth/client/register", AuthController.registerClient)
app.post("/auth/storage/register", AuthController.registerStorage)

// STORAGES ROTES
app.get("/storages", verifyJWT, StorageController.get)
app.get("/storages/nearby", verifyJWT, StorageController.nearby)

// ADRESS ROTES
app.get("/user/adress", verifyJWT, AdressController.list)
app.get("/user/adress/:id", verifyJWT, AdressController.get)
app.post("/user/adress", verifyJWT, AdressController.save)
app.put("/user/adress/:id", verifyJWT, AdressController.save)
app.put("/user/adress/set-as-primary/:id", verifyJWT, AdressController.setAsPrimary)
app.delete("/user/adress/:id", verifyJWT, AdressController.delete)

// USER ROTES
app.get("/user", verifyJWT, UserController.get)
app.get("/user/:id", verifyJWT, UserController.getById)

// CATEGORY ROTES
app.get("/category", verifyJWT, CategoryController.list)
app.get("/category/:id", verifyJWT, CategoryController.get)
app.post("/category", verifyJWT, CategoryController.save)
app.put("/category/:id", verifyJWT, CategoryController.save)
app.delete("/category/:id", verifyJWT, CategoryController.delete)

// ORDER ROTES
app.get("/order", verifyJWT, OrderController.list)
app.get("/order/:id", verifyJWT, OrderController.get)
app.post("/order/", verifyJWT, OrderController.save)
app.put("/order/:id", verifyJWT, OrderController.save)
app.delete("/order/:id", verifyJWT, OrderController.delete)
app.get("/order/received", verifyJWT, OrderController.getReceived)
app.get("/order/open", verifyJWT, OrderController.getOpen)
app.put("/order/received/:id", verifyJWT, OrderController.received)
app.put("/order/delivered/:id", verifyJWT, OrderController.delivered)

// Global error handler - route handlers/middlewares which throw end up here
app.use((err, req, res, next) => {
    // response to user with 403 error and details
    console.log("err", err)
});

function verifyJWT(req, res, next) { 
    var token = req.headers['authorization']
    if (!token) return res.status(401).send({ auth: false, message: 'Token não informado.' })
    
    jwt.verify(token, process.env.SECRET_JWT_KEY, function(err, decoded) { 
        if (err) return res.status(500).send({ auth: false, message: 'Token inválido.' })
        
        req.userId = decoded.id || decoded.user_id
        next()
    })
}   

app.listen(process.env.PORT || 3001)