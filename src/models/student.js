const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    // age:{
    //     type : Number,
    //     required :true
    // },
    // city:{
    //     type : String,
    //     required :true
    // },
    // state:{
    //     type : String,
    //     required :true
    // },
    // country:{
    //     type : String,
    //     required :true
    // },
    // image:{
    //     type:String,
    //     required:true
    // },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
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


studentSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,4)
        console.log(`Hashed password ${this.password}`);
    }
    next()
})



const Student = mongoose.model("Student", studentSchema);
module.exports = Student;