import express from 'express';
import responseTime from 'response-time';
import StatsD from 'node-statsd';

// import { user } from './user/user.model.js';
import {createUser} from './user/user.model.js';

const app = express();
// const stats = new StatsD()

app.use(express.json());

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
}

app.get('/', loggingMiddleware, (req, res) => {
  console.log(user);
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
  console.log(req.body);
  res.status(200).send(req.body);  // OK
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
