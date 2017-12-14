import { put,call,takeLatest,fork,take,race} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {
  common_err,

  md_login_result,
  login_result,

  set_weui,

  querydevicegroup_request,
  querydevicegroup_result,

  querydevice_request,
  querydevice_result,

  md_querydeviceinfo_result,
  querydeviceinfo_result,

  serverpush_devicegeo_sz_request,
  serverpush_devicegeo_sz_result,
  serverpush_devicegeo_sz,

  start_serverpush_devicegeo_sz,
  stop_serverpush_devicegeo_sz,

  getcurallalarm_request,
  getallworkorder_request,

  setworkorderdone_request,
  setworkorderdone_result,

  getworkusers_request,

  changepwd_result,

  gettipcount_request,

  start_serverpush_alarm_sz,
  stop_serverpush_alarm_sz,
  serverpush_alarm_sz_request,
  serverpush_alarm_sz_result,

} from '../actions';
import { goBack } from 'react-router-redux';//https://github.com/reactjs/react-router-redux
import map from 'lodash.map';
import coordtransform from 'coordtransform';
import {getgeodata} from '../sagas/mapmain_getgeodata';
import {g_devicesdb} from './mapmain';
import config from '../env/config.js';
// import  {
//   getrandom
// } from '../test/bmsdata.js';

export function* wsrecvsagaflow() {
  yield takeLatest(`${setworkorderdone_request}`, function*(action) {
      yield take(`${setworkorderdone_result}`);
      yield put(goBack());
  });

  //链接远程数据,暂时注释
  // yield takeLatest(`${querydevice_result}`, function*(action) {
  //   yield put(start_serverpush_devicegeo_sz({}));
  // });

  yield takeLatest(`${changepwd_result}`, function*(action) {
    yield put(set_weui({
      toast:{
        text:'修改密码成功',
        show: true,
        type:'success'
    }}));
    yield put(goBack());
  });

  yield takeLatest(`${start_serverpush_devicegeo_sz}`, function*(action) {
      yield fork(function*(){
        try{
        while(true){
          const { resstop, timeout } = yield race({
             resstop: take(`${stop_serverpush_devicegeo_sz}`),
             timeout: call(delay,5000)
          });
          if(!!resstop){
            break;
          }
          //
          // console.log(`开始获取变化数据...`)
          yield put(serverpush_devicegeo_sz_request({}));
          yield race({
            resstop: take(`${serverpush_devicegeo_sz_result}`),
            timeout: call(delay, 10000)
         });
        }
        }
        catch(e){
          console.log(e);
        }
      });

  });

  yield takeLatest(`${start_serverpush_alarm_sz}`, function*(action) {
      yield fork(function*(){
        try{
          while(true){
            const { resstop, timeout } = yield race({
               resstop: take(`${stop_serverpush_alarm_sz}`),
               timeout: call(delay,5000)
            });
            if(!!resstop){
              break;
            }
            //
            // console.log(`开始获取变化数据...`)
            yield put(serverpush_alarm_sz_request({}));
            yield race({
              resstop: take(`${serverpush_alarm_sz_result}`),
              timeout: call(delay, 10000)
           });
          }
        }
        catch(e){
          console.log(e);
        }
      });

  });

  yield takeLatest(`${serverpush_devicegeo_sz_result}`, function*(action) {
      let {payload:result} = action;
      yield put(serverpush_devicegeo_sz(result));
  });

  yield takeLatest(`${md_login_result}`, function*(action) {
      try{
        let {payload:result} = action;
        console.log(`md_login_result==>${JSON.stringify(result)}`);
        if(!!result){
          yield put(login_result(result));
          if(result.loginsuccess){
              localStorage.setItem(`bms_${config.softmode}_token`,result.token);
              if(config.softmode === 'pc'){
                yield put(gettipcount_request({}));//获取个数
              }
              yield put(querydevicegroup_request({}));

              if(config.ispopalarm){
                yield put(start_serverpush_alarm_sz({}));
              }
            //
              // yield put(getworkusers_request({}));
              // //登录成功,获取今天所有报警信息列表
              // yield put(getcurallalarm_request({}));
              // //获取所有工单
              // yield put(getallworkorder_request({}));

          }
        }

      }
      catch(e){
        console.log(e);
      }

  });


  yield takeLatest(`${common_err}`, function*(action) {
        let {payload:result} = action;

        yield put(set_weui({
          toast:{
          text:result.errmsg,
          show: true,
          type:'warning'
        }}));
  });

  yield takeLatest(`${querydevicegroup_result}`, function*(action) {
    try{
      const {payload:{list}} = action;
      //获取到分组列表
      let groupids = [];
      map(list,(group)=>{
        groupids.push(group._id);
      });
      yield put(querydevice_request({query:{}}));
    }
    catch(e){
      console.log(e);
    }

  });

  yield takeLatest(`${md_querydeviceinfo_result}`, function*(action) {
    let {payload:deviceinfo} = action;
    console.log(`deviceinfo==>${JSON.stringify(deviceinfo)}`);
    try{
        if(!!deviceinfo){
          let isget = true;
          const LastHistoryTrack = deviceinfo.LastHistoryTrack;
          if (!LastHistoryTrack) {
              isget = false;
          }
          else{
            if(LastHistoryTrack.Latitude === 0 || LastHistoryTrack.Longitude === 0){
              isget = false;
            }
          }
          if(isget){
            let cor = [LastHistoryTrack.Longitude,LastHistoryTrack.Latitude];
            const wgs84togcj02=coordtransform.wgs84togcj02(cor[0],cor[1]);
            deviceinfo.locz = wgs84togcj02;
          }

          if(!!deviceinfo.locz){
            const addr = yield call(getgeodata,deviceinfo);
            deviceinfo = {...deviceinfo,...addr};
          }
        }
         g_devicesdb[deviceinfo.DeviceId] = deviceinfo;
         yield put(querydeviceinfo_result(deviceinfo));
       }
       catch(e){
         console.log(e);
       }

  });

}
