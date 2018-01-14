const winston = require('../log/log.js');
const _ =  require('lodash');

/*

topic:push.device.DeviceId
{
  obj
  alarm
}
*/
const pushusermessage = (socket,ctx,DeviceId,data)=>{

}

const usersubfn  = (socket,ctx)=>{
  ctx.userDeviceSubscriber = ( msg, data )=>{
      winston.getlog().info('r-->用户订阅请求,用户信息:'+JSON.stringify(ctx));
      winston.getlog().info('r-->用户订阅消息:'+msg);
      winston.getlog().info('r-->用户订阅数据:'+data);

      let topicsz = msg.split('.');
      if(topicsz.length === 3){
        if(topicsz[0] === 'push' && topicsz[1] === 'device'){
            const DeviceId = topicsz[2];
            pushusermessage(socket,ctx,DeviceId,data);
        }
      }
  };//for eachuser
};


module.exports = usersubfn;
