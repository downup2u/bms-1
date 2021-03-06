const dbhandler = require('./dbhandler.js');

const topichandler = {
  'BMS.Data':dbhandler.insertdatatodb,
};

module.exports = (msg,cb)=>{
  try{
    if(!!topichandler[msg.topic]){
      let payload = msg.value;
      if(typeof payload === 'string'){
        try{
          payload = JSON.parse(payload);
        }
        catch(e){
          console.log(`parse json eror ${JSON.stringify(e)}`);
        }
      }
      topichandler[msg.topic](payload,(err,result)=>{
        console.log("服务端回复--->" + JSON.stringify(result));
        cb(err,result);
      });
    }
  }
  catch(e){
    console.log("服务端内部错误--->" + e);
  }
}
