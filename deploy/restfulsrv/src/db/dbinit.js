const _ = require('lodash');
const DBModels = require('./models');
const mongoose = require('mongoose');
const pwd = require('../util/pwd.js');

const initjson = [
  {
        "_id" : mongoose.Types.ObjectId("5a03b61113e7410cd0ef3090"),
        "name" : "管理平台",
        "memo" : "管理平台",
        "organizationid" : mongoose.Types.ObjectId("599af5dc5f943819f10509e6"),
        systemflag:1,
  },
  {
      "_id" : mongoose.Types.ObjectId("5a03b61f13e7410cd0ef3091"),
      "name" : "综合信息平台",
      "memo" : "综合信息平台",
      "organizationid" : mongoose.Types.ObjectId("599af5dc5f943819f10509e6"),
      systemflag:1,
  },
  {
      "_id" : mongoose.Types.ObjectId("5a03b65113e7410cd0ef3092"),
      "name" : "综合信息APP",
      "memo" : "综合信息APP",
      "organizationid" : mongoose.Types.ObjectId("599af5dc5f943819f10509e6"),
      systemflag:1,
  },
  {
      "_id" : mongoose.Types.ObjectId("5a03b66013e7410cd0ef3093"),
      "name" : "电池包监控平台",
      "memo" : "电池包监控平台",
      "organizationid" : mongoose.Types.ObjectId("599af5dc5f943819f10509e6"),
      systemflag:1,
  },
  {
      "_id" : mongoose.Types.ObjectId("5a03b66e13e7410cd0ef3094"),
      "name" : "电池包监控APP",
      "memo" : "电池包监控APP",
      "organizationid" : mongoose.Types.ObjectId("599af5dc5f943819f10509e6"),
      systemflag:1,
  },
];

let groupobj = {
    "_id" : mongoose.Types.ObjectId("599b88f5f63f591defcf5f71"),
    "name" : "全部设备",
    "memo" : "全部设备",
    "contact" : "admin",
    "organizationid" : mongoose.Types.ObjectId("599af5dc5f943819f10509e6"),
    "deviceids" : [],
    systemflag:1,
};

const initDB = ()=>{
  const dbModel = DBModels.PermissionModel;
  _.map(initjson,(v)=>{
    dbModel.findOneAndUpdate({_id:v._id}, {$set:v},{new: true,upsert:true},(err,result)=>{
    });
  });

  //createadmin
  const passwordsalt = pwd.getsalt();
  pwd.hashPassword('admin',passwordsalt,(err,passwordhash)=>{
    if(!err){
      adminuser = {
        username:'admin',
        passwordsalt,
        passwordhash,
        adminflag:1
      };
      const userModel = DBModels.UserModel;
      userModel.findOneAndUpdate({username:adminuser.username}, {$set:adminuser},{new: true,upsert:true},(err,result)=>{
      });
    }
  });

  //新建一个全部数据的分组
  const deviceModel = DBModels.DeviceModel;
  const queryexec = deviceModel.find({}).select({
    '_id':1});
  queryexec.exec((err,list)=>{
    if(!err && !!list){
      _.map(list,(deviceinfo)=>{
        groupobj.deviceids.push(mongoose.Types.ObjectId(deviceinfo._id));
      });
    }
    const devicegroupModel = DBModels.DeviceGroupModel;
    devicegroupModel.findOneAndUpdate({_id:groupobj._id}, {$set:groupobj},{new: true,upsert:true},(err,result)=>{
    });
  });
}

module.exports= initDB;
