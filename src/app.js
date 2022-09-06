const express = require("express")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser")
const cors = require("cors")

const Student = require("./models/student")
const res = require("express/lib/response")
const upload = require("./middleware/upload")
require("./db/conn")


const app = express()
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: false }))
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(bodyParser.json())

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
    res.status(201).send("Welcome to Home Page")
})

app.post("/register", async (req, res) => {

    try {
        // console.log(req.body);
        const newStudent = new Student({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            username: req.body.username,
            link: req.body.link,
            dob: req.body.dob,
            skills:req.body.skills,
            education:req.body.education,
            // image:req.file.path,
            password: req.body.password,
        })


        const existUsername = await Student.findOne({ username: req.body.username });
        if (existUsername) {
            //   console.log('username taken');
            res.send({
                error: true,
                error_code: 401,
                message: "username already exist",
                // results: registered
            })
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
        console.log(error);
        res.status(400).send({
            error: true,
            error_code: 403,
            message: "Email is already exist",
            // results: registered
        })
    }
})



app.post("/login",async (req, res) => {
    try {
        const password = req.body.password;
        // console.log(detail);
        const verifyUser = await Student.findOne({ email: req.body.email })
        // console.log(verifyUser);
        // console.log(req.body.email);
        // const token = await verifyUser.generateAuthToken();
        // // console.log("the token part " + token)

        // res.cookie("jwt", token, {
        //     expires: new Date(Date.now() + (3 * 60000)),
        //     httpOnly: true,
        //     // secure:true
        // })

        const isPasswordmatched = await bcrypt.compare(req.body.password, verifyUser.password)

        if (isPasswordmatched) {
            // console.log("error");
            res.status(201).send({
                error: false,
                error_code: 201,
                message: "logged In",
                results: verifyUser,
            })
        }
        else {
            res.status(403).send({
                error: false,
                error_code: 403,
                message: "Wrong Password",
                // results: verifyUser,
            })
        }
    } catch (error) {
        res.status(403).send({
            error: true,
            error_code: 403,
            message: "Wrong Credenatials",
            // results: verifyUser,
        })
        console.log(error);
    }
})


app.listen(port, () => {
    console.log("Server is started at "+port);
})