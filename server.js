var express = require('express');
var path = require('path');
var studRouter = require('./routes/studentRouter.js');
var app = express();
var bp = require('body-parser');
var validator = require('express-validator');

app.use(bp.urlencoded({
    extended: false
  }));
app.use(validator());
app.use(bp.json());
app.set('view engine', 'ejs');
app.set('views', ['./views', './views/student']);
app.set(express.static('public'));
app.use('/student', studRouter);

app.get('/', function(req, res){
    res.render('index');
});

app.listen(3000, (err)=> {
    console.log("Listening on port 3000");
});