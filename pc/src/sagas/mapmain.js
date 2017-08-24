import { select,put,call,take,takeEvery,takeLatest,cancel,fork,join,throttle } from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {
  mapmain_setzoomlevel,
  mapmain_setmapcenter,
  map_setmapinited,
  carmapshow_createmap,
  carmapshow_destorymap,
  mapmain_setenableddrawmapflag,
  querydevice_result,
  ui_selcurdevice,
  ui_selcurdevice_result,
  querydeviceinfo_request,
  querydeviceinfo_result,
  ui_showmenu,
  ui_showdistcluster,
  ui_showhugepoints,
  mapmain_seldistrict,
  mapmain_seldistrict_init,
  mapmain_getdistrictresult,
  mapmain_getdistrictresult_init,
  mapmain_getdistrictresult_last,
  ui_settreefilter,
  md_ui_settreefilter,
  serverpush_devicegeo,
  serverpush_devicegeo_sz,
  devicelistgeochange_distcluster,
  devicelistgeochange_pointsimplifierins,
  devicelistgeochange_geotreemenu,
  devicelistgeochange_geotreemenu_refreshtree,
  mapmain_areamountdevices_request,
  mapmain_areamountdevices_result
} from '../actions';
import async from 'async';
import {getgeodatabatch,getgeodata} from './mapmain_getgeodata';
import {getcurrentpos} from './getcurrentpos';
import { push } from 'react-router-redux';
import L from 'leaflet';
import _ from 'lodash';
import moment from 'moment';
import coordtransform from 'coordtransform';
import {getadcodeinfo} from '../util/addressutil';
import {getpopinfowindowstyle,getgroupStyleMap} from './getmapstyle';
import jsondataareas from '../util/areas.json';
import jsondataprovinces from '../util/provinces.json';
import jsondatacities from '../util/cities.json';

const divmapid_mapmain = 'mapmain';

let infoWindow;
const loczero = L.latLng(0,0);
let distCluster,pointSimplifierIns;
let groupStyleMap = {};


//=====数据部分=====
let g_devices = {};
let gmap_treecount = {};
let gmap_devices = {};
//新建行政区域&海量点
const CreateMapUI_PointSimplifier =  (map)=>{
  return new Promise((resolve,reject) => {
      console.log(`开始加载地图啦,window.AMapUI:${!!window.AMapUI}`);
      window.AMapUI.load(['ui/misc/PointSimplifier',
    ],(PointSimplifier)=> {
           if (!PointSimplifier.supportCanvas) {
               alert('当前环境不支持 Canvas！');
               reject();
               return;
           }
           //分组样式
           let groupsz = getgroupStyleMap();
           _.map(groupsz,(group)=>{
             const {name,image,...rest} = group;
             groupStyleMap[name] = {
                pointStyle: {
                 content:PointSimplifier.Render.Canvas.getImageContent(
                     image, onIconLoad, onIconError),
                 ...rest
               }
             }
           });

           const onIconLoad = ()=> {
               pointSimplifierIns.renderLater();
           }

           const onIconError = (e)=> {
               alert('图片加载失败！');
           }
           //海量点控件
           pointSimplifierIns = new PointSimplifier({
               zIndex: 115,
               autoSetFitView: false,
               map: map, //所属的地图实例
               getPosition: (deviceitem)=> {
                   let itemnew = g_devices[deviceitem.DeviceId];
                   if(!!itemnew){
                    //  console.log(`显示点:${JSON.stringify(itemnew.locz)}`);
                     return itemnew.locz;
                   }
                  //  console.log(`显示点:${JSON.stringify(deviceitem.locz)}`);
                   return deviceitem.locz;
                   //return [LastHistoryTrack.Latitude,LastHistoryTrack.Longitude];
               },
               getHoverTitle: (deviceitem, idx)=> {
                   return `设备编号:${deviceitem.DeviceId},当前:${idx}`;
               },
               //使用GroupStyleRender
               renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
               renderOptions: {
                   //点的样式,海量点样式
                   pointStyle: {
                       width: 5,
                       height: 5,
                       fillStyle:'#A2D0FA'
                   },
                   getGroupId: (deviceitem, idx)=> {
                       let idex = parseInt(deviceitem.locz[0]) + parseInt(deviceitem.locz[1]);
                       let groupid = idex%3;
                       return groupid;
                   },
                   groupStyleOptions: (gid)=> {
                       return groupStyleMap[gid];
                   }

               }
           });
           resolve(pointSimplifierIns);
       });

   });
}

