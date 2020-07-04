let mongoose = require('mongoose')
var schema=mongoose.Schema;
mongoose.set('useCreateIndex', true);
var emp= new schema({
  empId:{type:Number,Unique:true},
  name:{type:String},
  desk_pos: {type:Number,Unique:true},
  work: [{
    project:{type:String},
    start_time:{ type: Date, default: Date.now },
    complete_time:{type:Date,default: null},
    //duration:{type:mongoose.Mixed ,default:0}
  }],
  //Work: [String],
  status:{type:Boolean,default: true}, //true means free
  average:{type:Number,default:0},

});

emp.index( { name: "text" } );
var cb = function(err){
    if(!err)
        console.log("Connection Opened");
    else
        console.log("Connection Opened Failed");
};


mongoose.connect("mongodb://localhost/taskmanage",{ useNewUrlParser: true ,useUnifiedTopology: true },cb);
con = mongoose.connection;
module.exports = mongoose.model('employee', emp)
