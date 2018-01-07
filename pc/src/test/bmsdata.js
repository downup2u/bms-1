import data_bms_mydevice from '../test/bms_mydevice.json';
import data_bms_alarm from '../test/bms_alarm.json';
import data_bms_workorder from '../test/workorder.json';
import jsondatareadonly_chargingpile from '../test/bmsdata_chargingpile.json';
import filter from 'lodash.filter';
import map from 'lodash.map';
import moment from 'moment';
import jsondatatrack from '../test/1602010008.json';
import jsondataalarm from '../test/json-BMS2.json';
import {groups} from './bmsdata_group.js';
import {jsondata} from './bms_devices';


const getrandom=(min,max)=>{
  return parseInt(Math.random()*(max-min+1)+min,10);
}

//分组【项目】
let jsondata_bms_groups = groups;

//充电桩
let gmap_chargingpile = {};
let jsondata_bms_chargingpile = [];
let jsondata_chargingpile = filter(jsondatareadonly_chargingpile,(item) => {
  return true;
});
map(jsondata_chargingpile,(item,index)=>{
    item.DeviceId = item['充电桩编号'];
    item.LastHistoryTrack = {
      Latitude:item.LastHistoryTrack__Latitude,
      Longitude:item.LastHistoryTrack__Longitude
    }
    let imagetype = 4;
    let random = getrandom(0,10000);
    if(random < 9500){
      imagetype = 4;
    }
    else if(random > 9500 && random < 9800){
      imagetype = 5;
    }
    else{
      imagetype = 6;
    }
    item.imagetype = ''+imagetype;

    let dqzttext = ['工作','空闲','维修中'];
    let secago = getrandom(0,60*60*12);
    let sample = {
      "采集时间":moment().subtract(secago, 'seconds').format('YYYY-MM-DD HH:mm:ss'),
      "额定功率（kW）":getrandom(50,100),
      "额定电压（V）":getrandom(300,400),
      "最大输出电流（A）":getrandom(150,250),
      "位置描述":item.address.formattedAddress,
      "当前状态":dqzttext[imagetype-4],
      "累计充电次数":`${getrandom(2000,8000)}`,

      "累计放电量（MWh）":getrandom(0,1000)*200/1000,
      "充电模式":getrandom(0,1)?'直流':'交流',
      "绝缘阻抗":getrandom(8000,10000),

    };

    item['当前电流（A）'] =getrandom(0,sample['最大输出电流（A）']);
    item["累计充电量（MWh）"]= sample["累计充电次数"]*50/1000;
    item["累计放电量（MWh）"]=getrandom(0,1000)*200/1000;

    item["当前功率（kW）"]=item['当前电流（A）']*sample['额定电压（V）']/1000;
    item['开机时长（h）'] =getrandom(5,300);

    item['定位状态'] ='有效定位';
    item['纬度信息'] ='北纬';
    item['经度信息'] ='东经';
    item['经度'] =item.LastHistoryTrack.Longitude;
    item['纬度'] =item.LastHistoryTrack.Latitude;
    item = {...item,...sample};

    gmap_chargingpile[item.DeviceId] = item;
    jsondata_bms_chargingpile.push(item);
});

//设备
let jsondata_bms_mydevice = jsondata;

//报警
let jsondata_bms_alarm = [];

//工单
let jsondata_bms_workorder =[];


//制造报警数据
const test_alaram_text=['绝缘故障','高压互锁','SOC过低'];
const test_warning_level_text=['严重报警','紧急报警','一般报警'];
let indexalarm  = 0;
for(let i=0;i<100;i++){
  map(data_bms_alarm,(item,index)=>{
    let cloneitem = {...item};
    indexalarm++;
    let deviceindexalarm = indexalarm%jsondata.length;

    cloneitem.DeviceId = jsondata[deviceindexalarm%jsondata.length].DeviceId;
    //修改数据
    cloneitem.warninglevel = getrandom(0,2);
    cloneitem.key = indexalarm + '';
    cloneitem._id = cloneitem.key;
    cloneitem['报警等级'] = test_warning_level_text[cloneitem.warninglevel];
    cloneitem['车辆ID'] = cloneitem.DeviceId;
    let secago = getrandom(0,60*60*12);
    cloneitem.isreaded = i<7?false:true;
    cloneitem['报警时间'] = moment().subtract(secago, 'seconds').format('YYYY-MM-DD HH:mm:ss');
    cloneitem['报警信息'] = test_alaram_text[getrandom(0,test_alaram_text.length-1)];
    cloneitem['报警位置'] = jsondatareadonly_chargingpile[getrandom(0,jsondatareadonly_chargingpile.length-1)].address.formattedAddress;

    jsondata_bms_alarm.push(cloneitem);
  });

}

