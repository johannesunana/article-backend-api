import express from 'express';
import responseTime from 'response-time';
import StatsD from 'node-statsd';

const app = express();
const stats = new StatsD()


app.use(express.json());

// app.use(responseTime( (req, res, time) => {
// }));

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
}

app.use(responseTime((req, res, time) => {
  var stat = (req.method + req.url).toLowerCase()
    .replace(/[:.]/g, '')
    .replace(/\//g, '_')
  stats.timing(stat, time)
}));

app.get('/', loggingMiddleware, (req, res) => {
  res
  .status(200)
  .send({
    msg: "Home Page"
  });
});

/* Register endpoint */
app.post('/auth/register', loggingMiddleware, (req, res) => {
  console.log(req.body);
  res
    .status(201)
    .send(req.body);  // Created
});

/* Login endpoint */
app.post('/auth/login', loggingMiddleware, (req, res) => {
  console.log(req.body);
  res
    .status(200)
    .send(req.body);  // OK
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