const CreateMapUI_DistrictCluster =  (map)=>{
  return new Promise((resolve,reject) => {
      console.log(`开始加载地图啦,window.AMapUI:${!!window.AMapUI}`);
      window.AMapUI.load(['ui/geo/DistrictCluster',
      'lib/utils',
      'lib/dom.utils',
      'ui/geo/DistrictCluster/lib/DistMgr',
    ],(DistrictCluster,utils, domUtils, DistMgr)=> {
           //<------------
           const defaultgetClusterMarker = (feature, dataItems, recycledMarker)=> {
               //行政区域
               try{
                 let container, title, body;
                 const nodeClassNames = {
              				title: 'amap-ui-district-cluster-marker-title',
              				body: 'amap-ui-district-cluster-marker-body',
              				container: 'amap-ui-district-cluster-marker'
              			};
              			if (recycledMarker) {
              				container = recycledMarker.getContent();
              				title = domUtils.getElementsByClassName(nodeClassNames.title, 'span', container)[0];
              				body = domUtils.getElementsByClassName(nodeClassNames.body, 'span', container)[0];
              			} else {
                      container = document.createElement('div');
              				title = document.createElement('span');
              				title.className = nodeClassNames.title;
              				body = document.createElement('span');
              				body.className = nodeClassNames.body;
              				container.appendChild(title);
              				container.appendChild(body);
              			}

              			const props = feature.properties,
              			routeNames = [];
              			const classNameList = [nodeClassNames.container, 'level_' + props.level, 'adcode_' + props.adcode];
              			if (props.acroutes) {
              				const acroutes = props.acroutes;
              				for (let i = 0, len = acroutes.length; i < len; i++) {
              					classNameList.push('descendant_of_' + acroutes[i]);
              					if (i === len - 1) {
              						classNameList.push('child_of_' + acroutes[i]);
              					}
              					if (i > 0) {
              						routeNames.push(DistMgr.getNodeByAdcode(acroutes[i]).name);
              					}
              				}
              			}
              			container.className = classNameList.join(' ');
              			if (routeNames.length > 0) {
              				routeNames.push(props.name);
              				container.setAttribute('title', routeNames.join('>'));
              			} else {
              				container.removeAttribute('title');
              			}
                    if(!!title){
                      title.innerHTML = utils.escapeHtml(props.name);
                    }
              			if(!!body){
                      body.innerHTML = dataItems.length;
                    }

              			const resultMarker = recycledMarker || new window.AMap.Marker({
              				topWhenClick: true,
              				offset: new window.AMap.Pixel(-20, -30),
              				content: container
              			});
              			return resultMarker;
               }
               catch(e){

               }
          	    return null;
        		}

             utils.extend(DistrictCluster.prototype,
               {//重新设置数据时不刷新Marker
                   setDataWithoutClear: function(data) {
                      // console.log(`setDataWithoutClear=======>`);
                      data || (data = []);
                      this.trigger("willBuildData", data);
                      this._data.source = data;
                      //  this._data.bounds = BoundsItem.getBoundsItemToExpand();
                      this._buildDataItems(data);
                      this._buildKDTree();
                      this._distCounter.setData(this._data.list);
                      this.trigger("didBuildData", data);
                      this.renderLater(10);
                      data.length && this._opts.autoSetFitView && this.setFitView();
                    },
              });
             distCluster = new DistrictCluster({
                 zIndex: 100,
                 map: map, //所属的地图实例
                 autoSetFitView:false,
                 getPosition: (deviceitem)=> {
                     return deviceitem.locz;
                 },
                 renderOptions:{
                   featureClickToShowSub:true,
                   clusterMarkerRecycleLimit:1000,
                   clusterMarkerKeepConsistent:false,
                   getClusterMarker : (feature, dataItems, recycledMarker)=> {
                    //  const adcode = _.get(feature,'properties.adcode');
                    //  if(!!adcode){
                    //    gmap_treecount[adcode] = dataItems.length;
                    //    let deviceids = [];
                    //    _.map(dataItems,(data)=>{
                    //      let DeviceId = _.get(data,'dataItem.DeviceId');
                    //      if(!!DeviceId){
                    //        deviceids.push(DeviceId);
                    //      }
                    //    });
                    //    gmap_devices[adcode] = deviceids;
                    //  }
                     //dispatch 部分数据，更新到树
                      if(dataItems.length > 0){
                        return defaultgetClusterMarker(feature, dataItems, recycledMarker);
                      }
                      return null;
                    }
                 }
             });
             resolve(distCluster);
       });

   });
}

