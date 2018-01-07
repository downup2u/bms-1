const config = require('../../config.js');
const DBModels = require('../../db/models.js');
const mongoose  = require('mongoose');
const winston = require('../../log/log.js');
const _ = require('lodash');
const moment = require('moment');
const getdevicesids = require('../getdevicesids');

const getalarmfieldtotxt = (alarmfield)=>{
    const mapdict = config.mapdict;
    if(_.startsWith(alarmfield, 'AL_') || _.startsWith(alarmfield, 'F[')){
      if(_.startsWith(alarmfield, 'AL_')){
        if(!!mapdict[alarmfield]){
          return mapdict[alarmfield].showname;
        }
      }
      return alarmfield;
    }
    return undefined;
};

const bridge_alarminfo = (alarminfo)=>{
  // console.log(`alarminfo===>${JSON.stringify(alarminfo)}`);
  let alarmtxt = '';
  let alarminfonew = {};
  alarminfonew[`key`] = alarminfo._id;
  alarminfonew[`车辆ID`] = alarminfo[`DeviceId`];
  alarminfonew[`报警时间`] = alarminfo[`DataTime`];
  alarminfonew[`报警等级`] = alarminfo[`warninglevel`];

  let alarminfotmp = _.clone(alarminfo);
  let rest = _.omit(alarminfotmp,['_id','CurDay','DeviceId','__v','DataTime','warninglevel','Longitude','Latitude']);
  // console.log(`rest===>${JSON.stringify(rest)}`);
  _.map(rest,(v,key)=>{
    let keytxt = getalarmfieldtotxt(key);
    if(!!keytxt){
      alarmtxt += `${keytxt} ${v}次|`
    }

  });

  alarminfonew[`报警信息`] = alarmtxt;
  // console.log(`alarminfonew===>${JSON.stringify(alarminfonew)}`);
  return alarminfonew;
}

const bridge_alarmrawinfo = (alarmrawinfo)=>{
  const mapdict = config.mapdict;
  console.log(`alarminfo===>${JSON.stringify(alarmrawinfo)}`);
  let alarmtxt = '';
  let alarminfonew = {};
  alarminfonew[`key`] = alarmrawinfo._id;
  alarminfonew[`车辆ID`] = alarmrawinfo[`DeviceId`];
  alarminfonew[`报警时间`] = alarmrawinfo[`DataTime`];
  alarminfonew[`报警等级`] = alarmrawinfo[`warninglevel`];

  let alarminforawtmp = _.clone(alarmrawinfo);
  let rest = _.omit(alarminforawtmp,['_id','CurDay','DeviceId','__v','DataTime','warninglevel','Longitude','Latitude']);
  // console.log(`rest===>${JSON.stringify(rest)}`);
  let warninglevelmap = [
    '无','低','中','高'
  ];
  _.map(rest,(v,alarmfield)=>{
    if(alarmfield === 'AL_Trouble_Code'){
      alarmtxt += `F[${v}]`;
    }
    if(_.startsWith(alarmfield, 'AL_')){
      if(!!mapdict[alarmfield]){
         if(v>= 0 && v<= 3){
           alarmtxt += `${mapdict[alarmfield].showname}[${warninglevelmap[v]}]`;
         }
      }
    }
  });

  alarminfonew[`报警信息`] = alarmtxt;
  console.log(`alarminfonew===>${JSON.stringify(alarminfonew)}`);
  return alarminfonew;
}
exports.bridge_alarminfo = bridge_alarminfo;
exports.bridge_alarmrawinfo = bridge_alarmrawinfo;
// bridge_alarminfo({"_id":"5a1bfa0f86ce24f6ce62f6d2","CurDay":"2017-11-18","DeviceId":"1702100387","__v":0,"F[214]":6,"DataTime":"2017-11-18 10:04:47","warninglevel":"","Longitude":121.177748,"Latitude":31.442289});
// console.log(`mapdict==>${JSON.stringify(config.mapdict)}`);
// config.mapdict = _.merge(config.mapdict,{'AL':1});
// console.log(`mapdict==>${JSON.stringify(config.mapdict)}`);
// config.mapdict = _.merge(config.mapdict,{'BL':1});
// console.log(`mapdict==>${JSON.stringify(config.mapdict)}`);

