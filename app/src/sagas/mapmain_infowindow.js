/**
 * Created by wangxiaoqing on 2017/5/27.
 */
import config from '../env/config';
import {createInfoWindow_popinfo as createInfoWindow_popinfo_app ,createInfoWindow_poplistinfo as createInfoWindow_poplistinfo_app} from './mapmain_infowindow.app.js';
import {createInfoWindow_popinfo as createInfoWindow_popinfo_pc ,createInfoWindow_poplistinfo as createInfoWindow_poplistinfo_pc} from './mapmain_infowindow.app.js';

let createInfoWindow_popinfo,createInfoWindow_poplistinfo;
if (config.softmode === 'pc') {
  createInfoWindow_popinfo = createInfoWindow_popinfo_pc;
  createInfoWindow_poplistinfo = createInfoWindow_poplistinfo_pc;

} else {
  createInfoWindow_popinfo = createInfoWindow_popinfo_app;
  createInfoWindow_poplistinfo = createInfoWindow_poplistinfo_app;
}

export {createInfoWindow_popinfo,createInfoWindow_poplistinfo};