//新建地图
let CreateMap =({mapcenterlocation,zoomlevel})=> {
  console.log(`开始创建地图啦。。。。${mapcenterlocation.lng},amap:${!!window.amapmain}`);
  return new Promise((resolve,reject) => {
    if(!mapcenterlocation.equals(loczero) && !window.amapmain ){
      let center = new window.AMap.LngLat(mapcenterlocation.lng,mapcenterlocation.lat);
      window.amapmain = new window.AMap.Map(divmapid_mapmain, {
            center: center,
            zoom:zoomlevel,
            lang:"zh-cn",
            dragEnable:true,
            zoomEnable:true,
            touchZoom:true,
        });

        window.AMap.plugin(['AMap.ToolBar','AMap.Scale','AMap.OverView'],
        ()=>{
          const scale = new window.AMap.Scale({
                visible: true
            });
          const  toolBar = new window.AMap.ToolBar({
                visible: true
            });
          const  overView = new window.AMap.OverView({
                visible: true
            });
            window.amapmain.addControl(scale);
            window.amapmain.addControl(toolBar);
            window.amapmain.addControl(overView);
            resolve(window.amapmain);
        });

      }
      else{
        if(!!window.amapmain){
          resolve(window.amapmain);
          return;
        }
        reject(`地图参数${mapcenterlocation.lng},${mapcenterlocation.lat},amap:${!!window.amapmain}`);
      }
  });
}

//监听地图事件
const listenmapevent = (eventname)=>{
  return new Promise(resolve => {
    window.amapmain.on(eventname, (e)=> {
        resolve(eventname);
    });
  });
}

//监听标记事件
const listenmarkclickevent = (eventname)=>{
  return new Promise(resolve => {
    pointSimplifierIns.on(eventname, (e,record)=> {
        resolve(record);
    });
  });
}

//监听弹框事件
const listenwindowinfoevent = (eventname)=>{
  return new Promise(resolve => {
    infoWindow.on(eventname, (e)=> {
        resolve(eventname);
    });
  });
}

//监听行政事件,clusterMarkerClick
const listenclusterevent = (eventname)=>{
  return new Promise(resolve => {
    distCluster.on(eventname, (e,record)=> {
        distCluster.getClusterRecord(record.adcode,(err,result)=>{
          if(!err){
            const {adcode,name,dataItems,hangingDataItems,children} = result;
            if(!!dataItems){
              if(dataItems.length > 0){
                  resolve({adcodetop:record.adcode,toggled:true});
                  return;
              }
            }
          }
          resolve();
        });
    });
  });
}
//获取reduce
const getmapstate_formapcar = (state) => {
  const {carmap} = state;
  return {...carmap};
}

//显示弹框
const showinfowindow = (deviceitem)=>{
  return new Promise(resolve =>{
      let locz = deviceitem.locz;
      window.AMapUI.loadUI(['overlay/SimpleInfoWindow'], function(SimpleInfoWindow) {

          infoWindow = new SimpleInfoWindow(getpopinfowindowstyle(deviceitem));

          if(!!locz){
            window.amapmain.setCenter(locz);
            infoWindow.open(window.amapmain, locz);
          }
          else{
            infoWindow.open(window.amapmain, window.amapmain.getCenter());
          }

          resolve(infoWindow);
      });
  });
}

