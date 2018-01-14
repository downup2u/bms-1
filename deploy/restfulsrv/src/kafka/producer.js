const kafka = require('kafka-node');
const Producer = kafka.Producer;
const KeyedMessage = kafka.KeyedMessage;
const Client = kafka.Client;
const client = new Client(process.env.KAFKA_HOST ||'127.0.0.1:2181');
// const argv = require('optimist').argv;
const producer = new Producer(client, { requireAcks: 1 });
// const moment = require('moment');
const dbhandler = require('../db/dbhandler.js');


// let rate = 2000;
producer.on('ready',  ()=> {
  //console.log(`kafka producer get ready!!`);
});

producer.on('error',  (err)=> {
  //console.log('error', err);
});


exports.sendtokafka = (payload,callbackfn)=>{
  const payloads = [
      { topic: 'BMS.Data', messages: JSON.stringify(payload) },
  ];
  producer.send(payloads, (err, data)=> {
    if(!!callbackfn){
      if(!!err){//错误，直接插入数据库
        //console.log(`kafka err:${JSON.stringify(err)}`);
        dbhandler.insertdatatodb(payload,callbackfn);
      }
      else{
        callbackfn(err,data);
      }

    }
  });
}
