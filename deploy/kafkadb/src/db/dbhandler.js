const mongoose  = require('mongoose');
// const DBModels = require('../../../restfulsrv/src/db/models.js');
const DBModels = require('./models.js');
const _ = require('lodash');
const alarmplugin = require('../plugins/alarmfilter/index');
const moment = require('moment');

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
  // console.log(`insertdatatodb LastRealtimeAlarm===>${JSON.stringify(LastRealtimeAlarm)}`);
  // console.log(`insertdatatodb LastHistoryTrack===>${JSON.stringify(LastHistoryTrack)}`);
  // console.log(`insertdatatodb devicedata===>${JSON.stringify(devicedata)}`);

  console.log('\n');

  console.log(`start save device...${!!DBModels.DeviceModel}`);
  const dbModel = DBModels.DeviceModel;
  dbModel.findOneAndUpdate({DeviceId:devicedata.DeviceId},{$set:devicedata},{
    upsert:true,new:true
  },(err,result)=>{
    console.log(`device error:${JSON.stringify(err)}`);
  });

  console.log(`start save LastRealtimeAlarm...${!!LastRealtimeAlarm}`);
  if(!!LastRealtimeAlarm){
    LastRealtimeAlarm.DeviceId = devicedata.DeviceId;
    alarmplugin.dofilter(devicedata.DeviceId,LastRealtimeAlarm,(err,result_alarm)=>{
      console.log(`result_alarm==>${JSON.stringify(result_alarm)}`);
      if(!err){
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
        dbRealtimeAlarmModel.findOneAndUpdate({DeviceId:result_alarm.DeviceId,CurDay:result_alarm.CurDay},
          updated_data,
          {upsert:true,new: true},(err, result)=> {
            console.log(`LastRealtimeAlarm error:${JSON.stringify(err)}`);
          });

          let  result_alarm_raw = LastRealtimeAlarm.Alarm;
          result_alarm_raw.DeviceId = result_alarm.DeviceId;
          result_alarm_raw.DataTime = LastRealtimeAlarm.DataTime;

          if(!!LastHistoryTrack){
            result_alarm_raw.Longitude = LastHistoryTrack.Longitude;
            result_alarm_raw.Latitude = LastHistoryTrack.Latitude;
          }

          const entity = new DBModels.RealtimeAlarmRawModel(result_alarm_raw);
          entity.save((err,result)=>{
            console.log(`LastRealtimeAlarm error:${JSON.stringify(err)}`);
          });
      }
    });

  }

  console.log(`start save LastHistoryTrack...${!!LastHistoryTrack}`);
  if(!!LastHistoryTrack){
    LastHistoryTrack.DeviceId = devicedata.DeviceId;
    const dbHistoryTrackModel =  DBModels.HistoryTrackModel;
    const entity = new dbHistoryTrackModel(LastHistoryTrack);
    entity.save((err,result)=>{
      console.log(`LastHistoryTrack error:${JSON.stringify(err)}`);
    });
  }

};
