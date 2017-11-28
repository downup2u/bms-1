import { createAction } from 'redux-act';
import { take,put, call,race,takeLatest,select } from 'redux-saga/effects';
import {delay} from 'redux-saga';
import paginate_array from 'paginate-array';
import lodashmap from 'lodash.map';

const synccallreq = createAction('synccallreq');
export const ui_searchdevice_request = createAction('ui_searchdevice_request');
export const ui_searchdevice_result = createAction('ui_searchdevice_result');
export const ui_searchalarm_request = createAction('ui_searchalarm_request');
export const ui_searchalarm_result = createAction('ui_searchalarm_result');

//以下导出放在视图
export function callthen(actionreq,actionres,payload){
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(synccallreq({actionreq,actionres,resolve,reject,...payload}));
    });
  }
}
//以下导出放在saga中
export function* createsagacallbackflow(){
  yield takeLatest(`${synccallreq}`,function*(action){
    const {payload:{actionreq,actionres,resolve,reject,...data}} = action;
    yield put(actionreq(data));//发送请求


    const { response, timeout } = yield race({
       response: take(actionres),
       timeout: call(delay, 5000)
    });
    if(!!timeout){
      reject('请求超时!');
    }
    else{
      let {payload:{err,result}} = response;
      if (!!err) {
        reject(err);
      }
      else{
        resolve({result});
      }
    }
  });

  yield takeLatest(`${ui_searchdevice_request}`,function*(action){
    try{
      const {payload} = action;
      console.log(`ui_searchdevice_request===>${JSON.stringify(payload)}`);
      const {g_devicesdb} = yield select((state)=>{
        return {g_devicesdb:state.device.g_devicesdb};
      });
      let deviceall = [];
      lodashmap(g_devicesdb,(deviceinfo)=>{
        deviceall.push(deviceinfo);
      });

      const {offset,limit} = payload.options;
      const pageNumber = offset/limit + 1;
      const numItemsPerPage = limit;
      const paginateCollection = paginate_array(deviceall,pageNumber,numItemsPerPage);
      console.log(paginateCollection);
      // {
      //     currentPage: 1,
      //     perPage: 10,
      //     total: 20,
      //     totalPages: 2,
      //     data: [...]
      // }

      // result.docs
      // result.total
      // result.limit - 10
      // result.offset - 20
      const result = {
        docs:paginateCollection.data,
        total:deviceall.length,
        offset:offset,
        limit
      };
      yield put(ui_searchdevice_result({result}));
    }
    catch(e){
      console.log(e);
    }

  });

}