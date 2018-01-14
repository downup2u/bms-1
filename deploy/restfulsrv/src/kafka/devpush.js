const async = require('async');
const ConsumerGroup = require('kafka-node').ConsumerGroup;
const uuid = require('uuid');
const cid = uuid.v4();
const PubSub = require('pubsub-js');

function onMessage (message) {
  console.log(`获取来自kafka设备消息:${JSON.stringify(message)}`);
  PubSub.publish(`push.device.${message.DeviceId}`, message);
}

const onError =(error)=> {
  console.error(error);
  console.error(error.stack);
}

const start_kafkaconsumergroup = (config)=>{

  const consumerOptions = config.consumerOptions;
  const topics = ['push.device'];
  const consumerGroup = new ConsumerGroup(Object.assign({id: cid}, consumerOptions), topics);
  consumerGroup.on('error', onError);
  consumerGroup.on('message', onMessage);

  process.once('SIGINT', ()=> {
    async.each([consumerGroup],  (consumer, callback)=> {
      consumer.close(true, callback);
    });
  });
}

module.exports == start_kafkaconsumergroup;