//获取root
const getclustertree_root =()=>{
  const adcodetop=100000;
  return new Promise((resolve,reject) => {
    if(!distCluster){
      reject();
      return;
    }
    distCluster.getClusterRecord(adcodetop,(err,result)=>{
      if(!err){
        const {children,dataItems} = result;
        if(!children || children.length === 0){
          reject();
        }
        if(!dataItems || dataItems.length === 0){
          reject();
          return;
        }
        gmap_treecount[adcodetop]=dataItems.length;//全国

        let childadcodelist = [];
        _.map(children,(child)=>{
          if(child.dataItems.length > 0){
            childadcodelist.push(child.adcode);
            gmap_treecount[child.adcode]=child.dataItems.length;
          }
          else{
            gmap_treecount[child.adcode]=0;
          }
        });
        resolve(childadcodelist);
      }
      else{
        reject(err);
      }
    });
  });
}

const getclustertree_one =(adcode)=>{
  return new Promise((resolve,reject) => {
    if(!distCluster){
      reject();
      return;
    }
    distCluster.getClusterRecord(adcode,(err,result)=>{
      if(!err){
        const {adcode,dataItems,children} = result;
        if(!children || children.length === 0){
          //device
          let deviceids = [];
          if(!!dataItems){
            _.map(dataItems,(deviceitem)=>{
              if(!!deviceitem.dataItem){
                deviceids.push(deviceitem.dataItem.DeviceId);
              }
            });
          }
          gmap_treecount[adcode]=deviceids.length;
          gmap_devices[adcode]=deviceids;
          resolve({
            type:'device',
            deviceids
          });
        }
        else{
          //group
          let childadcodelist = [];
          if(!dataItems || dataItems.length === 0){
            gmap_treecount[adcode]=0;
            resolve({
              type:'group',
              childadcodelist
            });
            return;
          }
          gmap_treecount[adcode]=dataItems.length;
          _.map(children,(child)=>{
              if(child.dataItems.length > 0){
                gmap_treecount[child.adcode]=child.dataItems.length;
                childadcodelist.push(child.adcode);
              }
              else{
                gmap_treecount[child.adcode]=0;
              }

          });
          resolve({
            type:'group',
            childadcodelist
          });
        }
      }
      else{
        reject(err);
      }
    });
  });
}




