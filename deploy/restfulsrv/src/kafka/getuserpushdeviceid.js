const _ = require('lodash');
const DBModels = require('../db/models');
const mongoose = require('mongoose');

const getuserpushdeviceid = (DeviceId,callbackfn)=>{
  const dbModel = DBModels.UserModel;
  dbModel.find({'alarmsettings.subscriberdeviceids':DeviceId},(err,result)=>{
    if(!err && !!result){
      let userlist = [];
      _.map(result,(v)=>{
        userlist.push(v._id.toString());
      });
      callbackfn(userlist);
    }
    else{
      callbackfn([]);
    }
  });
};


module.exports = getuserpushdeviceid;
