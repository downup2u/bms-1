const mongoose  = require('mongoose');
// const DBModels = require('../../../restfulsrv/src/db/models.js');
const DBModels = require('./models.js');
const _ = require('lodash');
exports.insertdatatodb= (data,callback)=>{

  // const userModel = DBModels.UserAdminModel;// mongoose.model('UserAdmin', DBModels.UserAdminSchema);//DBModels.UserAdminModel;
  // userModel.findOne({username: 'admin'}, (err, adminuser)=> {
  //   console.log(`find UserAdmin...`);
  //   console.log(`useradmin:${JSON.stringify(err)}`);
  // });

  const LastRealtimeAlarm = _.clone(data.BMSData);
  const LastHistoryTrack = _.clone(data.Position);

  const devicedata = _.omit(data,['BMSData','Position']);

  if(!!LastRealtimeAlarm){
    devicedata.LastRealtimeAlarm = LastRealtimeAlarm;
  }

  if(!!LastHistoryTrack){
    devicedata.LastHistoryTrack = LastHistoryTrack;
  }

  console.log(`insertdatatodb LastRealtimeAlarm===>${JSON.stringify(LastRealtimeAlarm)}`);
  console.log(`insertdatatodb LastHistoryTrack===>${JSON.stringify(LastHistoryTrack)}`);
  console.log(`insertdatatodb devicedata===>${JSON.stringify(devicedata)}`);

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
    const dbRealtimeAlarmModel =  DBModels.RealtimeAlarmModel;
    const entity = new dbRealtimeAlarmModel(LastRealtimeAlarm);
    entity.save((err,result)=>{
      console.log(`LastRealtimeAlarm error:${JSON.stringify(err)}`);
    });
  }

  console.log(`start save LastHistoryTrack...${!!LastHistoryTrack}`);
  if(!!LastHistoryTrack){
    const dbHistoryTrackModel =  DBModels.HistoryTrackModel;
    const entity = new dbHistoryTrackModel(LastHistoryTrack);
    entity.save((err,result)=>{
      console.log(`LastHistoryTrack error:${JSON.stringify(err)}`);
    });
  }

};
