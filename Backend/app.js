var createError = require('http-errors');
var express = require('express');

var mongoose=require('mongoose');


var indexRouter = require('./routes/index');

var bodyParser = require('body-parser'); // for converting data to json format
let model = require('./models/employee')

var app = express();



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(indexRouter);


app.use(function(req, res) {
    res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});

app.listen(3000,()=>{
  console.log("server listening at port number 3000");
});
var cb = function(err){
    if(!err)
        console.log("Connection Opened");
    else
        console.log("Connection Opened Failed");
};


mongoose.connect("mongodb://localhost/taskmanage",{ useNewUrlParser: true ,useUnifiedTopology: true },cb);
con = mongoose.connection;
module.exports = app;
