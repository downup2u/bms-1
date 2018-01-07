const mongoose     = require('mongoose');
const _ = require('lodash');
const getdevicesids = require('../../handler/getdevicesids');

const getquery = (userid,collectionname,query,callbackfn)=>{
  if( collectionname === 'device' ||
      collectionname === 'devicegroup'||
      collectionname === 'realtimealarm'||
      collectionname === 'realtimealarmraw'||
      collectionname === 'historytrack'
    ){
      getdevicesids(userid,({adminflag,devicegroupIds,deviceIds})=>{
        if(adminflag === 0){
          if(collectionname === 'devicegroup'){
            if(!query._id){
              query._id = {'$in':devicegroupIds};
            }
          }
          else{
            if(!query.DeviceId){
              query.DeviceId = {'$in':deviceIds};
            }
          }
        }
        callbackfn(query);
        console.log(`newquery===>${JSON.stringify(query)}`);
      });
    }
    else{
      callbackfn(query);
    }

};

module.exports= getquery;
