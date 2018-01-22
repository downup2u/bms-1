import { createReducer } from 'redux-act';
import {
  searchbattery_request,
  searchbatteryalarm_request,
  searchbatteryalarmsingle_request,

  searchbattery_result,
  searchbatteryalarm_result,
  searchbatteryalarmsingle_result,

  ui_selcurdevice_result,
  getcurallalarm_result,

  ui_resetsearch,
  setalarmreaded_result,
  searchbatterylocal_result,
  logout_result
} from '../actions';
import map from 'lodash.map';
import {
  ui_searchalarm_result,
  uireport_searchalarm_result
} from '../sagas/pagination';

const initial = {
  searchresult:{
    curseldeviceid:undefined,
    curallalarm:[],
    searchresult_battery:[],
    searchresult_alaram:[],
    searchresult_alaramsingle:[],
    alarms:{}
  },
};

const searchresult = createReducer({
  [uireport_searchalarm_result]:(state,payload)=>{
    const {result} = payload;
    let alarms = {...state.alarms};
    if(!!result.docs){
      map(result.docs,(alaram)=>{
        alaram._id = alaram.key;
        alarms[alaram.key] = alaram; //<----特别注意：报表字段是key!
      });
    }
    return { ...state,alarms};
  },
  [ui_searchalarm_result]:(state,payload)=>{
    const {result} = payload;
    let alarms = {...state.alarms};
    if(!!result.docs){
      map(result.docs,(alaram)=>{
        alarms[alaram._id] = alaram;
      });
    }
    return { ...state,alarms};
  },
  [setalarmreaded_result]:(state,payload)=>{
    let item = payload;
    let alarms = {...state.alarms};
    alarms[item._id] = item;
    return { ...state, alarms};
  },
  [ui_resetsearch]:(state,payload)=>{
    let searchresult_alaram = [...state.curallalarm];
    return { ...state, searchresult_alaram};
  },
  [getcurallalarm_result]:(state,payload)=>{
      let curallalarm =[];
      let alarms = {...state.alarms};
      const {list} = payload;
      map(list,(alarm)=>{
        curallalarm.push(alarm._id);
        alarms[alarm._id] = alarm;
      });
      return {...state,alarms,curallalarm};
  },
  [ui_selcurdevice_result]:(state,payload)=>{
    const curseldeviceid = payload.DeviceId;
    let searchresult_alaramsingle = [];
    return { ...state, curseldeviceid,searchresult_alaramsingle};
  },
  [searchbatterylocal_result]: (state, payload) => {
    const searchresult_battery = [...payload.searchresult_deviceids];
    return { ...state, searchresult_battery};
  },
  [searchbattery_request]: (state, payload) => {
    const searchresult_battery = [];
    return { ...state, searchresult_battery};
  },
  [searchbatteryalarm_request]: (state, payload) => {
    let searchresult_alaram = [];
    return { ...state, searchresult_alaram};
  },
  [searchbatteryalarmsingle_request]: (state, payload) => {
    let searchresult_alaramsingle = [];
    return { ...state, searchresult_alaramsingle};
  },
  [searchbattery_result]: (state, payload) => {
    let searchresult_battery = [];
    const {list} = payload;
    map(list,(device)=>{
      searchresult_battery.push(device.DeviceId);
    });
    return { ...state, searchresult_battery};
  },
  [searchbatteryalarm_result]: (state, payload) => {
    const {list} = payload;
    let alarms = {...state.alarms};
    let searchresult_alaram = [];
    map(list,(alaram)=>{
      alarms[alaram._id] = alaram;
      searchresult_alaram.push(alaram._id);
    });
    return { ...state,alarms,searchresult_alaram};
  },
  [searchbatteryalarmsingle_result]: (state, payload) => {
    const {list} = payload;
    let alarms = {...state.alarms};
    let searchresult_alaramsingle = [];
    map(list,(alaram)=>{
      alarms[alaram._id] = alaram;
      searchresult_alaramsingle.push(alaram._id);
    });
    return { ...state,alarms, searchresult_alaramsingle};
  },
  [logout_result]:(state,payload)=>{
    return {...initial.searchresult};
  }
}, initial.searchresult);

export default searchresult;
