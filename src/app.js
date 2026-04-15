// src/app.js

import express from 'express';
import responseTime from 'response-time';
import StatsD from 'node-statsd';
import emailAddresses from "email-addresses";
import bcrypt, { hash } from 'bcrypt';

import {createUser, findUserByUsername, findUserByEmail, loginEmail, loginUsername} from './user/user.model.js';

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
  // console.log(req.body, "\n");

  try {
    const existingUserByEmail = await findUserByEmail(req.body);
    const existingUserByUsername = await findUserByUsername(req.body);

    if (existingUserByEmail || existingUserByUsername) {
      console.log("user exists check");
      return res.status(409).send({ msg: "User already exists" });
    }
    
    if (!emailAddresses.parseOneAddress(req.body.email)) {
      console.log("invalid email check");
      return res.status(400).send({ msg: "Invalid email address" });
    }
    
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
  console.log(req.body, "\n")

  // check if email is a valid email address, if so check for user with that email, else check for user with that username
  // vary depending if request is email or username
  try {
    if (emailAddresses.parseOneAddress(req.body.email)) {
      var user = await loginEmail(req.body);
    } else {
      var user = await loginUsername(req.body);
    }
    if (!user) {
      console.log("user not found check");
      return res.status(404).send({ msg: "User not found" });
    }
    // use brcypt.compare to compare the password in the request body with the hashed password in the database
    // if they match, return user data, else return 401
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      console.log("invalid password check");
      return res.status(401).send({ msg: "Invalid password" });
    }
    else {
      console.log("login successful");
      return res.status(200).json({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt
      });
    };
  }
  catch (err) {
    console.log("server error", err);
    return res.status(500).send({ msg: "Internal Server Error" });
  };

  // const { email } = req.body;  
  
  res.status(200).send({
    id: user.id,
    email: user.email,
    createdAt: user.body.createdAt
  })
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
