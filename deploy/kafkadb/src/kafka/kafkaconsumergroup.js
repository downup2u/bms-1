const async = require('async');
const ConsumerGroup = require('kafka-node').ConsumerGroup;
const uuid = require('uuid');
const cid = uuid.v4();

const startsrv = (config,onMessage,onError)=>{
  const consumerOptions = config.consumerOptions;
  const topics = config.consumertopics;
  const consumerGroup = new ConsumerGroup(Object.assign({id: cid}, consumerOptions), topics);
  consumerGroup.on('error', onError);
  consumerGroup.on('message', onMessage);
  console.log(`wait for message!`);
  process.once('SIGINT', ()=> {
    async.each([consumerGroup],  (consumer, callback)=> {
      consumer.close(true, callback);
    });
  });
}

module.exports = startsrv;
