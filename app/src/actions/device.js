import { createAction } from 'redux-act';
//获取车辆分组信息
export const querydevicegroup_request = createAction('querydevicegroup_request');
export const querydevicegroup_result = createAction('querydevicegroup_result');
//查询车辆【首页上的高级搜索】
export const querydevice_request = createAction('querydevice_request');
export const querydevice_result = createAction('querydevice_result');
//获取一个device所有信息
export const querydeviceinfo_request = createAction('querydeviceinfo_request');
export const querydeviceinfo_result = createAction('querydeviceinfo_result');

export const querydeviceinfo_list_request = createAction('querydeviceinfo_list_request');
export const querydeviceinfo_list_result = createAction('querydeviceinfo_list_result');
//查询报警信息
export const queryrealtimealarm_request = createAction('queryrealtimealarm_request');
export const queryrealtimealarm_result = createAction('queryrealtimealarm_result');
//查询历史轨迹数据
export const queryhistorytrack_request  = createAction('queryhistorytrack_request');
export const queryhistorytrack_result  = createAction('queryhistorytrack_result');
//查询今天所有报警信息列表
export const getcurallalarm_request= createAction('getcurallalarm_request');
export const getcurallalarm_result = createAction('getcurallalarm_result');

//查询电池包
export const searchbattery_request = createAction('searchbattery_request');
export const searchbattery_result = createAction('searchbattery_result');

export const searchbatterylocal_request = createAction('searchbatterylocal_request');
export const searchbatterylocal_result = createAction('searchbatterylocal_result');
//查询电池包报警
export const searchbatteryalarm_request = createAction('searchbatteryalarm_request');
export const searchbatteryalarm_result = createAction('searchbatteryalarm_result');
//查询单个电池包报警
export const searchbatteryalarmsingle_request = createAction('searchbatteryalarmsingle_request');
export const searchbatteryalarmsingle_result = createAction('searchbatteryalarmsingle_result');

//主动更新某个电池包的数据
//经纬度信息发生变化
export const serverpush_devicegeo = createAction('serverpush_devicegeo');
export const serverpush_devicegeo_sz = createAction('serverpush_devicegeo_sz');
export const serverpush_devicealarm = createAction('serverpush_devicealarm');
//批量车辆地理位置变化
export const devicelistgeochange_distcluster = createAction('devicelistgeochange_distcluster');
export const devicelistgeochange_pointsimplifierins = createAction('devicelistgeochange_pointsimplifierins');
export const devicelistgeochange_geotreemenu = createAction('devicelistgeochange_geotreemenu');
export const devicelistgeochange_geotreemenu_refreshtree = createAction('devicelistgeochange_geotreemenu_refreshtree');

//每秒发送一次请求
export const serverpush_devicegeo_sz_request = createAction('serverpush_devicegeo_sz_request');
export const serverpush_devicegeo_sz_result = createAction('serverpush_devicegeo_sz_result');
export const serverpush_alarm_sz_request =  createAction('serverpush_alarm_sz_request');
export const serverpush_alarm_sz_result =  createAction('serverpush_alarm_sz_result');

export const start_serverpush_devicegeo_sz= createAction('start_serverpush_devicegeo_sz');
export const stop_serverpush_devicegeo_sz= createAction('stop_serverpush_devicegeo_sz');

export const start_serverpush_alarm_sz = createAction('start_serverpush_alarm_sz');
export const stop_serverpush_alarm_sz= createAction('stop_serverpush_alarm_sz');

//设置报警信息已读
export const setalarmreaded_request= createAction('setalarmreaded_request');
export const setalarmreaded_result= createAction('setalarmreaded_result');

//收藏设备/取消收藏
export const collectdevice_request = createAction('collectdevice_request');
export const collectdevice_result = createAction('collectdevice_result');

export const set_treesearchlist = createAction('set_treesearchlist');
