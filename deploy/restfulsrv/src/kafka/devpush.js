const async = require('async');
const ConsumerGroup = require('kafka-node').ConsumerGroup;
const uuid = require('uuid');
const cid = uuid.v4();
const PubSub = require('pubsub-js');
const config = require('../config.js');
const smspush = require('../smspush/push');
const getuserpushdeviceid = require('./getuserpushdeviceid.js');
const realtimealarm = require('../handler/common/realtimealarm');
const _ = require('lodash');
const winston = require('../log/log.js');

function onMessage (message) {
  console.log(`获取来自kafka设备消息:${JSON.stringify(message)}`);
  try{
    const data = JSON.parse(message.value);
    const DeviceId = data.DeviceId;
    const payload = data;
    console.log(`重新publish出去:${DeviceId},数据:${payload}`);

    PubSub.publish(`${config.kafka_pushalaramtopic}.${DeviceId}`, payload);

    getuserpushdeviceid(DeviceId,(userlist)=>{
      console.log(`所有用户id:${JSON.stringify(userlist)}`);
      
      let recordnew = realtimealarm.bridge_alarminfo(payload);
      _.map(userlist,(userid)=>{
        // _id
        // messagetype:String,//all,app
        // touserid:String,
        // messagetitle:String,
        // messagecontent:String,
        //推送到app,调用接口|serverpush_alarm
        const messagenotify = {
          _id:recordnew.key,
          messagetype:'msg',
          touserid:userid,
          messagetitle:`车辆:${recordnew['车辆ID']}于${recordnew['报警时间']}报警,报警信息:${recordnew['报警信息']}`,
          messagecontent:`车辆:${recordnew['车辆ID']}于${recordnew['报警时间']}报警,报警信息:${recordnew['报警信息']}`
        };
        winston.getlog().info(`开始推送消息:${JSON.stringify(messagenotify)}`);
        smspush.sendnotifymessage(messagenotify,(err,result)=>{
          winston.getlog().info(`推送消息结束:${JSON.stringify(err)},result:${JSON.stringify(result)}`);
          console.log(err);
          console.log(result);
        });
      });
    });

  }
  catch(e){
    console.log(e);
  }
}

const onError =(error)=> {
  console.error(error);
  console.error(error.stack);
}

const start_kafkaconsumergroup = (config)=>{

  const consumerOptions = config.kafka_consumersettings;
  const topics = [config.kafka_pushalaramtopic];
  const consumerGroup = new ConsumerGroup(Object.assign({id: cid}, consumerOptions), topics);
  consumerGroup.on('error', onError);
  consumerGroup.on('message', onMessage);

  process.once('SIGINT', ()=> {
    async.each([consumerGroup],  (consumer, callback)=> {
      consumer.close(true, callback);
    });
  });
}

module.exports = start_kafkaconsumergroup;
