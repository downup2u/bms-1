const config = require('../../config.js');
let DBModels = require('../../db/models.js');
let mongoose  = require('mongoose');
const winston = require('../../log/log.js');


exports.exportalarm = (actiondata,ctx,callback)=>{
  console.log(`exportalarm==>${JSON.stringify(actiondata)}`);

  const realtimealarmModel = DBModels.RealtimeAlarmModel;
  const query = actiondata.query || {};

  realtimealarmModel.find(query,(err,list)=>{
    if(!err){
      list = JSON.parse(JSON.stringify(list));
      if(list.length > 0){
        callback({
          cmd:'exportalarm_result',
          payload:{list}
        });
      }
      else{
        callback({
          cmd:'common_err',
          payload:{errmsg:`找不到数据`,type:'exportalarm'}
        });
      }
    }
    else{
      callback({
        cmd:'common_err',
        payload:{errmsg:err.message,type:'exportalarm'}
      });
    }
  });
}


exports.queryrealtimealarm = (actiondata,ctx,callback)=>{
  const realtimealarmModel = DBModels.RealtimeAlarmModel;
  const query = actiondata.query || {};
  realtimealarmModel.find(query,(err,list)=>{
    if(!err){
      callback({
        cmd:'queryrealtimealarm_result',
        payload:{list}
      });
    }
    else{
      callback({
        cmd:'common_err',
        payload:{errmsg:err.message,type:'queryrealtimealarm'}
      });
    }
  });
}

//app中的报警分页
exports.ui_searchalarm =  (actiondata,ctx,callback)=>{
  // PC端获取数据--->{"cmd":"searchbatteryalarm","data":{"query":{"queryalarm":{"warninglevel":0}}}}
  const realtimealarmModel = DBModels.RealtimeAlarmModel;
  let query = actiondata.query || {};
  realtimealarmModel.paginate(query,actiondata.options,(err,result)=>{
    if(!err){
      callback({
        cmd:'ui_searchalarm_result',
        payload:{result}
      });
    }
    else{
      callback({
        cmd:'common_err',
        payload:{errmsg:err.message,type:'ui_searchalarm'}
      });
    }
  });
}

exports.searchbatteryalarm =  (actiondata,ctx,callback)=>{
  // PC端获取数据--->{"cmd":"searchbatteryalarm","data":{"query":{"queryalarm":{"warninglevel":0}}}}
  const realtimealarmModel = DBModels.RealtimeAlarmModel;
  let query = actiondata.query || {};
  if(!!query.queryalarm){
    query = query.queryalarm;
  }
  console.log(`查询条件:${JSON.stringify(query)}`);
  realtimealarmModel.find(query,(err,list)=>{
  //realtimealarmModel.aggregate({$sample: {size: 15}}).exec((err,list)=>{
    if(!err){
      callback({
        cmd:'searchbatteryalarm_result',
        payload:{list}
      });
    }
    else{
      callback({
        cmd:'common_err',
        payload:{errmsg:err.message,type:'searchbatteryalarm'}
      });
    }
  });
}

exports.searchbatteryalarmsingle =  (actiondata,ctx,callback)=>{
  const realtimealarmModel = DBModels.RealtimeAlarmModel;
  let query = actiondata.query || {};
  if(!!query.queryalarm){
    query = query.queryalarm;
  }
  realtimealarmModel.find(query,(err,list)=>{
    if(!err){
      callback({
        cmd:'searchbatteryalarmsingle_result',
        payload:{list}
      });
    }
    else{
      callback({
        cmd:'common_err',
        payload:{errmsg:err.message,type:'searchbatteryalarmsingle'}
      });
    }
  });
}

//app中的报警分页
exports.ui_searchalarmdetail =  (actiondata,ctx,callback)=>{
  // PC端获取数据--->{"cmd":"searchbatteryalarm","data":{"query":{"queryalarm":{"warninglevel":0}}}}
  const realtimealarmrawModel = DBModels.RealtimeAlarmRawModel;
  let query = actiondata.query || {};
  realtimealarmrawModel.paginate(query,actiondata.options,(err,result)=>{
    if(!err){
      callback({
        cmd:'ui_searchalarmdetail_result',
        payload:{result}
      });
    }
    else{
      callback({
        cmd:'common_err',
        payload:{errmsg:err.message,type:'ui_searchalarmdetail'}
      });
    }
  });
}

exports.exportalarmdetail = (actiondata,ctx,callback)=>{
  console.log(`exportalarmdetail==>${JSON.stringify(actiondata)}`);

  const realtimealarmrawModel = DBModels.RealtimeAlarmRawModel;
  const query = actiondata.query || {};

  realtimealarmrawModel.find(query,(err,list)=>{
    if(!err){
      list = JSON.parse(JSON.stringify(list));
      if(list.length > 0){
        callback({
          cmd:'exportalarmdetail_result',
          payload:{list}
        });
      }
      else{
        callback({
          cmd:'common_err',
          payload:{errmsg:`找不到数据`,type:'exportalarmdetail'}
        });
      }
    }
    else{
      callback({
        cmd:'common_err',
        payload:{errmsg:err.message,type:'exportalarmdetail'}
      });
    }
  });
}
