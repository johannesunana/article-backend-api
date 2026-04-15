import express from 'express';
import responseTime from 'response-time';
import StatsD from 'node-statsd';
import emailAddresses from "email-addresses";

import {createUser, findUserByUsername, findUserByEmail} from './user/user.model.js';

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
  console.log(req.body, "\n");

  try {
    const existingUserByEmail = await findUserByEmail(req.body);
    const existingUserByUsername = await findUserByUsername(req.body);

    // if (existingUserByEmail || existingUserByUsername) {
    //   console.log("user exists check");
    //   return res.status(409).send({ msg: "User already exists" });
    // }
    
    if (!emailAddresses.parseOneAddress(req.body.email)) {
      console.log("invalid email check");
      return res.status(400).send({ msg: "Invalid email address" });
    }
    
    console.log("creating user");
    await createUser(req.body);
    console.log("create user successful");
    
    res.status(201).send({
      email: req.body.email,
      username: req.body.username
    });
    console.log("response sent");

  } catch (err) {
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

  
  const { email } = req.body;  
  
  res.status(200).send({
    id: user.id,
    email: user.email,
    createdAt: user.body.createdAt
  })
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
