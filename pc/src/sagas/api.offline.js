import {takeLatest,take,takeEvery,put,fork,call,select} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {
  querydevicegroup_request,
  querydevicegroup_result,
  querydevice_request,
  querydevice_result,
  queryhistorytrack_request,
  queryhistorytrack_result,
  notify_socket_connected,
  login_request,
  md_login_result,
  getsystemconfig_request,
  getsystemconfig_result,

  searchbatteryalarm_request,
  searchbatteryalarm_result,
  searchbatteryalarmsingle_request,
  searchbatteryalarmsingle_result,
  searchbattery_request,
  searchbattery_result,

  querydeviceinfo_request,
  querydeviceinfo_result,
  md_querydeviceinfo_result,

  serverpush_devicegeo,
  serverpush_devicegeo_sz,
  serverpush_devicealarm,

  serverpush_devicegeo_sz_request,
  serverpush_devicegeo_sz_result,
  start_serverpush_devicegeo_sz,

  ui_changemodeview,

  getcurallalarm_request,
  getcurallalarm_result,

  logout_request,
  logout_result,

  getallworkorder_request,
  getallworkorder_result,

  queryworkorder_request,
  queryworkorder_result,

  setalarmreaded_request,
  setalarmreaded_result,

  setworkorderdone_request,
  setworkorderdone_result,

  createworkorder_request,
  createworkorder_result,

  getworkusers_request,
  getworkusers_result,

  ui_clickplayback
} from '../actions';
import  {
  jsondata_bms_chargingpile,
  jsondata_bms_track,
  jsondata_bms_mydevice,
  jsondata_bms_alarm,
  jsondata_bms_workorder,
  jsondata_bms_groups,
  jsondata_bms_workusers,
  getrandom
} from '../test/bmsdata.js';
import { push,goBack,go,replace } from 'react-router-redux';

import {getRandomLocation} from '../env/geo';
import {getRandomLocation_track} from './simulatetrack';
import coordtransform from 'coordtransform';
import {g_devicesdb} from './mapmain';
import map from 'lodash.map';
import get from 'lodash.get';
import filter from 'lodash.filter';
import find from 'lodash.find';
import sampleSize from 'lodash.samplesize';
import {getgeodata} from '../sagas/mapmain_getgeodata';
import restfulapi from './restfulapi';

//获取地理位置信息，封装为promise

import moment from 'moment';

const getresult_historytrack = (mstart,mend)=>{
  let list = [];
  list = filter(jsondata_bms_track,(item)=>{
    return (item.GPSTime >= mstart) && (item.GPSTime <= mend);
  });
  return list;
}

let list_historyplayback_sz = [
  getresult_historytrack('2017-07-31 09:30:00','2017-07-31 10:30:00'),
  getresult_historytrack('2017-07-31 13:00:00','2017-07-31 14:00:00'),
  getresult_historytrack('2017-07-31 14:00:00','2017-07-31 15:00:00'),
  getresult_historytrack('2017-07-31 15:00:00','2017-07-31 16:00:00'),
];



