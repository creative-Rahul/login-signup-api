const express = require("express")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")

const Student = require("./models/student")
const res = require("express/lib/response")
const upload =require("./middleware/upload")


const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
require("./db/conn")

const port = process.env.PORT || 3000;

app.get("/", (req,res)=>{
    res.status(201).send("Welcome to Home Page")
})

app.post("/register",upload.single('image'), async(req,res)=>{
    try {

       const newStudent = new Student({
            name: req.body.name,
            email: req.body.email,
            age:req.body.age,
            city:req.body.city,
            state:req.body.state,
            country:req.body.country,
            image:req.file.path,
            password: req.body.password,
        })
        const registered = await newStudent.save()

        const token = await registered.generateAuthToken();
        // console.log("the token part " + token)

        res.cookie("jwt", token,{
            expires : new Date(Date.now()+ 30000),
            httpOnly: true
        })

        console.log(registered);
        res.status(201).send(registered)
    } catch (error) {
        res.status(400).send(error)
    }
})



app.post("/login", async (req,res)=>{
    try {
        // const detail = req.body;
        const verifyUser = await Student.find({email: req.body.email})
        console.log(verifyUser);
        // console.log(req.body.email);
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

// app.post("/single", upload.single("singleImage"), (req, res) => {
//     console.log(req.file);
//     res.status(201).send("Upload Successful")
// })

app.listen(port,()=>{
    console.log("Server is started");
})