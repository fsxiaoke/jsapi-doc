var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(__dirname));
app.listen(8888);

console.log('Running on localhost:8888');