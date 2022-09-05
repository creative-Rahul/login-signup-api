const express = require("express")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcrypt");

const Student = require("./models/student")
const res = require("express/lib/response")
const upload = require("./middleware/upload")


const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
require("./db/conn")

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
    res.status(201).send("Welcome to Home Page")
})

app.post("/register", async (req, res) => {
    try {
        const newStudent = new Student({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            username: req.body.username,
            link: req.body.link,
            dob: req.body.dob,
            skills:req.body.skills,
            // country:req.body.country,
            // image:req.file.path,
            password: req.body.password,
        })

        const existUsername = await Student.findOne({ username: req.body.username });
        if (existUsername) {
            //   console.log('username taken');
            res.send("username already exist")
        } else {
            const registered = await newStudent.save()
            // console.log(registered);
            res.status(201).send({
                error: false,
                error_code: 201,
                message: "Registration successful",
                results: registered
            })
        }

        // console.log(username);
        // const token = await registered.generateAuthToken();
        // console.log("the token part " + token)
        // res.cookie("jwt", token,{
        //     expires : new Date(Date.now()+ 30000),
        //     httpOnly: true
        // })

        // console.log(registered);

    } catch (error) {
        res.status(400).send(error)
    }
})



app.post("/login", async (req, res) => {
    try {
        const password = req.body.password;
        // console.log(detail);
        const verifyUser = await Student.findOne({ email: req.body.email })
        // console.log(verifyUser);
        // console.log(req.body.email);
        const token = await verifyUser.generateAuthToken();
        // console.log("the token part " + token)

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + (3 * 60000)),
            httpOnly: true,
            // secure:true
        })

        const isPasswordmatched = await bcrypt.compare(password, verifyUser.password)

        if (isPasswordmatched) {
            // console.log("error");
            res.send({
                error: false,
                error_code: 201,
                message: "logged In",
                results: verifyUser,
            })
        }
        else {
            res.send("Wrong Password")
        }
    } catch (error) {
        res.send("Wrong Credenatials")
        console.log(error);
    }
})


app.listen(port, () => {
    console.log("Server is started");
})