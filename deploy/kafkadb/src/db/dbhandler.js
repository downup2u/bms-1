const mongoose  = require('mongoose');
const async = require('async');
const DBModels = require('./models.js');
const _ = require('lodash');
const alarmplugin = require('../plugins/alarmfilter/index');
const moment = require('moment');
const getalarmtxt = require('./getalarmtxt');

const save_device = (devicedata,callbackfn)=>{
  console.log(`start save device...${!!DBModels.DeviceModel}`);
  const dbModel = DBModels.DeviceModel;
  dbModel.findOneAndUpdate({DeviceId:devicedata.DeviceId},{$set:devicedata},{
    upsert:true,new:true
  },(err,result)=>{
    // console.log(`device error:${JSON.stringify(err)}`);
    callbackfn(err,result);
  });
};

const save_alarm = (devicedata,callbackfn)=>{
  const LastRealtimeAlarm = _.get(devicedata,'LastRealtimeAlarm');
  const LastHistoryTrack = _.get(devicedata,'LastHistoryTrack');
  if(!!LastRealtimeAlarm){//含有历史设备数据
    LastRealtimeAlarm.DeviceId = devicedata.DeviceId;
    alarmplugin.dofilter(devicedata.DeviceId,LastRealtimeAlarm,(err,result_alarm)=>{
      console.log(`result_alarm==>${JSON.stringify(result_alarm)}`);
      if(!err && !!result_alarm){
        //含有报警信息
        let updated_data = {
          $inc: result_alarm.inc_data,
          CurDay:result_alarm.CurDay,
          DeviceId:result_alarm.DeviceId,
          DataTime:LastRealtimeAlarm.DataTime,
          warninglevel:result_alarm.warninglevel
        };
        if(!!LastHistoryTrack){
          updated_data.Longitude = LastHistoryTrack.Longitude;
          updated_data.Latitude = LastHistoryTrack.Latitude;
        }
        const dbRealtimeAlarmModel =  DBModels.RealtimeAlarmModel;
        dbRealtimeAlarmModel.findOneAndUpdate(
          {DeviceId:result_alarm.DeviceId,CurDay:result_alarm.CurDay},
          updated_data,
          {upsert:true,new: true},
          (err, result)=> {
            callbackfn(err,result);
          });
        return;
      }
      callbackfn();
    });
    return;
  }
  callbackfn();
}

const save_alarmraw = (devicedata,callbackfn)=>{
  let  result_alarm_raw = _.get(devicedata,'LastRealtimeAlarm.Alarm');
  if(!!result_alarm_raw){
    //含有报警信息
    result_alarm_raw.DeviceId = devicedata.DeviceId;
    result_alarm_raw.DataTime = devicedata.LastRealtimeAlarm.DataTime;

    if(!!devicedata.LastHistoryTrack){
      result_alarm_raw.Longitude = devicedata.LastHistoryTrack.Longitude;
      result_alarm_raw.Latitude = devicedata.LastHistoryTrack.Latitude;
    }

    const entity = new DBModels.RealtimeAlarmRawModel(result_alarm_raw);
    entity.save((err,result)=>{
      callbackfn(err,result);
    });
    return;
  }
  callbackfn();
};

const save_historydevice = (devicedata,alarmtxt,callbackfn)=>{
  //保存到历史记录中
  const LastRealtimeAlarm = _.get(devicedata,'LastRealtimeAlarm');
  if(!!LastRealtimeAlarm){
    let result_device = _.clone(LastRealtimeAlarm);
    result_device = _.omit(result_device,['Alarm']);
    if(!!alarmtxt && alarmtxt!==''){
      result_device.alarmtxt = alarmtxt;
    }
    const entity2 = new DBModels.HistoryDeviceModel(result_device);
    entity2.save((err,result)=>{
      callbackfn(err,result);
    });

    return;
  }
  callbackfn();
}

const save_lasthistorytrack = (devicedata,callbackfn)=>{
  const LastHistoryTrack = devicedata.LastHistoryTrack;
  if(!!LastHistoryTrack){
    LastHistoryTrack.DeviceId = devicedata.DeviceId;
    const entity = new DBModels.HistoryTrackModel(LastHistoryTrack);
    entity.save((err,result)=>{
      callbackfn(err,result);
    });
    return;
  }
  callbackfn();
}

exports.insertdatatodb= (data,callback)=>{

  const LastRealtimeAlarm = _.clone(data.BMSData);
  const LastHistoryTrack = _.clone(data.Position);

  const devicedata = _.omit(data,['BMSData','Position']);
  if(!!LastRealtimeAlarm){
    devicedata.LastRealtimeAlarm = LastRealtimeAlarm;
  }
  if(!!LastHistoryTrack){
    devicedata.LastHistoryTrack = LastHistoryTrack;
  }
  devicedata.UpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');
  let asyncfnsz = [
    (callbackfn)=>{
      save_device(devicedata,callbackfn);
    },
    (callbackfn)=>{
      save_alarm(devicedata,callbackfn);
    },
    (callbackfn)=>{
      save_alarmraw(devicedata,callbackfn);
    },
    (callbackfn)=>{
      save_lasthistorytrack(devicedata,callbackfn);
    },
  ];
  async.parallel(asyncfnsz,(err,result)=>{
    let alarmtxt;
    if(!err && !!result){
      const alarm = result[1].toJSON();
      alarmtxt = getalarmtxt(alarm);
    }
    save_historydevice(devicedata,alarmtxt,(err,result)=>{

    });
  });

};
