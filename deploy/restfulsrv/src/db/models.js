const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const moment = require('moment');
// const config = require('../config.js');
// const moment = require('moment');

mongoose.Promise = global.Promise;
//系统设置
const SystemConfigSchema = new Schema({
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
}, { strict: false });
SystemConfigSchema.plugin(mongoosePaginate);
const SystemConfigModel =mongoose.model('systemconfig',  SystemConfigSchema);

//设备
const DeviceSchema = new Schema({
}, { strict: false });
DeviceSchema.plugin(mongoosePaginate);
const DeviceModel =mongoose.model('device',  DeviceSchema);

//设备分组
const DeviceGroupSchema = new Schema({
  name:String,
  memo:String,
  contact:String,
  deviceids:[{ type: Schema.Types.ObjectId, ref: 'device', default: [] }],
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
  systemflag:{ type: Schema.Types.Number,default: 0 },
});
DeviceGroupSchema.plugin(mongoosePaginate);
const DeviceGroupModel =mongoose.model('devicegroup',  DeviceGroupSchema);

//用户
const UserSchema = new Schema({
  username:String,
  passwordhash: String,
  passwordsalt: String,
  truename:String,
  memo:String,
  created_at: { type: String, default:moment().format('YYYY-MM-DD HH:mm:ss')},
  updated_at: { type: String, default:moment().format('YYYY-MM-DD HH:mm:ss')},
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
  roleid:{ type: Schema.Types.ObjectId, ref: 'role' },
  adminflag:{ type: Schema.Types.Number,default: 0 },
  devicegroups:[{ type: Schema.Types.ObjectId, ref: 'devicegroup', default: [] }],
  devicecollections:[],
  alarmsettings:{
    warninglevel:String,//报警等级
    subscriberdeviceids:[],//订阅的设备
  }
});
UserSchema.plugin(mongoosePaginate);
const UserModel =mongoose.model('user',  UserSchema);


//组织
const OrganizationSchema = new Schema({
  name:String,
  memo:String,
  contact:String,
});
OrganizationSchema.plugin(mongoosePaginate);
const OrganizationModel =mongoose.model('organization',  OrganizationSchema);

//用户分组
const UserGroupSchema = new Schema({
  name:String,
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
  roleid:{ type: Schema.Types.ObjectId, ref: 'role' },
  memo:String,
  contact:String,
});
UserGroupSchema.plugin(mongoosePaginate);
const UserGroupModel =mongoose.model('usergroup',  UserGroupSchema);

//权限
const PermissionSchema = new Schema({
  name:String,
  memo:String,
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
  systemflag:{ type: Schema.Types.Number,default: 0 },
});
PermissionSchema.plugin(mongoosePaginate);
const PermissionModel =mongoose.model('permission',  PermissionSchema);

//角色
const RoleSchema = new Schema({
  name:String,
  memo:String,
  permissions:[{ type: Schema.Types.ObjectId, ref: 'permission', default: [] }],
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
});
RoleSchema.plugin(mongoosePaginate);
const RoleModel =mongoose.model('role',  RoleSchema);

//实时告警信息[按天]
const RealtimeAlarmSchema= new Schema({
}, { strict: false });
RealtimeAlarmSchema.plugin(mongoosePaginate);
const RealtimeAlarmModel =mongoose.model('realtimealarm',  RealtimeAlarmSchema);

//原始信息
const RealtimeAlarmRawSchema= new Schema({
}, { strict: false });
RealtimeAlarmRawSchema.plugin(mongoosePaginate);
const RealtimeAlarmRawModel =mongoose.model('realtimealarmraw',  RealtimeAlarmRawSchema);

//设备轨迹
const HistoryTrackSchema = new Schema({
}, { strict: false });
HistoryTrackSchema.plugin(mongoosePaginate);
const HistoryTrackModel =mongoose.model('historytrack',  HistoryTrackSchema);
//CAN 数据,原始数据
const CanRawDataSchema = new Schema({
  DeviceId:String,//设备id
  DataTime:{ type: String, default:moment().format('YYYY-MM-DD HH:mm:ss')},	//2017-03-28 08:00:00	date	 	采集本地时间，格式：yyyy-MM-dd HH:mm:ss
  MessageTime:{ type: String, default:moment().format('YYYY-MM-DD HH:mm:ss')},//	2017-03-28 08:00:00	date	 	Gateway接收到数据的本地时间，格式：yyyy-MM-dd HH:mm:ss
  SN:String,//sn
  Data:String,//
  created_at:{ type: String, default:moment().format('YYYY-MM-DD HH:mm:ss')},//插入数据库时间
});
CanRawDataSchema.plugin(mongoosePaginate);
const CanRawDataModel =mongoose.model('canrawdata',  CanRawDataSchema);

