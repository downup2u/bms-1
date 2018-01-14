'use strict';
const excelToJson = require('convert-excel-to-json');
const _ = require('lodash');
const config = require('../config');
let mongoose     = require('mongoose');
let DBModels = require('../db/models.js');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodburl,{
    useMongoClient: true,
    // This options is 1 second by default, its possible the ha
    // takes longer than 30 seconds to recover.
    reconnectInterval: 5000,
    // This options is 30 by default, why not make it 60
    reconnectTries: Number.MAX_VALUE
  },(err)=>{
    if(!!err){
      //console.log(`mongodb connect${JSON.stringify(err)}`);
    }
    //console.log(`mongodb connect`);
  });

const result = excelToJson({
    sourceFile: './LAST.xls',
    columnToKey: {
        '*': '{{columnHeader}}'
    },
});

mongoose.connection.once('open', ()=> {
    //console.log(`MongoDB event open`);
    //console.log(`MongoDB connected ${config.mongodburl}`);

    //mongoose.connection.on('connected', ()=> {
      //console.log('MongoDB connected');

      const BAT_Last = result['BAT_Last'];
      const TLast = result['TLast'];

      _.map(BAT_Last,(batlast)=>{
        let createddata = {
            DeviceId:batlast.DeviceId,
            LastRealtimeAlarm:batlast
          };
          let dbModel = DBModels.DeviceModel;
          dbModel.findOneAndUpdate({DeviceId:batlast.DeviceId},{$set:createddata},{
            upsert:true,new:true
          },(err,result)=>{
            //console.log(`create device batlast,err:${err},${JSON.stringify(result)}`);
            if(!err && !!result){
            }
          });
      });

      _.map(TLast,(tlast)=>{
        let createddata = {
            DeviceId:tlast.DeviceId,
            LastHistoryTrack:tlast
          };
          let dbModel = DBModels.DeviceModel;
          dbModel.findOneAndUpdate({DeviceId:tlast.DeviceId},{$set:createddata},{
            upsert:true,new:true
          },(err,result)=>{
            //console.log(`create device tlast,err:${err},${JSON.stringify(result)}`);
            if(!err && !!result){
            }
          });
      });
    //});
  });
