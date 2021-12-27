require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { signup, signin } = require("./auth")
const app = express()
const port = 4000

app.use(cors())
app.use(express.json())

app.post("/signup", signup)
app.post("/signin", signin)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
