
var express = require('express');
var router = express.Router();
let model = require('../models/employee')
let completedTask = require('../models/completedTask')
let mongoose=require('mongoose')
var cors = require('cors')
/* GET home page. */


router.use(cors())
router.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})
router.post('/insert',async (req,res)=>{

  let dataAll=req.body;
  try{
    //{empId:emp,name:nam,desk_pos:desk_p,work:{project:pro},
    let data=new model({empId:dataAll.empId,name:dataAll.name,desk_pos:dataAll.deskpos,work:{project:dataAll.work},
    status:false});
    if(await model.exists({empId:data.empId})){
      await model.updateOne({ empId:data.empId }, {$push: {work:{project:dataAll.work}}});
      await model.updateOne({ empId:data.empId }, {status:false});
      res.send("Hello,you have inserted your data");
      console.log("data inserted in array");
    }
    else{
        await data.save((err)=>{
          if(err){
            console.log(err+" occured");
          }else{
            res.send("Hello,you have inserted your data");
              console.log("Document Save Done");
          }
        });
    }
  }
  catch(err){
    console.log(err);
    res.send("error occured");
  }
});

router.get('/show',async (req,res)=>{
  try{
    let data=await model.find();
    res.json(data);
    console.log("showing your data");
  }
  catch(err){
    console.log(err);
    res.send("error occured");
  }
});



router.delete('/del/:val',async (req,res)=>{
  let param=req.params.val;
  console.log(param);
  try{
      await model.deleteMany({empId:param});
      res.send('data deleted successfully');
      console.log('Documents deleted');
  }
  catch(err){
    console.log(err);
  }
});

router.get('/sort/:val',async (req,res)=>{

  var param = req.params.val;

  try{
    if(param=='name'){
        let result=await model.find({}).sort({name:1});
        res.json(result);
    }
    else if(param=='empId'){
      let result=await model.find({}).sort({empId:1});
      res.json(result);
    }
    else if(param=='desk_pos'){
      let result=await model.find({}).sort({desk_pos:1});
      //console.log(result);
      res.json(result);
    }
  }
  catch(err){
    console.log(err);
  }
});
router.get('/search/:type/:val',async (req,res)=>{

  var param = req.params.type;
  var value=req.params.val;
  //console.log(param+" "+value);

  try{
    if(param=='name'){

        let result=await model.find({ $text: { $search: value  } });    //{name:value}
        res.json(result);
    }
    else if(param=='empId'){
      let result=await model.find({empId:value});
      //console.log(result);
      res.json(result);
    }
    else if(param=='desk_pos'){
      let result=await model.find({desk_pos:value});
      //console.log(result);
      res.json(result);
    }
    else if(param=='project'){
      let result=await model.find({"work.project" :value});
      res.json(result);
    }
  }
  catch(err){
    console.log(err);
  }
});



router.post('/finish/:empId/:work',async (req,res)=>{
  let val=req.params.empId;
  let cal=req.params.work;
  //console.log(val+" "+cal);
  try{

    // Update first matching array element using the positional operator ($)
    let temp=await model.updateOne({$and :[{ empId:val},{"work.project":cal}]},
                                    {$set: {"work.$.complete_time" :Date.now(),/*new Date("2021-06-27T10:49:29.328+0000")*/
                                    "status":true}});
                                            //moment.duration(x.diff(y))
    //console.log(await model.find({empId:val}));
    let updateStatus=await model.updateOne({ empId:val,"work.complete_time":{$eq:null}},
                                            {$set: {"status" : false}});
    //console.log(await model.find({ empId:val,"work.complete_time":{$eq:null}}));
    res.send(temp);
    console.log(temp+" updated successfully "+ updateStatus  );
  }
  catch(err){
    console.log(err);
  }
});


router.get('/time1',async (req,res)=>{
  try{

       let result=await model.aggregate([
         { $unwind: "$work" },
          {"$match" : {'work.complete_time':{'$ne':null}}},

           {
             $group:
                 {
                   _id: "$work.project",

                     dayssince: {
                        $avg:{
                         $ceil: {
                           $divide: [{ $subtract: ['$work.complete_time'/*new Date()*/, '$work.start_time'] }, 1000 * 60 * 60 * 24]
                         }
                       }
                     }
                 }
            }
       ]);
       res.json(result);
       //console.log(result);

     }
     catch(err){
       console.log(err);
     }

});
router.get('/time',async (req,res)=>{
//  let val=parseInt(req.params.id);
  //let cal=req.params.work;
  //console.log(typeof(val)+" "+typeof(cal));
  try{

       let result=await model.aggregate([
         { $unwind: "$work" },
          {"$match" : /*{ "$and" :[{'empId':  val},*/{'work.complete_time':{'$ne':null}}},
         //  //{ "$and" :[{'empId':  val},{'work.project':cal}]}
           // {
           //   "$project": {
           //
           //     empId:1,
           //
           //       dayssince: {
           //          $avg:{
           //           $ceil: {
           //             $divide: [{ $subtract: ['$work.complete_time'/*new Date()*/, '$work.start_time'] }, 1000 * 60 * 60 * 24]
           //           }
           //         }
           //       }
           //   }
           // },
           {
             $group:
                 {
                   _id: "$empId",

                     dayssince: {
                        $avg:{
                         $ceil: {
                           $divide: [{ $subtract: ['$work.complete_time'/*new Date()*/, '$work.start_time'] }, 1000 * 60 * 60 * 24]
                         }
                       }
                     }
                 }
            }
       ]);
       if(result.length==0)
       res.json(result);
       else {
         for(var i=0;i<result.length;i++){
          let w= await model.updateOne({ empId:result[i]._id},
                                                   {$set: {"average" : result[i].dayssince}});
                                                   // console.log(w);
         }
         res.json(result)
       }
       //console.log(result);
     }
     catch(err){
       console.log(err);
     }
});
router.get('/time2/:val',async (req,res)=>{
  try{
      var x=req.params.val;
       let result=await model.aggregate([
         { $unwind: "$work" },
          {"$match" : {"$and":[{'work.project':x},{'work.complete_time':{'$ne':null}}]}},
          //{ "$and" :[{'empId':  val},{'work.project':cal}]}
          {$sort:{empId:1}},
           {
             "$group":
                 {
                   _id: "$work.project",
                   time: { $push: {$ceil:{$divide: [{ $subtract: ['$work.complete_time', '$work.start_time'] }, 1000 * 60 * 60 * 24]}} },
                   empid:{$push:"$empId"}

                 }
            }
       ]);
       res.json(result);
       //console.log(result);

     }
     catch(err){
       console.log(err);
     }

});
router.use(function(req, res) {
    res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});
module.exports = router;