export function* createmapmainflow(){
    console.log(`createmapmainflow...`);
    //创建地图
    yield takeEvery(`${carmapshow_createmap}`, function*(action_createmap) {
      try{
        let {payload:{divmapid}} = action_createmap;
        if(divmapid === divmapid_mapmain){
          while(!window.AMap || !window.AMapUI){
            yield call(delay,500);
          }
          console.log(`carmapshow_createmap...`);
          //take
          let mapcarprops = yield select(getmapstate_formapcar);
          if(!mapcarprops.isMapInited){//仅在第一次加载页面初始化时进入
            //等待地图初始化
            yield take(`${map_setmapinited}`);
          }
          let {mapcenterlocation,zoomlevel} = mapcarprops;
          if(mapcenterlocation.equals(loczero)){//仅在第一次加载页面初始化时进入
            const centerpos = yield call(getcurrentpos);
            mapcenterlocation = L.latLng(centerpos.lat, centerpos.lng);
          }
          yield call(CreateMap,{mapcenterlocation,zoomlevel});//创建地图

          yield call(CreateMapUI_PointSimplifier,window.amapmain);
          yield call(CreateMapUI_DistrictCluster,window.amapmain);

          let listentask =  yield fork(function*(eventname){
            while(true){
              let result = yield call(listenclusterevent,eventname);
              if(!!result){
                yield put(mapmain_seldistrict(result));
              }
              // yield put(clusterMarkerClick(result));
            }
          },'clusterMarkerClick');



          let task_dragend =  yield fork(function*(eventname){
            while(true){
              yield call(listenmapevent,eventname);
              let centerlocation = window.amapmain.getCenter();
              let centerlatlng = L.latLng(centerlocation.lat, centerlocation.lng);
              yield put(mapmain_setmapcenter(centerlatlng));
            }
          },'dragend');

          let task_zoomend =  yield fork(function*(eventname){
            while(true){
              yield call(listenmapevent,eventname);
              // let centerlocation = window.amapmain.getCenter();
              // let centerlatlng = L.latLng(centerlocation.lat, centerlocation.lng);
              yield put(mapmain_setzoomlevel(window.amapmain.getZoom()));
            }
          },'zoomend');

          let task_markclick = yield fork(function*(eventname){
            while(true){
                const dataitem = yield call(listenmarkclickevent,eventname);
                if(!!dataitem){
                  let deviceitem = dataitem.data;
                  console.log(`点击了记录:${JSON.stringify(dataitem)}`);

                  if(!!deviceitem){
                    yield put(ui_selcurdevice({DeviceId:deviceitem.DeviceId,deviceitem}));
                  }
                }
              //
            }
          },'pointClick');//'pointClick pointMouseover pointMouseout'
          //监听事件
          //  pointSimplifierIns.on('pointClick pointMouseover pointMouseout', function(e, record) {
          //      console.log(e.type, record);
          //  })

          yield take(`${carmapshow_destorymap}`);
          yield cancel(task_dragend);
          yield cancel(task_zoomend);
        }
      }
      catch(e){
        console.log(`创建地图失败${e}`);
      }

    });

    //销毁地图
    yield takeEvery(`${carmapshow_destorymap}`, function*(action_destorymap) {
      let {payload:{divmapid}} = action_destorymap;
      if(divmapid === divmapid_mapmain){
        window.amapmain = null;
        infoWindow=null;
        distCluster=null;
        pointSimplifierIns=null;
      }
    });


    yield takeLatest(`${ui_selcurdevice_result}`,function*(actioncurdevice){
      try{
          const {payload:{DeviceId,deviceitem}} = actioncurdevice;
          console.log(`${JSON.stringify(deviceitem)}`);
          yield put(querydeviceinfo_request({query:{DeviceId}}));
          const {payload} = yield take(`${querydeviceinfo_result}`);
          yield call(showinfowindow,payload);
          yield fork(function*(eventname){
           while(true){
             yield call(listenwindowinfoevent,eventname);
             yield put(ui_showmenu("showdevice_no"));
           }
          },'close');
          // yield put(ui_showmenu("showdevice"));
          console.log(`显示弹框${JSON.stringify(deviceitem)}`);
        }
        catch(e){
          console.log(`选择点失败${e}`);
        }
    });

    //查询所有设备返回
    yield takeLatest(`${querydevice_result}`, function*(deviceresult) {
      let {payload:{list:devicelist}} = deviceresult;
      try{
          while(!pointSimplifierIns || !distCluster){
            yield call(delay,2500);
          }
          //批量转换一次
          g_devices = {};
          let devicelistresult = yield call(getgeodatabatch,devicelist);
          const data = [];
          _.map(devicelistresult,(deviceitem)=>{
            if(!!deviceitem.locz){
              data.push(deviceitem);
              g_devices[deviceitem.DeviceId] = deviceitem;
            }
          });
          console.log(`一共显示${data.length}个设备`);
          distCluster.setData(data);
          pointSimplifierIns.setData(data);

          yield put(mapmain_seldistrict_init());
        }
        catch(e){
          console.log(`选择点失败${e}`);
        }

    });

    //显示地图区域
    yield takeEvery(`${ui_showdistcluster}`, function*(action_showflag) {
        let {payload:isshow} = action_showflag;
        try{
          if(!!distCluster){
            if(isshow){
              distCluster.show();
            }
            else{
              distCluster.hide();
            }
            distCluster.render();
          }
        }
        catch(e){
          console.log(e);
        }
    });
    //显示海量点
    yield takeEvery(`${ui_showhugepoints}`, function*(action_showflag) {
        let {payload:isshow} = action_showflag;
        try{
          if(!!distCluster){
            if(isshow){
              pointSimplifierIns.show();
            }
            else{
              pointSimplifierIns.hide();
            }
            pointSimplifierIns.render();
          }
        }
        catch(e){
          console.log(e);
        }
    });
    //第一次初始化
    yield takeEvery(`${mapmain_seldistrict_init}`, function*(action_district) {
      try{
        // let gmap_treecount = {};
        // let gmap_devices = {};
        console.log(`开始初始化root设备树:${moment().format('YYYY-MM-DD HH:mm:ss')}`);
        const childadcodelist = yield call(getclustertree_root);
        yield put(mapmain_getdistrictresult_init({g_devices,gmap_devices,gmap_treecount}));
        console.log(`结束初始化root设备树:${moment().format('YYYY-MM-DD HH:mm:ss')}`);

        // function* getchild(childadcodelist){
        //   let forkhandles = [];
        //   for(let i=0;i<childadcodelist.length ;i++){
        //   // _.map(childadcodelist,function*(adcode){
        //     const handlefork = yield fork(function*(adcode){
        //       const result = yield call(getclustertree_one,adcode);
        //       if(result.type === 'group'){
        //         yield call(getchild,result.childadcodelist);
        //       }
        //     },childadcodelist[i]);
        //     forkhandles.push(handlefork);
        //   };
        //
        //   if(forkhandles.length > 0){
        //     yield join(...forkhandles);
        //   }
        // }
        // yield call(getchild,childadcodelist);
        // yield put(mapmain_getdistrictresult_init({g_devices,gmap_devices,gmap_treecount}));
        console.log(`所有===>设备树:${moment().format('YYYY-MM-DD HH:mm:ss')}`);
      }
      catch(e){
        console.log(e);
      }
    });
    //mapmain_areamountdevices_request
    // yield takeEvery(`${mapmain_areamountdevices_request}`, function*(action_district) {
    //     let {payload:{adcodetop}} = action_district;
    //     try{
    //       yield put(mapmain_seldistrict(action_district.payload));
    //       //获取adcodetop所在设备
    //       const result = yield call(getclustertree_one,adcodetop);
    //       if(!!result){
    //         if(result.type === 'device'){
    //           let devicelist = result.deviceids;
    //           yield put(mapmain_areamountdevices_result({adcode:adcodetop,gmap_devices,g_devices}));
    //         }
    //       }
    //     }
    //     catch(e){
    //
    //     }
    // });
    //mapmain_getdistrictresult
    yield takeEvery(`${mapmain_seldistrict}`, function*(action_district) {
        let {payload:{adcodetop}} = action_district;
        try{
          if(!!adcodetop){
            //下面判断，防止用户在地图上乱点导致左侧省市区的树无法更新
            //========================================================================================
            if(!!distCluster){
              distCluster.zoomToShowSubFeatures(adcodetop);
            }
            console.log(`zoomToShowSubFeatures:${adcodetop}`);
            const result = yield call(getclustertree_one,adcodetop);
            if(!!result){
              if(result.type === 'device'){
                yield put(mapmain_areamountdevices_result({adcode:adcodetop,gmap_devices,g_devices}));
              }
              else{
                yield put(devicelistgeochange_geotreemenu_refreshtree({g_devices,gmap_devices,gmap_treecount}));
              }
            }
            yield put(mapmain_getdistrictresult({adcode:adcodetop}));
          }
        }
        catch(e){
          console.log(e);
        }
        yield put(mapmain_getdistrictresult_last({}));

    });

    yield takeLatest(`${ui_selcurdevice}`,function*(actioncurdevice){
      const {payload:{DeviceId,deviceitem}} = actioncurdevice;
      try{
        //如果左侧的树中没有该设备
        const {curdevicelist} = yield select((state)=>{
          return {...state.device};
        });
        if(!_.find(curdevicelist,(o)=>{return DeviceId === o.name})){
            //树中找不到该设备,获取该设备所在经纬度
            const result = yield call(getgeodata,deviceitem);
            const adcodetop = parseInt(result.adcode);
            yield put(mapmain_seldistrict({adcodetop,toggled:true}));
            console.log(`等待数据完成...`);
            yield take(`${mapmain_getdistrictresult_last}`);//等待数据完成
        }
      }
      catch(e){
        console.log(e);
      }
      yield put(ui_selcurdevice_result(actioncurdevice.payload));
    });

    yield takeLatest(`${md_ui_settreefilter}`,function*(action){
      //https://redux-saga.js.org/docs/recipes/
      try{
        const {payload} = action;
        let delaytime = 0;
        let treefilter = payload;
        if(!!treefilter){
            delaytime = 500;
        }
        yield call(delay, delaytime);
        yield put(ui_settreefilter(payload));
      }
      catch(e){
        console.log(e);
      }
    });
    //serverpush_devicegeo

    //某个设备地理位置发送变化
    yield takeEvery(`${serverpush_devicegeo}`,function*(action){
      //https://redux-saga.js.org/docs/recipes/
      const {payload} = action;
      let deviceitem = payload;
      try{
        g_devices[deviceitem.DeviceId] = deviceitem;
        yield put(devicelistgeochange_distcluster({}));
        yield put(devicelistgeochange_pointsimplifierins({}));
      }
      catch(e){
        console.log(e);
      }
    });

    yield takeEvery(`${serverpush_devicegeo_sz}`,function*(action){
      //https://redux-saga.js.org/docs/recipes/
      const {payload} = action;
      let {list} = payload;
      try{
        _.map(list,(deviceitem)=>{
          g_devices[deviceitem.DeviceId] = deviceitem;
        });
        // console.log(`list:${list.length}`)
        yield put(devicelistgeochange_distcluster({}));
        yield put(devicelistgeochange_pointsimplifierins({}));
        yield put(devicelistgeochange_geotreemenu({}));
      }
      catch(e){
        console.log(e);
      }
    });
    //devicelistgeochange
    yield throttle(1300,`${devicelistgeochange_distcluster}`,function*(action){
      try{
        if(!!distCluster){
          let data = [];
          _.map(g_devices,(item)=>{
            data.push(item);
          });
          distCluster.setDataWithoutClear(data);
          //获取树形结构
          //修改树形结构标题
          //设置树形结构
        }
      }
      catch(e){
        console.log(e);
      }
    });

    yield throttle(1700,`${devicelistgeochange_pointsimplifierins}`,function*(action){
      try{
        if(!!pointSimplifierIns){
          let data = [];
          _.map(g_devices,(item)=>{
            data.push(item);
          });
          pointSimplifierIns.setData(data);
        }
      }
      catch(e){
        console.log(e);
      }
    });

    yield throttle(1900,`${devicelistgeochange_geotreemenu}`,function*(action){
      try{
        //获取当前树，当前选择展开的行政编码code，放数组中,循环设置
          console.log(`更新第一个结点:${moment().format('YYYY-MM-DD HH:mm:ss')}`);
          const childadcodelist = yield call(getclustertree_root);
          yield put(devicelistgeochange_geotreemenu_refreshtree({g_devices,gmap_devices,gmap_treecount}));
          console.log(`更新第一个结点完毕:${moment().format('YYYY-MM-DD HH:mm:ss')}`);

          const getdevicestate = (state)=>{
            const {datatree} = state.device;
            return {datatree};
          }
          let codelist = [];
          let curareaid;
          const {datatree} = yield select(getdevicestate);
          const findexpandnode = (node)=>{
            let retnode;
            if(node.toggled){
              if(node.type === 'group_provice' || node.type === 'group_city' || node.type === 'group_area'){
                if(node.type === 'group_area'){
                  curareaid = node.adcode;
                }
                codelist.push(node.adcode);
              }
              retnode = node;
            }
            if(!!node.children){
              for(let i = 0; i<node.children.length ;i++){
                const subnode = node.children[i];
                let tmpnode = findexpandnode(subnode);
                if(!!tmpnode){
                  break;
                }
              }
            }
            return retnode;
          }
          findexpandnode(datatree);
          console.log(`全部展开列表:${JSON.stringify(codelist)}`);
          //==============
          let forkhandles = [];
          for(let i=0;i<codelist.length ;i++){
            const handlefork = yield fork(function*(adcode){
              const result = yield call(getclustertree_one,adcode);
            },codelist[i]);
            forkhandles.push(handlefork);
          };

          if(forkhandles.length > 0){
            yield join(...forkhandles);
          }
          if(!!curareaid){
            yield put(mapmain_areamountdevices_result({adcode:curareaid,gmap_devices,g_devices}));
          }
          yield put(devicelistgeochange_geotreemenu_refreshtree({g_devices,gmap_devices,gmap_treecount}));


          console.log(`更新结点完毕:${moment().format('YYYY-MM-DD HH:mm:ss')}`);

      }
      catch(e){
        console.log(e);
      }
    });

    //devicelistgeochange_geotreemenu
}
