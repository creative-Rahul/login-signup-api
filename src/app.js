const express = require("express")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")

const Student = require("./models/student")
const res = require("express/lib/response")

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
require("./db/conn")

const port = process.env.PORT || 3000;

app.get("/", (req,res)=>{
    res.status(201).send("Welcome to Home Page")
})

app.post("/register", async(req,res)=>{
    try {
        const newStudent = new Student(req.body)
        const registered = await newStudent.save()

        const token = await registered.generateAuthToken();
        // console.log("the token part " + token)

        res.cookie("jwt", token,{
            expires : new Date(Date.now()+ 30000),
            httpOnly: true
        })

        // console.log(registered);
        res.status(201).send(registered)
    } catch (error) {
        res.status(400).send(error)
    }
})



app.post("/login", async (req,res)=>{
    try {
        // const detail = req.body;
        const verifyUser = await Student.findOne({email: req.body.email})

        const token = await verifyUser.generateAuthToken();
        // console.log("the token part " + token)
        
        res.cookie("jwt", token,{
            expires : new Date(Date.now()+ (3*60000)),
            httpOnly: true,
            // secure:true
        })

        if(verifyUser.password === req.body.password){
            res.status(200).send("Logged in sucessfully")
        }
        else{
            res.send("Wrong Password")
        }
    } catch (error) {
        res.send(error)
    }
})

app.listen(port,()=>{
    console.log("Server is started");
})