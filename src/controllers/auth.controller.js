const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const createToken =(employeeId)  =>
 jwt.sign({id: employeeId}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    })

const register = async (req, res, next) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            })
        }

        if(password.length < 8){
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long."
            })
        }

        const normalizedEmail = email.trim().toLowerCase()
        const existingEmployee = await Employee.findOne({
            email: normalizedEmail
        }) 

        if(existingEmployee){
         return res.status(409).json({
            success: false,
            message: "An employee with this email already exists."
         })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const employee = await Employee.create({
            name,
            email: normalizedEmail,
            password: hashedPassword
        })

        return res.status(201).json({
            success: true,
            message: "Employee registered successfully.",
            employee:{
                id: employee._id,
                name: employee.name,
                email: employee.email
            }
        })

    } catch (error) {
        next(error)
    }
}


const login = async (req, res, next)=>{
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            })
        }

        const employee = await Employee.findOne({
            email: email.trim().toLowerCase()
        })
        .select("+password")
        if(!employee  || !(await bcrypt.compare(password, employee.password))){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            })
        }
         
        const token  = createToken(employee._id.toString())
        return res.status(200).json({
            success: true,
            message: "Employee logged in successfully.",
            employee: {
                id: employee._id,
                name: employee.name,
                email: employee.email
            },
            token
        })
    }catch(error){
        next(error)
    }
}

module.exports = {
    register,
    login
}