const dbh = require('../db/index.js');

function onMessage (message) {
  console.log(`获取到消息:${JSON.stringify(message)}`);
  dbh(message,(err,result)=>{

  });
}


exports.onMessage = onMessage;
