// src/middleware/authenticate.js

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Reference: https://mattermost.com/blog/json-web-token-jwt-authentication-in-nodejs-applications/
// Reference: https://zweck.io/jwt-authentication-in-node-js-with-middleware-a-secure-approach-for-web-applications/
export const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      msg: "Authorization failed. No access token. Authorization token is required."
    });
  };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  }
  catch (err) {
    return res.status(403).send({
      msg: "Invalid token. Token not verified."
    });
  }
};