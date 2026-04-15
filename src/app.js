import express from 'express';
import responseTime from 'response-time';
import StatsD from 'node-statsd';

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
  
  // createUser(req.body);
  // findUnique to check if email or username already exists, if it does, return 409, else create the user and return 201
  // proceed if findUserByEmail and findUserByUsername return null, else return 409

  try {
    const existingUserByEmail = await findUserByEmail(req.body);
    const existingUserByUsername = await findUserByUsername(req.body);

    if (existingUserByEmail || existingUserByUsername) {
      return res.status(409).send({ msg: "User already exists" });
    }

    await createUser(req.body);
    res.status(201).send({
      email: req.body.email,
      username: req.body.username
    });

  } catch (err) {
    if (err.code === 'P2002') {
      res.status(409).send({ msg: "User already exists" });
    } else {
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
