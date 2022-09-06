const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const validator = require("validator")

const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 3,
        validate(value) {
            if (value.length < 3) {
                throw new Error("Invalid Name")
            }
        }
    },
    lastName: {
        type: String,
        required: true,
        min: 3,
        validate(value) {
            if (value.length < 3) {
                throw new Error("Invalid Name")
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email")
            }
        }
    },
    username: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (value.length < 5 || value.length > 15) {
                throw new Error("username should more than 5 and less than 15 characters")
            }
        }
    },
    link:{
        type : String,
        required :true
    },
    dob:{
        type : String,
        required :true,
        validate(value){
            validator.isDate(value,new Date(this.getDay+this.getMonth+this.getFullYear))
        }
    },
    skills:[{
        type : String,
        required :true
    }],
    education:[{
        type : String,
        required :true
    }],
    image:{
        type:String,
        // required:true
    },
    password: {
        type: String,
        required: true,
        
    },
})


// Token Generation
studentSchema.methods.generateAuthToken = async function () {
    try {
        // console.log(this._id)
        const token = jwt.sign({ _id: this._id }, "thisisthesecretkeyformytoken")
        // this.tokens = this.tokens.concat({ token: token });
        // await this.save()
        return token
    } catch (error) {
        res.send("the error part" + error);
        // console.log("the error part " + error);
    }
}


studentSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 4)
        // console.log(`Hashed password ${this.password}`);
    }
    next()
})





const Student = mongoose.model("Student", studentSchema);
module.exports = Student;