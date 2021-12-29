const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path")

const app = express();
const router = express.Router()

// main middlewares
app.use(cors())
app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded());
app.use(router)

const { compileJavaCode, compileJavaCodeWithInput } = require("./compile")

// routing

router.get("/", (req, res) => {
    return res.json({ msg: "dfgbgfhbgf" })
})

router.post("/compileJava", async (req, res) => {
    let { code, ext } = req.body;
    // compile normal java codes
    await compileJavaCode(code, ext, (data) => {
        res.json(data)
    })
})

router.post("/compileJavaInput", async (req, res) => {
    let { code, ext, input } = req.body;
    // compile normal java codes
    await compileJavaCodeWithInput(code, ext, input, (data) => {
        res.json(data)
    })

    // compile java codes with input
})


// listen on a htp port to run and start the server
const PORT = process.env.PORT || 5000
app.listen(PORT);