export function* apiflow(){//
  yield takeLatest(`${ui_clickplayback}`, function*(action) {
    try{
      const {payload} = action;
      const mode = yield select((state)=>{
        return state.app.modeview;
      });
      if(mode !== 'device'){
        yield put(ui_changemodeview('device'));
        yield take(`${querydevice_result}`);
      }
      //轨迹回放时,判断是否为
      yield put(push(`/historyplay/${payload}`));
   }
   catch(e){
     console.log(e);
   }
  });


  yield takeLatest(`${createworkorder_request}`, function*(action) {
    try{
      const {payload} = action;
      let indexalarm = jsondata_bms_workorder.length;
      payload.key = indexalarm + '';
      payload._id = payload.key;
      payload['工单号'] = payload.key;
      jsondata_bms_workorder.push(payload);
      yield put(createworkorder_result(payload));
   }
   catch(e){
     console.log(e);
   }
  });

  yield takeLatest(`${getworkusers_request}`, function*(action) {
    try{
      yield put(getworkusers_result({list:jsondata_bms_workusers}));
   }
   catch(e){
     console.log(e);
   }
  });

  yield takeLatest(`${setalarmreaded_request}`, function*(action) {
    try{
      const {payload} = action;
      let item;
      map(jsondata_bms_alarm,(alarm,index)=>{
        if(alarm._id === payload){
          item = {...alarm};
          item.isreaded = true;
          jsondata_bms_alarm[index] = item;
        };
      });

      if(!!item){
        yield put(setalarmreaded_result(item));
      }

   }
   catch(e){
     console.log(e);
   }
  });

  yield takeLatest(`${setworkorderdone_request}`, function*(action) {
    try{
      const {payload:{query,data}} = action;
      let item;
      map(jsondata_bms_workorder,(workorder)=>{
        if(workorder._id === query._id){
          workorder = {...workorder,...data};
          item = workorder;
        }
      });
      yield put(setworkorderdone_result(item));
   }
   catch(e){
     console.log(e);
   }
  });


  yield takeLatest(`${getallworkorder_request}`, function*(action) {
    try{
      yield put(getallworkorder_result({list:jsondata_bms_workorder}));
   }
   catch(e){
     console.log(e);
   }
  });

  yield takeLatest(`${queryworkorder_request}`, function*(action) {
    try{
      const {payload:{query}} = action;

      let list = [];

      let workusers = yield select((state)=>{
        return state.workorder.workusers;
      });
      let assignto = get(query,'queryalarm.assignto','');
      if(assignto !== ''){
        list = filter(jsondata_bms_workorder, (oneworkorder)=>{
          return workusers[assignto].name === oneworkorder['责任人'];
        });
      }
      else{
        list =  sampleSize(jsondata_bms_workorder, getrandom(0,jsondata_bms_workorder.length-1));
      }

      let startdatestring = get(query,'queryalarm.startDate','');
      let enddatestring = get(query,'queryalarm.endDate','');
      if(startdatestring !== '' && enddatestring !== ''){
        list = filter(list,(item)=>{
          let waringtime = item['createtime'];
          let match = (startdatestring <= waringtime) && (waringtime <= enddatestring);
          return match;
       });
      }
      //查询条件

      yield put(queryworkorder_result({list}));
   }
   catch(e){
     console.log(e);
   }
  });

  //========
  yield takeLatest(`${logout_request}`, function*(action) {
    try{
      yield put(logout_result({}));
   }
   catch(e){
     console.log(e);
   }
  });

  yield takeLatest(`${getcurallalarm_request}`, function*(action) {
    try{
      //获取今天所有报警信息列表

      // jsondata_bms_alarm
      yield put(getcurallalarm_result({list:jsondata_bms_alarm}));
   }
   catch(e){
     console.log(e);
   }
  });


  yield takeLatest(`${querydeviceinfo_request}`, function*(action) {
    try{
    const {payload:{query:{DeviceId}}} = action;
    let deviceinfo = g_devicesdb[DeviceId];
     yield put(md_querydeviceinfo_result(deviceinfo));
   }
   catch(e){
     console.log(e);
   }
  });

  yield takeLatest(`${getsystemconfig_request}`, function*(action) {
    try{
      yield put(getsystemconfig_result({}));

      yield call(delay,3000);
      yield put(login_request({
        username:'15961125167',
        password:'123456'
      }));
    }
    catch(e){
      console.log(e);
    }

  });

  yield takeLatest(`${login_request}`, function*(action) {
    try{
        const {payload} = action;
        const {username,password} = payload;
        if(password === '123456'){
          yield put(md_login_result({
            loginsuccess:true,
            username:username,
            token:'',
          }));
        }
        else{
          yield put(md_login_result({
            loginsuccess:false,
          }));
        }
      }
      catch(e){
        console.log(e);
      }
  });

  yield takeLatest(`${ui_changemodeview}`, function*(action) {
    try{
        let viewmode = action.payload;
        let jsondata_result_2;
        if(viewmode === 'device'){
          jsondata_result_2 = jsondata_bms_mydevice;
        }
        else{
          jsondata_result_2 = jsondata_bms_chargingpile;
        }

        yield put(querydevice_result({list:jsondata_result_2}));
      }
      catch(e){
        console.log(e);
      }
  });

  yield takeLatest(`${querydevice_request}`, function*(action) {
    try{
       yield put(querydevice_result({list:jsondata_bms_mydevice}));
     }
     catch(e){
       console.log(e);
     }
    //  yield put(start_serverpush_devicegeo_sz({}));
  });

  yield takeLatest(`${searchbattery_request}`, function*(action) {
    try{
        const {payload:{query}} = action;
        let {carcollections} = yield select((state)=>{
          let carcollections = state.device.carcollections;
          return {carcollections};
        });
        //收藏的设备
        const list = filter(jsondata_bms_mydevice, (itemdevice)=>{
          return !!find(carcollections,(item)=>{
            return item === itemdevice.DeviceId;
          });
        });
        yield put(searchbattery_result({list}));
      }
      catch(e){
        console.log(e);
      }
  });


  yield takeLatest(`${searchbatteryalarm_request}`, function*(action) {
    try{
      const {payload:{query}} = action;

      //console.log(`${JSON.stringify(query)}`);

      let list = [];
      if(!!query){
        let warninglevel = get(query,'queryalarm.warninglevel',-1);
        if(warninglevel !== -1){
          //报警等级
          list = filter(jsondata_bms_alarm,(item)=>{
            return item.warninglevel === warninglevel;
          });
        }
        else{
          //随机生成
            list = jsondata_bms_alarm;//sampleSize(jsondata_bms_alarm, getrandom(0,jsondata_bms_alarm.length));
        }

        let startdatestring = get(query,'queryalarm.startDate','');
        let enddatestring = get(query,'queryalarm.endDate','');
        if(startdatestring !== '' && enddatestring !== ''){
          list = filter(list,(item)=>{
            let waringtime = item['报警时间'];
            let match = (startdatestring <= waringtime) && (waringtime <= enddatestring);
            return match;
         });
        }

        //是否已读
        if(!!query.queryalarm){
          if(query.queryalarm.hasOwnProperty('isreaded')){
            list = filter(list,(item)=>{
              return item.isreaded === query.queryalarm.isreaded;
           });
          }
        }

      }
      else{
        //all
        list = jsondata_bms_alarm;
      }
      yield put(searchbatteryalarm_result({list}));

    }
    catch(e){
      console.log(e);
    }
  });

  yield takeLatest(`${searchbatteryalarmsingle_request}`, function*(action) {
    try{
        const {payload:{query}} = action;

        //console.log(`${JSON.stringify(query)}`);

        let list = [];
        if(!!query){
           list = filter(jsondata_bms_alarm,(item)=>{
            return item.DeviceId === query.DeviceId;
          });

          let warninglevel = get(query,'queryalarm.warninglevel',-1);
          if(warninglevel != -1){
            list = filter(list,(item)=>{
             return item.warninglevel === warninglevel;
           });
          }

          let startdatestring = get(query,'queryalarm.startDate','');
          let enddatestring = get(query,'queryalarm.endDate','');
          if(startdatestring !== '' && enddatestring !== ''){
            list = filter(list,(item)=>{
              let waringtime = item['报警时间'];
              let match = (startdatestring <= waringtime) && (waringtime <= enddatestring);
              return match;
           });
          }
          // //console.log(jsondata_bms_alarm);
          // //console.log(`query.DeviceId:${query.DeviceId},list:${JSON.stringify(list)}`);
        }

        yield put(searchbatteryalarmsingle_result({list}));
      }
      catch(e){
        console.log(e);
      }
  });



   yield takeLatest(`${querydevicegroup_request}`, function*(action) {
       try{
          yield put(querydevicegroup_result({list:jsondata_bms_groups}));
        }
        catch(e){
          console.log(e);
        }
   });

   yield fork(function*(){
     try{
         while(!window.amapmain){
           yield call(delay,500);
         }
         yield put(notify_socket_connected(true));
       }
       catch(e){
         console.log(e);
       }

   });

   yield takeLatest(`${queryhistorytrack_request}`, function*(action) {
     try{
        const {payload} = action;
        const {query} = payload;
        const {startDate,endDate} = query;

        const {list} = yield call(restfulapi.gethistorytrack,{query});
        yield put(queryhistorytrack_result({list}));
        // let mstart = moment(startDate).format('2017-07-31 HH:mm:ss');
        // let mend = moment(endDate).format('2017-07-31 HH:mm:ss');
        // let index = getrandom(0,list_historyplayback_sz.length -1);
        // let resultlist = list_historyplayback_sz[index];
        // //console.log(`resultlist:index:${index}:${JSON.stringify(resultlist.length)}`);
        // yield put(queryhistorytrack_result({list:resultlist}));
      }
      catch(e){
        console.log(e);
      }
   });

  //  模拟服务端推送消息
  yield takeLatest(`${serverpush_devicegeo_sz_request}`, function*(action) {
     try{
        let {modeview,carcollections,g_devicesdb} = yield select((state)=>{
          let carcollections = state.device.carcollections;
          let modeview = state.app.modeview;
          let g_devicesdb = state.device.g_devicesdb;
          return {modeview,carcollections,g_devicesdb};
        });
        if('device' === modeview){
            const {list} = yield call(restfulapi.getdevicegeo);

            // //console.log(`serverpush_devicegeo_sz_request===>${JSON.stringify(list)}`)
            // const list = sampleSize(jsondata_bms_mydevice, jsondata_bms_mydevice.length);
            let items = [];
            //本地坐标转换
            for(let i = 0;i < list.length; i++){
              let item = {...list[i]};
              // const wgs84togcj02=coordtransform.wgs84togcj02(item.LastHistoryTrack.Longitude,item.LastHistoryTrack.Latitude);
              // const locationsz = yield call(getRandomLocation_track,item.DeviceId,wgs84togcj02[1],wgs84togcj02[0]);
              // //坐标转换
              // const gcj02towgs84=coordtransform.gcj02towgs84(locationsz[0],locationsz[1]);
              // item.LastHistoryTrack.Longitude = gcj02towgs84[0];
              // item.LastHistoryTrack.Latitude = gcj02towgs84[1];
              // item.locz = locationsz;

              // item.groupid = jsondata_bms_groups[getrandom(0,jsondata_bms_groups.length-1)]._id;
              item = {...g_devicesdb[item.DeviceId],...item};
              items.push(item);
            };
            yield put(serverpush_devicegeo_sz_result({list:items}));
        }
      }
      catch(e){
        console.log(e);
      }
   });
}
