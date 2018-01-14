const _ = require('lodash');
const csvwriter = require('csvwriter');
const DBModels = require('../../db/models.js');
const mongoose = require('mongoose');
const moment = require('moment');
const uuid = require('uuid');

const getexporttoken = (req,res)=>{
  let query = {};
  try{
    //console.log(req.body);
    query = req.body;
  }
  catch(e){
    console.dir(e);
  }
  let userid = req.userid;
  if(typeof userid === 'string'){
    userid = mongoose.Types.ObjectId(userid);
  }
  //console.log(userid);

  const dbModel = DBModels.ExportTokenModel;
  dbModel.findOneAndUpdate({userid}, {$set:{
    userid,
    queryobjstring:JSON.stringify(query),
    tokenid:uuid.v4()
  }},{new: true,upsert:true},(err,tokenobj)=>{
    if(!err && !!tokenobj){
      res.status(200).json({
        tokenid:tokenobj.tokenid
      });
    }
    else{
      console.log(err);
      res.status(200).json({
        err:'无法获取token'
      });
    }
  });

}

module.exports= getexporttoken;
