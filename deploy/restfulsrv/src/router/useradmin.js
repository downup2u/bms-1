const DBModels = require('../db/models.js');
const mongoose     = require('mongoose');
const config = require('../config.js');
const _  = require('lodash');
const jwt = require('jsonwebtoken');
const moment  = require('moment');
const dbs = require('../db/index.js');
const middlewareauth = require('./middlewareauth.js');
const adminaction = require('../db/adminaction.js');
const pwd = require('../util/pwd.js');

const startmodule = (app)=>{

const GET_LIST = 'GET_LIST';
const GET_ONE = 'GET_ONE';
const GET_MANY = 'GET_MANY';
const GET_MANY_REFERENCE = 'GET_MANY_REFERENCE';
const CREATE = 'CREATE';
const UPDATE = 'UPDATE';
const DELETE = 'DELETE';

const curd = (schmodel)=>{
  return (req,res)=>{
    let queryparam =   req.body;
    const organizationid = mongoose.Types.ObjectId(req.params.organizationid);
    console.log("queryparam=>" + JSON.stringify(queryparam));
    console.log(`organizationid=>${organizationid}`);
    let query = {};
    let sort = {};
    let options = {};
    if(queryparam.params.hasOwnProperty('sort')){
      sort[queryparam.params.sort.field] = queryparam.params.sort.order==="DESC"?-1:1;
      options.sort = sort;
    }
    if(queryparam.params.hasOwnProperty('pagination')){
      options['page'] = queryparam.params.pagination.page;
      if (typeof options['page'] === 'string') {
        options['page'] = parseInt(options['page']);
      }
      options['limit'] = queryparam.params.pagination.perPage;
      if (typeof options['limit'] === 'string') {
        options['limit'] = parseInt(options['limit']);
      }
    }
    if(queryparam.params.hasOwnProperty('filter')){
      let querypre = queryparam.params.filter;
      query = {};
      _.map(querypre,(value,key)=>{
        let keysz = key.split('_');
        if(keysz.length === 2){
          if(keysz[1]=== 'q'){
            query[keysz[0]] = new RegExp(value);
          }
        }
        else{
          query[key] = value;
        }
      });

    }
    console.log("query=>" + JSON.stringify(query));
    console.log("options=>" + JSON.stringify(options));


    if(queryparam.type === GET_LIST){
      let dbModel = mongoose.model(schmodel.collectionname, schmodel.schema);
      query['organizationid'] = organizationid;
      dbModel.paginate(query, options,(err,result)=>{
        console.log("GET_LIST result=>" + JSON.stringify(result));
        res.status(200).json(result);
      });
    }
    else if(queryparam.type === GET_ONE){
      let dbModel = mongoose.model(schmodel.collectionname, schmodel.schema);
      dbModel.findById(queryparam.params.id,(err,result)=>{
        console.log("GET_ONE result=>" + JSON.stringify(result));
        res.status(200)
            .json(result);
      });
    }
    else if(queryparam.type === GET_MANY){
      //"params":{"ids":["58e71be6ef4e8d02eca6e0e8","58eaecea130f4809a747d2f8"]}}
      //{ data: {Record[]} }
      let idstrings = queryparam.params.ids;
      let ids = [];
      _.map(idstrings,(id)=>{
        if(typeof id === 'string'){
          ids.push(mongoose.Types.ObjectId(id));
        }
      });
      let dbModel = mongoose.model(schmodel.collectionname, schmodel.schema);
      dbModel.find({ _id: { "$in" : ids} },(err,result)=>{
        console.log("GET_MANY result=>" + JSON.stringify(result));
        res.status(200)
            .json(result);
      });
    }
    else if(queryparam.type === GET_MANY_REFERENCE){
      let query = {};
      query[queryparam.params.target] = queryparam.params.id;
      query['organizationid'] = organizationid;
      console.log("GET_MANY_REFERENCE 查询条件=>" + JSON.stringify(query));
      let dbModel = mongoose.model(schmodel.collectionname, schmodel.schema);
      dbModel.paginate(query,options,(err,result)=>{
        console.log("GET_MANY_REFERENCE result=>" + JSON.stringify(result));
        res.status(200)
            .json(result);
      });
    }
    else if(queryparam.type === CREATE){
      let dbModel = mongoose.model(schmodel.collectionname, schmodel.schema);
      let createddata = queryparam.params.data;
      if(schmodel.collectionname === 'systemconfig' ||
          schmodel.collectionname === 'device' ||
          schmodel.collectionname === 'devicegroup' ||
          schmodel.collectionname === 'user' ||
          schmodel.collectionname === 'role' ||
          schmodel.collectionname === 'permission' ||
          schmodel.collectionname === 'datadict'){
          createddata.organizationid = organizationid;
      }
      adminaction.preaction('save',schmodel.collectionname,createddata,(err,result)=>{
        if(!err && result){
          let entity = new dbModel(createddata);
          entity.save((err,result)=>{
            console.log("CREATE err=>" + JSON.stringify(err));
            console.log("CREATE result=>" + JSON.stringify(result));
            if(!err){
              res.status(200)
                  .json(result);
              adminaction.postaction('save',schmodel.collectionname,result);
            }
            else{
              res.status(500)
                  .json(err);
            }
          });
        }
      });


    }
    else if(queryparam.type === UPDATE){
      let dbModel = mongoose.model(schmodel.collectionname, schmodel.schema);
      let updateddata = queryparam.params.data;
      adminaction.preaction('findByIdAndUpdate',schmodel.collectionname,updateddata,(err,result)=>{
        if(!err && result){
          dbModel.findByIdAndUpdate(queryparam.params.id,updateddata, {new: true},(err, result)=> {
                  console.log("UPDATE err=>" + JSON.stringify(err));
                  console.log("UPDATE result=>" + JSON.stringify(result));
                    if(!err){
                      res.status(200)
                          .json(result);
                      adminaction.postaction('findByIdAndUpdate',schmodel.collectionname,result);
                    }
                    else{
                      res.status(500)
                          .json(err);
                    }
                  });
        }
        else{
          res.status(500)
              .json(err);
        }
      });
    }
    else if(queryparam.type === DELETE){
      let dbModel = mongoose.model(schmodel.collectionname, schmodel.schema);
      dbModel.findOneAndRemove({
            _id: queryparam.params.id
        }, (err, result)=> {
          console.log("DELETE err=>" + JSON.stringify(err));
          console.log("DELETE result=>" + JSON.stringify(result));
          if(!err){
            res.status(200)
                .json(result);
          }
          else{
            res.status(500)
                .json(err);
          }
        });
    }

  };
}
// let defaultmiddlewareauth = (req,res,next)=>{
//   next();
// };
app.post('/adminauth/v1/:organizationid',(req,res)=>{
  const actiondata =   req.body;
  console.log("actiondata=>" + JSON.stringify(actiondata));
  const organizationid = mongoose.Types.ObjectId(req.params.organizationid);
  console.log(`--organizationid=>${organizationid}`);

  const userModel = DBModels.UserModel;
  userModel.findOne({ username: actiondata.username,adminflag:1 }, (err, user)=> {
    if (!!err) {
      res.status(200).json({
        loginsuccess:false,
        err:'服务器内部错误'
      });
      return;
    }
    if (!user) {
      res.status(200).json({
        loginsuccess:false,
        err:'用户找不到'
      });
      return;
    }
    if(!user.organizationid){
      res.status(200).json({
        loginsuccess:false,
        err:'用户尚未分配'
      });
      return;
    }
    pwd.checkPassword(user.passwordhash,user.passwordsalt,actiondata.password,(err,isloginsuccess)=>{
      if(!err && isloginsuccess){
        let token = jwt.sign({
              exp: Math.floor(Date.now() / 1000) +config.loginuserexptime,
              _id:user._id,
              usertype:'user',
              groupid:user.groupid,
              organizationid:user.organizationid,
            },config.secretkey, {});
        res.status(200).json({
          loginsuccess:true,
          token:token
        });
      }
      else{
        res.status(200).json({
          loginsuccess:false,
          err:'用户密码错误'
        });
      }
    });
  });



});

for(let keyname in dbs){
    let schmodel = dbs[keyname];
    let urlname = `/adminapi/v1/:organizationid${schmodel.urlname}`;
    console.log(`urlname:${urlname}`);
    app.post(urlname,middlewareauth,curd(schmodel));
    app.get(urlname,middlewareauth,curd(schmodel));
    app.put(urlname,middlewareauth,curd(schmodel));
    app.delete(urlname,middlewareauth,curd(schmodel));
    app.options(urlname,middlewareauth,curd(schmodel));
  }


  app.post('/admincustomapi/v1/:organizationid/:actionname',(req,res)=>{
    const actionname = req.params.actionname;
    const organizationid = mongoose.Types.ObjectId(req.params.organizationid);
    console.log(`--organizationid=>${organizationid},actionname:${actionname}`);
    if(actionname === 'systemload' || actionname === 'systemsave'){
      const systemconfigModel = DBModels.SystemConfigModel;
      if(actionname === 'systemload'){
        systemconfigModel.findOne({ organizationid: organizationid }, (err, systemconfig)=> {
          if(!err && !!systemconfig){
            res.status(200).json(systemconfig);
          }
          else{
            res.status(200).json({});
          }
        });
      }
      else{//actionname === 'systemsave'
        const updateddata = req.body;
        console.log(`开始保存:${JSON.stringify(updateddata)}`);
        systemconfigModel.findOneAndUpdate({ organizationid: organizationid },{$set:updateddata}, {upsert:true,new: true},(err, systemconfig)=> {
          if(!err && !!systemconfig){
            res.status(200).json(systemconfig);
          }
          else{
            res.status(200).json({});
          }
        });
      }
    }//<---if(actionname === 'systemload' || actionname === 'systemsave'){
  });
};



module.exports=  startmodule;
