const map = require('lodash.map');
const _ = require('lodash');
const device = require('../handler/common/device.js');
const historytrack = require('../handler/common/historytrack');
const kafakautil = require('../kafka/producer');
const realtimealarm = require('../handler/common/realtimealarm.js');
const DBModels = require('../db/models.js');
const utilposition = require('../handler/common/util_position');
const middlewareauth = require('./middlewareauth.js');
const export_downloadexcel = require('./handler/export_downloadexcel.js');
const getexporttoken = require('./handler/getexporttoken.js');

const getpoint = (v)=>{
  return [v.Longitude,v.Latitude];
}


let startmodule = (app)=>{
  app.post('/api/getexporttoken',middlewareauth,getexporttoken);

  app.post('/api/report_position',(req,res)=>{
    // req,res,dbModel,fields,csvfields,fn_convert
    const dbModel = DBModels.HistoryTrackModel;
    const fields = 'DeviceId Latitude Longitude GPSTime';
    let sz = fields.split(' ');
    sz.push('Provice');
    sz.push('City');
    sz.push('Area');
    const csvfields = sz.join(',');
    const fn_convert = (doc,callbackfn)=>{
      utilposition.getpostion_frompos(getpoint(doc),(retobj)=>{
        const newdoc = _.merge(doc,retobj);
        callbackfn(newdoc);
      });
    };
    export_downloadexcel({req,res,dbModel,fields,csvfields,fn_convert});

  });
  app.post('/api/report_alarm',(req,res)=>{
    // req,res,dbModel,fields,csvfields,fn_convert
    const dbModel = DBModels.RealtimeAlarmModel;
    const fields = '车辆ID 报警时间 报警等级 报警信息';

    let sz = fields.split(' ');
    const csvfields = sz.join(',');
    const fn_convert = (doc,callbackfn)=>{
      const newdoc = realtimealarm.bridge_alarminfo(doc);
      callbackfn(newdoc);
    }
    export_downloadexcel({req,res,dbModel,fields,csvfields,fn_convert});
  });
  app.post('/api/report_alarmdetail',(req,res)=>{
    // req,res,dbModel,fields,csvfields,fn_convert
    const dbModel = DBModels.RealtimeAlarmRawModel;
    const fields = '车辆ID 报警时间 报警等级 报警信息';
    const sz = fields.split(' ');
    const csvfields = sz.join(',');
    const fn_convert = (doc,callbackfn)=>{
      const newdoc = realtimealarm.bridge_alarmrawinfo(doc);
      callbackfn(newdoc);
    }
    export_downloadexcel({req,res,dbModel,fields,csvfields,fn_convert});
  });
  app.post('/api/report_device',(req,res)=>{
    // req,res,dbModel,fields,csvfields,fn_convert
    const dbModel = DBModels.DeviceModel;
    const fields = '车辆ID 更新时间 设备类型 序列号';
    const sz = fields.split(' ');
    const csvfields = sz.join(',');
    const fn_convert = (doc,callbackfn)=>{
      const newdoc = device.bridge_deviceinfo(doc);
      callbackfn(newdoc);
    }
    export_downloadexcel({req,res,dbModel,fields,csvfields,fn_convert});
  });

  app.post('/m2mgw/setdata',(req,res)=>{
    //console.log(`setdata m2m data:${JSON.stringify(req.body)}`);
    const data = req.body;
    kafakautil.sendtokafka(data,(err,result)=>{
      res.status(200).json({result:result,err:err});
    });
  });
  //获取所有地理位置
  app.get('/api/getdevicegeo',(req,res)=>{
    device.querydevice({
      query:{},
      fields:{
        'DeviceId':1,
        'LastHistoryTrack':1,
        'imagetype':1,
        'TPData':1,
        'updated_at':1,
      }
    },{},(result)=>{
      if(result.cmd === 'querydevice_result'){
        res.status(200).json({list:result.payload.list});
      }
      else{
        res.status(200).json({list:[]});
      }
    });
  });

  //设置设备数据(地理位置\胎压）
  // app.post('/api/setdevicegeo',(req,res)=>{
  //     //console.log(`get data:${JSON.stringify(req.body)}`);
  //     const data = req.body;
  //     map(data,(item,index)=>{
  //       let Speed = item.Speed;
  //       let Course = item.Course;
  //       try{
  //         if(typeof item.Speed === 'string'){
  //           Speed = parseFloat(item.Speed);
  //         }
  //       }
  //       catch(e){
  //         Speed = 0;
  //       }
  //       try{
  //         if(typeof item.Course === 'string'){
  //           Course = parseFloat(item.Course);
  //         }
  //       }
  //       catch(e){
  //         Course = 0;
  //       }
  //       let item2 = {};
  //       item2.imagetype = '0';
  //       item2.DeviceId = item.deviceid;
  //       item2.LastHistoryTrack = {
  //         Latitude:parseFloat(item.Latitude),
  //         Longitude:parseFloat(item.Longitude),
  //         GPSStatus:item.GPSStatus,
  //         Speed: Speed,
  //         Course: Course,
  //       };
  //       item2.TPData = {
  //         "DataTime": item.DataTime,
  //         "TP1":item.TP1,
  //         "TP2":item.TP2,
  //         "TP3":item.TP3,
  //         "TP4":item.TP4,
  //         "TP5":item.TP5,
  //       }
  //       device.savedevice(item2,{},(err,result)=>{
  //
  //       });
  //     });
  //
  //     res.status(200).json({result:'OK'});
  // });

  //获取轨迹回放数据
  app.post('/api/gethistorytrack',middlewareauth,(req,res)=>{
    const actiondata = req.body;
    historytrack.queryhistorytrack(actiondata,{},(result)=>{
      if(result.cmd === 'queryhistorytrack_result'){
        res.status(200).json({list:result.payload.list});
      }
      else{
        res.status(200).json({list:[]});
      }
    });
  });




};

module.exports=  startmodule;
