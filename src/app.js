import express from 'express';
import responseTime from 'response-time';
import StatsD from 'node-statsd';

import {createUser, loginUser} from './user/user.model.js';

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
app.post('/auth/register', loggingMiddleware, (req, res) => {
  console.log(req.body, "\nBody before passing to createUser: \n");
  
  createUser(req.body);
  console.log("\nAfter createUser: \n");

  res.status(201).send({
    email: req.body.email,
    username: req.body.username
  });  // Created
});

/* Login endpoint */
app.post('/auth/login', loggingMiddleware, (req, res) => {
  console.log(req.body, "\nBody before passing to loginUser: \n")
  // not working yet
  loginUser(req.body)
  res.status(200).send({
    id: req.body.id,
    email: req.body.email,
    createdAt: req.body.createdAt
  })
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
