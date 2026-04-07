import express from 'express';
const app = express();

app.use(express.json());

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
}

app.get('/', loggingMiddleware, (req, res) => {
  res
  .status(200)
  .send({
    msg: "Home Page"
  });
});

/* Register API */
app.post('/auth/register', loggingMiddleware, (req, res) => {
  console.log(req.body);
  return res.send(200); 
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