//<------处理设备的报警信息到设备------
let mapdata_bms_alarm = {};
map(jsondata_bms_alarm,(item)=>{
  mapdata_bms_alarm[item['DeviceId']] = item['报警信息'];
});
map(jsondata_bms_mydevice,(item,index)=>{
  if(!!mapdata_bms_alarm[item.DeviceId]){
    let cloneitem = {...item};
    cloneitem['报警信息'] = mapdata_bms_alarm[item.DeviceId];
    jsondata_bms_mydevice[index] = cloneitem;
  }
});
// //console.log(jsondata_bms_alarm);

// "工单号" : "",
// "营运公司" : "",
// "车辆ID" : "",
// "故障地点" : "",
// "故障代码" : "",
// "部位" : "",
// "故障描述" : "",
// "责任人" : "",
//制造工单数据
const test_workorder_company_text = ['上海巴士','北京巴士','江苏巴士','安徽巴士'];
const test_workorder_errorcode_text = ['U87','S22','F34','E22'];
const test_workorder_part_text = ['车身','发动机','方向盘','坐骑'];
const test_workorder_assgin_text = ['张三','李四','王五','赵六','钱七','付八','焦九'];
const test_workorder_carid_text = ['苏AXM872','沪BMT722','沪ATJ722','沪A72EF2','沪A9FE2','沪AZM993','沪AME777','沪AAS995','沪AKJ773','沪AFL872','沪A4FJJE','沪ATF335'];
const test_workorder_type_text = ['报警排查','急需维修','正常维护','定时检测','正常维修',];
const test_workorder_feedback_text = ['某零件损坏','某零件脱落','使用不当','被风刮坏了','使用次数过多',];
let indexworkorder  = 0;

let jsondata_bms_workusers = [];
map(test_workorder_assgin_text,(item,index)=>{
  jsondata_bms_workusers.push({
    _id:index+'',
    name:item
  });
});


for(let i=0;i<20;i++){
  map(data_bms_workorder,(item,index)=>{
    let cloneitem = {...item};
    indexworkorder++;
    let deviceindexalarm = indexalarm%jsondata.length;
    cloneitem.DeviceId = jsondata[deviceindexalarm%jsondata.length].DeviceId;
    cloneitem.key = indexworkorder + '';
    cloneitem._id = cloneitem.key;

    let secago = getrandom(0,60*60*24*5);
    cloneitem.createtime = moment().subtract(secago, 'seconds').format('YYYY-MM-DD HH:mm:ss');
    cloneitem['assignto'] = jsondata_bms_workusers[getrandom(0,jsondata_bms_workusers.length-1)]._id;
    cloneitem['车牌'] = test_workorder_carid_text[getrandom(0,test_workorder_carid_text.length-1)];
    cloneitem['项目'] = groups[getrandom(0,groups.length-1)].name;
    cloneitem['故障类型'] = test_workorder_type_text[getrandom(0,test_workorder_type_text.length-1)];
    cloneitem['工单号'] = cloneitem.key;
    cloneitem['车辆ID'] = cloneitem.DeviceId;
    cloneitem['营运公司'] = test_workorder_company_text[getrandom(0,test_workorder_company_text.length-1)];
    cloneitem['故障代码'] = test_workorder_errorcode_text[getrandom(0,test_workorder_errorcode_text.length-1)];
    cloneitem['部位'] = test_workorder_part_text[getrandom(0,test_workorder_part_text.length-1)];
    cloneitem['责任人'] = test_workorder_assgin_text[getrandom(0,test_workorder_assgin_text.length-1)];
    cloneitem['故障地点'] = jsondatareadonly_chargingpile[getrandom(0,jsondatareadonly_chargingpile.length-1)].address.formattedAddress;
    cloneitem['feedbacktxt'] = '';
    cloneitem.isdone = getrandom(0,1)?true:false;
    cloneitem.pics = [];
    if(cloneitem.isdone){
      for(let i=0;i<getrandom(1,5);i++){
        cloneitem.pics.push(`https://unsplash.it/300/200/?random`);
      }
      cloneitem['feedbacktxt'] =  test_workorder_feedback_text[getrandom(0,test_workorder_feedback_text.length-1)];
    }
    jsondata_bms_workorder.push(cloneitem);
  });
}

let jsondata_bms_carcollections = [];
const max_collections = 5 > jsondata.length?jsondata.length:5;
for(let i=0;i<max_collections;i++){
  jsondata_bms_carcollections.push(jsondata[i%jsondata.length].DeviceId);
}

let jsondata_bms_track = jsondatatrack;

// jsondata_bms_alarm = [];//报警信息不要

export {
  jsondata_bms_chargingpile,
  jsondata_bms_track,
  jsondata_bms_mydevice,
  jsondata_bms_alarm,
  jsondata_bms_workorder,
  jsondata_bms_groups,
  jsondata_bms_workusers,
  jsondata_bms_carcollections,
  gmap_chargingpile,
  getrandom
};
