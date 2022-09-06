const express = require("express")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser")
const cors = require("cors")
const res = require("express/lib/response")
const hbs = require("hbs")
const path = require("path")

const app = express()

const Student = require("./models/student")
const upload = require("./middleware/upload")
require("./db/conn")

const port = process.env.PORT || 8000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");


app.use(express.static(static_path))
app.set("view engine", "hbs");
app.set("views", template_path)
hbs.registerPartials(partial_path);



app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: false }))
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
// app.use(bodyParser.json())


app.get("/", (req, res) => {
    res.status(201).send("Welcome to Home Page")
})

app.get("/register", (req,res)=>{
    res.status(201).render("register")
})

app.post("/register",async (req, res) => {

    try {
        console.log(req.body);
        const newStudent = new Student({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            username: req.body.username,
            link: req.body.link,
            dob: req.body.dob,
            skills:req.body.skills,
            education:req.body.education,
            image:req.file.path,
            password: req.body.password,
        })


        const existUsername = await Student.findOne({ username: req.body.username });
        if (existUsername) {
            //   console.log('username taken');
            res.status(401).send({
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

    } catch (err) {
        console.log(err);
        res.status(400).send({
            error: true,
            error_code: 403,
            message: "Email is already exist",
            results: err
        })
    }
})


app.get("/login", (req,res)=>{
    res.status(201).render("login")
})

app.post("/login",async (req, res) => {
    try {
        // console.log(req.body.email);
        const password = req.body.password;
        // console.log(password);
        const verifyUser = await Student.findOne({ email: req.body.email })
        
        
        
        const token = await verifyUser.generateAuthToken();
        // console.log("the token part " + token)

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + (3 * 60000)),
            httpOnly: true,
            // secure:true
        })

        const isPasswordmatched = await bcrypt.compare(req.body.password, verifyUser.password)

        if (isPasswordmatched) {
            // console.log("error");
            res.status(201).send({
                error: false,
                error_code: 201,
                message: "logged In",
                results: verifyUser,
            })
            // res.status(201).send("logged in")
        }
        else {
            res.status(403).send({
                error: false,
                error_code: 403,
                message: "Wrong Password",
                // results: verifyUser,
            })
        }
    } catch (err) {
        res.status(403).send({
            error: true,
            error_code: 403,
            message: "Wrong Credenatials",
            results: err,
        })
        console.log(err);
    }
})


app.listen(port, () => {
    console.log("Server is started at "+port);
})