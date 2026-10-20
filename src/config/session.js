
require("dotenv").config();

const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const {pool} = require ("../../database/db");

if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET não está definida no .env");
}

const sessionConfig ={
    store : new pgSession ({
        pool,
        tableName : "admin_sessions",
        createTableIfMissing : true
    }),
    
    secret : process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    
    cookie:{
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        sameSite:"lax",
        maxAge: 1000 * 60 * 60 * 8
    },
    
}

module.exports =
session(sessionConfig);