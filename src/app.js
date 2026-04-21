// src/app.js

import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import emailAddresses from "email-addresses";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {createUser, findUserByUsername, findUserByEmail, loginEmail, loginUsername} from './user/user.model.js';
import {authenticate} from './middleware/authenticate.js';

const app = express();
app.use(express.json());

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
}

app.get('/', loggingMiddleware, (req, res) => {
  res.status(200).send({
    msg: "Home Page"
  });
});

/* Register endpoint */
app.post('/auth/register', loggingMiddleware, async (req, res) => {

  try {
    if (!req.body.email || !req.body.username || !req.body.password) {
      return res.status(400).send({ msg: "Email, username, and password are required" });
    }

    const existingUserByEmail = await findUserByEmail(req.body);
    const existingUserByUsername = await findUserByUsername(req.body);

    if (existingUserByEmail || existingUserByUsername) {
      console.log(`user exists check: existingUserByEmail: ${existingUserByEmail}, existingUserByUsername: ${existingUserByUsername}`);
      return res.status(409).send({ msg: "User already exists" });
    };
    
    if (!emailAddresses.parseOneAddress(req.body.email)) {
      console.log("invalid email check");
      return res.status(400).send({ msg: "Invalid email address" });
    };
    
    // check empty password
    if (!req.body.password) {
      return res.status(400).send({ msg: "Password is required" });
    }

    // minimum password length 8 characters
    if (req.body.password.length < 8) {
      console.log(`invalid password length: ${req.body.password.length}`);
      return res.status(400).send({ msg: "Password must be at least 8 characters long" });
    };

    console.log("creating user");

    const hashedPass = await bcrypt.hash(req.body.password, 10);
    // console.log(`HashedPass ${hashedPass}`);   
    
    const body = ({
      "email": req.body.email,
      "username": req.body.username,
      "password": hashedPass
    });
    
    const user = await createUser(body);    // assign result of createUser to variable
    console.log("create user successful");
    
    res.status(201).json(user);
    console.log("response sent");
    }
   
    catch (err) {
      if (err.code === 'P2002') {
        console.log("user exists");
        res.status(409).send({ msg: "User already exists" });
      } else {
        console.log("server error", err);
        res.status(500).send({ msg: "Internal Server Error" });
      }
    };
  });

/* Login endpoint */
app.post('/auth/login', loggingMiddleware, async (req, res) => {

  try {
    if (!req.body.password) {
      console.log("missing password check");
      return res.status(400).send({ msg: "Password is required" });
    };

    // check empty password, minimum password length 8 characters
    if (!req.body.password || req.body.password.length < 8) {
      console.log(`invalid password length: ${req.body.password.length}`);
      return res.status(400).send({ msg: "Password must be at least 8 characters long" });
    };

    let user = null;
    
    // require an email object or username object before proceeding with bcrypt.compare
    if (req.body.email) {

      // validate email before proceeding
      if (!emailAddresses.parseOneAddress(req.body.email)) {
        console.log("invalid email check");
        return res.status(400).send({ msg: "Invalid email address" });
      };

      // assign email to user variable
      user = await loginEmail({ 
        email: req.body.email
      });
      console.log(`loginEmail response: ${user}`);
    }
    else if (req.body.username) {

      // assign username to user variable
      user = await loginUsername({ 
        username: req.body.username
      });
      console.log(`loginUsername response: ${user}`);
    }
    else {
      console.log("failed email/username check");
      return res.status(400).send({ msg: "Email or username is required" });
    };
    
    if (!user) {
      console.log("user not found check");
      return res.status(401).send({ msg: "Invalid credentials" });
    };

    // use brcypt.compare to compare the password in the request body with the hashed password in the database
    // if they match, return user data, else return 401
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    console.log(`passwordMatch response: ${passwordMatch}`);
    
    if (!passwordMatch) {
      console.log(`passwordMatch response: ${passwordMatch} invalid password check`);
      return res.status(401).send({ msg: "Invalid credentials" });
    }

    console.log("login successful");

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "1h"
      }
    );

    return res.status(200).json({
      success: true,
      token: token,
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
    
  }
  catch (err) {
    console.log("server error", err);
    return res.status(500).send({
      msg: "Internal Server Error"
    });
  };
});

/* Middleware Authentication */
app.get('/auth/me', loggingMiddleware, authenticate, (req, res) => {
  res.json({
    user: req.user
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
