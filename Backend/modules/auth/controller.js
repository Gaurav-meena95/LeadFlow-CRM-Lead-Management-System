const { validationInput } = require("../../utils/utils")
const User = require('./model')
const sec_key = process.env.sec_key
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const signup = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body

        const value = validationInput({ name, email, phone, password, role })
        if (value) {
            return res.status(403).json({ message: `Check missing value ${value}` })
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(401).json({ message: "Invalid Email Address" })
        }

        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({ message: "Phone number must be exactly 10 digits" })
        }

        if (!/(?=.*[!@#$%^&*])(?=.{8,})/.test(password)) {
            return res.status(400).json({ message: "Password must be at least 8 characters long and contain one special character" })
        }

        const existing = await User.findOne({
            $or: [{ email }, { phone }]
        })

        if (existing) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            role
        })

        return res.status(201).json({
            message: 'Signup successful',
            user: newUser
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}


const login = async (req, res) => {
    try {
        const { email, password, role } = req.body

        const value = validationInput({ email, password, role })
        if (value) {
            return res.status(403).json({ message: `Check missing value ${value}` })
        }

        existing = await User.findOne({ email: email, role })

        if (!existing) {
            return res.status(404).json({ message: "User not found or check role" })
        }

        const isPasswordMatch = await bcrypt.compare(password, existing.password)

        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const jwtToken = jwt.sign(
            { id: existing._id, email: existing.email, role: existing.role },
            sec_key,
            { expiresIn: '1h' }
        )

        const refreshToken = jwt.sign(
            { id: existing._id, email: existing.email, role: existing.role },
            sec_key,
            { expiresIn: '7d' }
        )

        return res.status(200).json({
            message: "Login Successfully",
            user: existing,
            token: jwtToken,
            refreshToken
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Login Failed', error: error.message })
    }
}

module.exports = { signup, login }