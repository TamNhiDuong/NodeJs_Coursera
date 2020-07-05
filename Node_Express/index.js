const express = require('express'),
    http = require('http');

const hostname = 'localhost';
const port = 3000;

const app = express();

//use Morgan to retrieve files
const morgan = require('morgan');
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

//Use body Parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//Use Router
const dishRouter = require('./routes/leaderRouter');
app.use('/leaders', dishRouter);

app.use((req, res, next) => {
    console.log(req.headers);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>');

});

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});