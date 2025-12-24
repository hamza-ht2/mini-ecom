import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const generateToken = (id, role)=>{
    return jwt.sign(
        {id, role},
        process.env.JWT_SECRET,
        {expiresIn:'7d'}
    )
}
const formatUserResponse = (user)=>({
    id: user._id,
    username: user.username,
    email : user.email,
    role : user.role
})

export const register = async(req,res)=>{
    try {
        const {username, email, password} = req.body
        if(!username || !email || !password){
            return res.status(400).json({message:'all fields are required'})
        }
        const exists = await User.findOne({email})
        if(exists) return res.status(401).json({message:'Email already in use'})
        const hashed = await bcrypt.hash(password,10)
        const user = await User.create({username, email, password:hashed})
        const token = generateToken(user._id, user.role)
        res.status(201).json({
            token,
            user: formatUserResponse(user)
        })
    } catch (error) {
        console.error('REGISTER ERROR',error)
        res.status(500).json({message:'server error'})
    }
}

export const login = async(req,res)=>{
    try {
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({message:'all fields are required'})
        }
        const user = await User.findOne({email})
        if(!user) return res.status(401).json({message:'invalid crendentials'})
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(401).json({message:'invalid crendentials'})
        const token = generateToken(user._id, user.role)
        res.status(200).json({
            token,
            user: formatUserResponse(user)
        })
    } catch (error) {
        console.error('LOGIN ERROR',error)
        res.status(500).json({message:'server error'})
    }
}