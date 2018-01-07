import {takeLatest,put,call} from 'redux-saga/effects';
import {
  download_excel
} from '../actions';
import restfulapi from './restfulapi';
// import FileSaver from 'file-saver';


//获取地理位置信息，封装为promise
export function* downloadexcel(){//仅执行一次
   yield takeLatest(`${download_excel}`, function*(action) {
      try{
        let {payload:{type,query}} = action;
        //console.log(`download_excel===>type:${JSON.stringify(type)},query:${JSON.stringify(query)}`);
        const result = yield call(restfulapi.getexcelfile,{type,query});
        // FileSaver.saveAs(blob, `${type}.xls`);
      }
      catch(e){
        console.log(e);
      }

    });

}
