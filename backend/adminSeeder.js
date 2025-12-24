import mongoose from "mongoose";
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import User from "./models/User.js";

dotenv.config()

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('db connected')
}).catch(err=>{
    console.error(err)
})

const adminUser = {
    username: 'amal_igou',
    email:'amal@gmail.com',
    password : bcrypt.hashSync('amal123',10),
    role : 'ADMIN'
}

const seedAdmin = async ()=>{
    try {
        const createAdmin = await User.create(adminUser)
        console.log('Admin user created successfully!');
        console.log('Email:', createAdmin.email);
        console.log('Password: amal123');
        process.exit();
    } catch (error) {
        console.error('error creating admin :',error)
        process.exit(1)
    }
}

seedAdmin()