//设备历史信息
const HistoryDeviceSchema = new Schema({
}, { strict: false });
HistoryDeviceSchema.plugin(mongoosePaginate);
const HistoryDeviceModel =mongoose.model('historydevice',  HistoryDeviceSchema);

//登录日志
const UserLogSchema = new Schema({
    username:String,
    organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
    created_at:{ type: String, default:moment().format('YYYY-MM-DD HH:mm:ss')},
    creator:{ type: Schema.Types.ObjectId, ref: 'user' },
    type:{type:String,default:'login'}
});
UserLogSchema.plugin(mongoosePaginate);
const UserLogModel =mongoose.model('userlog',  UserLogSchema);


const UserAdminSchema = new Schema({
  username:String,
  passwordhash: String,
  passwordsalt: String,
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
  created_at: { type: String, default:moment().format('YYYY-MM-DD HH:mm:ss')},
  updated_at: { type: String, default:moment().format('YYYY-MM-DD HH:mm:ss')},
});
const UserAdmin  = mongoose.model('useradmin',  UserAdminSchema);

//数据字典
const DataDictSchema = new Schema({
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
  name:{type:String},//字段名
  fullname:{type:String},//字段全名
  showname:{type:String},//字段显示名
  type:{type:String},//字段类型
  desc:{type:String},//字段描述
  unit:{type:String},//字段单位
});
DataDictSchema.plugin(mongoosePaginate);
const DataDictModel =mongoose.model('datadict',  DataDictSchema);

//数据字典
const ExportTokenSchema = new Schema({
  userid:{ type: Schema.Types.ObjectId, ref: 'user' },
  queryobjstring:String,
  tokenid:String
});
ExportTokenSchema.plugin(mongoosePaginate);
const ExportTokenModel =mongoose.model('exporttoken',  ExportTokenSchema);

exports.UserAdminSchema = UserAdminSchema;
exports.SystemConfigSchema = SystemConfigSchema;
exports.DeviceSchema = DeviceSchema;
exports.DeviceGroupSchema = DeviceGroupSchema;
exports.OrganizationSchema = OrganizationSchema;
exports.UserSchema = UserSchema;
exports.UserGroupSchema = UserGroupSchema;
exports.PermissionSchema = PermissionSchema;
exports.RoleSchema = RoleSchema;
exports.RealtimeAlarmSchema = RealtimeAlarmSchema;
exports.CanRawDataSchema = CanRawDataSchema;
exports.HistoryTrackSchema = HistoryTrackSchema;
exports.HistoryDeviceSchema = HistoryDeviceSchema;
exports.UserLogSchema = UserLogSchema;
exports.DataDictSchema = DataDictSchema;
exports.ExportTokenSchema = ExportTokenSchema;

exports.UserAdminModel = UserAdmin;
exports.SystemConfigModel = SystemConfigModel;
exports.DeviceModel = DeviceModel;
exports.DeviceGroupModel = DeviceGroupModel;
exports.OrganizationModel = OrganizationModel;
exports.UserModel = UserModel;
exports.UserGroupModel = UserGroupModel;
exports.PermissionModel = PermissionModel;
exports.RoleModel = RoleModel;
exports.RealtimeAlarmModel = RealtimeAlarmModel;
exports.RealtimeAlarmRawModel = RealtimeAlarmRawModel;
exports.CanRawDataModel = CanRawDataModel;
exports.HistoryTrackModel = HistoryTrackModel;
exports.HistoryDeviceModel = HistoryDeviceModel;
exports.UserLogModel = UserLogModel;
exports.DataDictModel = DataDictModel;
exports.ExportTokenModel = ExportTokenModel;
