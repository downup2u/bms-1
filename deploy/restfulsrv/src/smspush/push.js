const JPush = require('jpush-sdk');
const config = require('../config.js');

const client = JPush.buildClient(config.jpush_appkey, config.jpush_mastersecret);

// _id
// messagetype:String,//msg
// touserid:String,
// messagetitle:String,
// messagecontent:String,

let sendallmsg = (notifymessage,fncallback)=>{
  client.push().setPlatform('ios', 'android')
    .setAudience(JPush.ALL)
    .setNotification(notifymessage.messagetitle,
        JPush.ios(notifymessage.messagetitle, 'happy', 1,false,{_id:notifymessage._id,messagetype:notifymessage.messagetype}),
        JPush.android(notifymessage.messagetitle, null, 1,{_id:notifymessage._id,messagetype:notifymessage.messagetype})
    )
    .setMessage(notifymessage.messagecontent)
    .send( (err, res)=> {
      if (err) {
        if (err instanceof JPush.APIConnectionError) {
          //console.log(err.message)
        } else if (err instanceof JPush.APIRequestError) {
          //console.log(err.message)
        }
      } else {
        //console.log('Sendno: ' + res.sendno)
        //console.log('Msg_id: ' + res.msg_id)
      }
      fncallback(err,res);
    });
}


//useralias 用逗号分隔
let sendusermsg = (notifymessage,fncallback)=>{
  client.push().setPlatform('ios', 'android')
    .setAudience(JPush.alias(notifymessage.touserid))
    .setNotification(notifymessage.messagetitle,
        JPush.ios(notifymessage.messagetitle, 'happy', 1,false,{_id:notifymessage._id,messagetype:notifymessage.messagetype}),
        JPush.android(notifymessage.messagetitle, null, 1,{_id:notifymessage._id,messagetype:notifymessage.messagetype})
    )
    .setMessage(notifymessage.messagecontent)
    .setOptions(null, 60)
    .send((err, res)=> {
      if (err) {
        if (err instanceof JPush.APIConnectionError) {
          //console.log(err.message)
          // Response Timeout means your request to the server may have already received,
          // please check whether or not to push
          //console.log(err.isResponseTimeout)
        } else if (err instanceof JPush.APIRequestError) {
          //console.log(err.message)
        }
      } else {
        //console.log('Sendno: ' + res.sendno)
        //console.log('Msg_id: ' + res.msg_id)
      }
      fncallback(err,res);
    })
}

let sendnotifymessage =  (notifymessage,fn)=>{
    if(!!notifymessage.touserid){
        sendusermsg(notifymessage,fn);
    }
    else{
        sendallmsg(notifymessage,fn);
    }
}

exports.sendnotifymessage = sendnotifymessage;

// let notifymessage =
// {
//     _id:'5902fdb605647e59a3714f80',
//     touserid:'58e455e7f6de2471258b292d',
//     messagetitle:'标题',
//     messagecontent:'内容'
// };
//
// sendallmsg(notifymessage,(err,result)=>{
//     //console.log(`err:${JSON.stringify(err)}`)
//     //console.log(`result:${JSON.stringify(result)}`)
// });