exports.exportalarm = (actiondata,ctx,callback)=>{
  console.log(`exportalarm==>${JSON.stringify(actiondata)}`);

  const realtimealarmModel = DBModels.RealtimeAlarmModel;
  let query = actiondata.query || {};
  getdevicesids(ctx.userid,({devicegroupIds,deviceIds})=>{
    if(!query.DeviceId){
      query.DeviceId = {'$in':deviceIds};
    }
    realtimealarmModel.find(query,(err,list)=>{
      if(!err){
        list = JSON.parse(JSON.stringify(list));
        let docs = [];
        _.map(list,(record)=>{
          let recordnew = bridge_alarminfo(record);
          recordnew = _.omit(recordnew,['key']);
          docs.push(recordnew);
        });
        list = docs;

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
  });
}


exports.queryrealtimealarm = (actiondata,ctx,callback)=>{
  const realtimealarmModel = DBModels.RealtimeAlarmModel;
  let query = actiondata.query || {};
  getdevicesids(ctx.userid,({devicegroupIds,deviceIds})=>{
    if(!query.DeviceId){
      query.DeviceId = {'$in':deviceIds};
    }
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
  });
}

//app中的报警分页
exports.ui_searchalarm =  (actiondata,ctx,callback)=>{
  // PC端获取数据--->{"cmd":"searchbatteryalarm","data":{"query":{"queryalarm":{"warninglevel":0}}}}
  const realtimealarmModel = DBModels.RealtimeAlarmModel;
  let query = actiondata.query || {};
  getdevicesids(ctx.userid,({devicegroupIds,deviceIds})=>{
    if(!query.DeviceId){
      query.DeviceId = {'$in':deviceIds};
    }
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
  });
}

exports.uireport_searchalarm =  (actiondata,ctx,callback)=>{
  // "key" : "",
  // "车辆ID" : "",
  // "报警时间" : "",
  // "报警等级" : "",
  // "报警信息" : "绝缘故障",
  // PC端获取数据--->{"cmd":"searchbatteryalarm","data":{"query":{"queryalarm":{"warninglevel":0}}}}
  const realtimealarmModel = DBModels.RealtimeAlarmModel;
  let query = actiondata.query || {};
  getdevicesids(ctx.userid,({devicegroupIds,deviceIds})=>{
    if(!query.DeviceId){
      query.DeviceId = {'$in':deviceIds};
    }
    realtimealarmModel.paginate(query,actiondata.options,(err,result)=>{
      if(!err){
        result = JSON.parse(JSON.stringify(result));
        let docs = [];
        _.map(result.docs,(record)=>{
          docs.push(bridge_alarminfo(record));
        });
        result.docs = docs;
        callback({
          cmd:'uireport_searchalarm_result',
          payload:{result}
        });
      }
      else{
        callback({
          cmd:'common_err',
          payload:{errmsg:err.message,type:'uireport_searchalarm'}
        });
      }
    });
  });
}
//
// exports.searchbatteryalarm =  (actiondata,ctx,callback)=>{
//   // PC端获取数据--->{"cmd":"searchbatteryalarm","data":{"query":{"queryalarm":{"warninglevel":0}}}}
//   const realtimealarmModel = DBModels.RealtimeAlarmModel;
//   let query = actiondata.query || {};
//   if(!!query.queryalarm){
//     query = query.queryalarm;
//   }
//   console.log(`查询条件:${JSON.stringify(query)}`);
//   realtimealarmModel.find(query,(err,list)=>{
//   //realtimealarmModel.aggregate({$sample: {size: 15}}).exec((err,list)=>{
//     if(!err){
//       callback({
//         cmd:'searchbatteryalarm_result',
//         payload:{list}
//       });
//     }
//     else{
//       callback({
//         cmd:'common_err',
//         payload:{errmsg:err.message,type:'searchbatteryalarm'}
//       });
//     }
//   });
// }
//
// exports.searchbatteryalarmsingle =  (actiondata,ctx,callback)=>{
//   const realtimealarmModel = DBModels.RealtimeAlarmModel;
//   let query = actiondata.query || {};
//   if(!!query.queryalarm){
//     query = query.queryalarm;
//   }
//   realtimealarmModel.find(query,(err,list)=>{
//     if(!err){
//       callback({
//         cmd:'searchbatteryalarmsingle_result',
//         payload:{list}
//       });
//     }
//     else{
//       callback({
//         cmd:'common_err',
//         payload:{errmsg:err.message,type:'searchbatteryalarmsingle'}
//       });
//     }
//   });
// }

//app中的报警分页
exports.uireport_searchalarmdetail =  (actiondata,ctx,callback)=>{
  // PC端获取数据--->{"cmd":"searchbatteryalarm","data":{"query":{"queryalarm":{"warninglevel":0}}}}
  console.log(`ui_searchalarmdetail===>${JSON.stringify(actiondata)}`);
  const realtimealarmrawModel = DBModels.RealtimeAlarmRawModel;
  let query = actiondata.query || {};
  getdevicesids(ctx.userid,({devicegroupIds,deviceIds})=>{
    if(!query.DeviceId){
      query.DeviceId = {'$in':deviceIds};
    }
    realtimealarmrawModel.paginate(query,actiondata.options,(err,result)=>{
      if(!err){
        result = JSON.parse(JSON.stringify(result));
        let docs = [];
        _.map(result.docs,(record)=>{
          docs.push(bridge_alarmrawinfo(record));
        });
        result.docs = docs;
        callback({
          cmd:'uireport_searchalarmdetail_result',
          payload:{result}
        });
      }
      else{
        callback({
          cmd:'common_err',
          payload:{errmsg:err.message,type:'uireport_searchalarmdetail'}
        });
      }
    });
  });
}

exports.exportalarmdetail = (actiondata,ctx,callback)=>{
  console.log(`exportalarmdetail==>${JSON.stringify(actiondata)}`);

  const realtimealarmrawModel = DBModels.RealtimeAlarmRawModel;
  let query = actiondata.query || {};
  getdevicesids(ctx.userid,({devicegroupIds,deviceIds})=>{
    if(!query.DeviceId){
      query.DeviceId = {'$in':deviceIds};
    }
    realtimealarmrawModel.find(query,(err,list)=>{
      if(!err){
        list = JSON.parse(JSON.stringify(list));
        let docs = [];
        _.map(list,(record)=>{
          let recordnew = bridge_alarmrawinfo(record);
          recordnew = _.omit(recordnew,['key']);
          docs.push(recordnew);
        });
        list = docs;
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
  });
}

//<<=============报警推送===============================
exports.serverpush_alarm_sz = (actiondata,ctx,callback)=>{
  const realtimealarmModel = DBModels.RealtimeAlarmModel;
  let query = {
    CurDay:moment().format('YYYY-MM-DD')
  };
  getdevicesids(ctx.userid,({devicegroupIds,deviceIds})=>{
    if(!query.DeviceId){
      query.DeviceId = {'$in':deviceIds};
    }
    realtimealarmModel.find(query,null,{
      skip: 0,
      limit: 10,
      sort:{ "DataTime":-1}
    },(err,list)=>{
      if(!err){
        list = JSON.parse(JSON.stringify(list));
        let docs = [];
        _.map(list,(record)=>{
          let recordnew = bridge_alarminfo(record);
          recordnew = _.omit(recordnew,['key']);
          docs.push(recordnew);
        });
        list = docs;
        callback({
          cmd:'serverpush_alarm_sz_result',
          payload:{list}
        });
      }
      else{
        callback({
          cmd:'common_err',
          payload:{errmsg:err.message,type:'serverpush_alarm_sz'}
        });
      }
    });
  });
}
