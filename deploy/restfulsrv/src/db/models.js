let mongoose     = require('mongoose');
let Schema       = mongoose.Schema;
let mongoosePaginate = require('mongoose-paginate');
// const config = require('../config.js');
// const moment = require('moment');

mongoose.Promise = global.Promise;
//系统设置
let SystemConfigSchema = new Schema({
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
}, { strict: false });
SystemConfigSchema.plugin(mongoosePaginate);
let SystemConfigModel =mongoose.model('systemconfig',  SystemConfigSchema);

//设备
let DeviceSchema = new Schema({
}, { strict: false });
DeviceSchema.plugin(mongoosePaginate);
let DeviceModel =mongoose.model('device',  DeviceSchema);

//设备分组
let DeviceGroupSchema = new Schema({
  name:String,
  memo:String,
  contact:String,
  deviceids:[{ type: Schema.Types.ObjectId, ref: 'device', default: [] }],
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
  systemflag:{ type: Schema.Types.Number,default: 0 },
});
DeviceGroupSchema.plugin(mongoosePaginate);
let DeviceGroupModel =mongoose.model('devicegroup',  DeviceGroupSchema);

//用户
let UserSchema = new Schema({
  username:String,
  passwordhash: String,
  passwordsalt: String,
  truename:String,
  memo:String,
  created_at: { type: Date, default:new Date()},
  updated_at: Date,
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
  roleid:{ type: Schema.Types.ObjectId, ref: 'role' },
  adminflag:{ type: Schema.Types.Number,default: 0 },
  devicegroups:[{ type: Schema.Types.ObjectId, ref: 'devicegroup', default: [] }],
  devicecollections:[]
});
UserSchema.plugin(mongoosePaginate);
let UserModel =mongoose.model('user',  UserSchema);


//组织
let OrganizationSchema = new Schema({
  name:String,
  memo:String,
  contact:String,
});
OrganizationSchema.plugin(mongoosePaginate);
let OrganizationModel =mongoose.model('organization',  OrganizationSchema);

//用户分组
let UserGroupSchema = new Schema({
  name:String,
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
  roleid:{ type: Schema.Types.ObjectId, ref: 'role' },
  memo:String,
  contact:String,
});
UserGroupSchema.plugin(mongoosePaginate);
let UserGroupModel =mongoose.model('usergroup',  UserGroupSchema);

//权限
let PermissionSchema = new Schema({
  name:String,
  memo:String,
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
  systemflag:{ type: Schema.Types.Number,default: 0 },
});
PermissionSchema.plugin(mongoosePaginate);
let PermissionModel =mongoose.model('permission',  PermissionSchema);

//角色
let RoleSchema = new Schema({
  name:String,
  memo:String,
  permissions:[{ type: Schema.Types.ObjectId, ref: 'permission', default: [] }],
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
});
RoleSchema.plugin(mongoosePaginate);
let RoleModel =mongoose.model('role',  RoleSchema);

//实时告警信息[按天]
let RealtimeAlarmSchema= new Schema({
}, { strict: false });
RealtimeAlarmSchema.plugin(mongoosePaginate);
let RealtimeAlarmModel =mongoose.model('realtimealarm',  RealtimeAlarmSchema);

//原始信息
let RealtimeAlarmRawSchema= new Schema({
}, { strict: false });
RealtimeAlarmRawSchema.plugin(mongoosePaginate);
let RealtimeAlarmRawModel =mongoose.model('realtimealarmraw',  RealtimeAlarmRawSchema);

//设备轨迹
let HistoryTrackSchema = new Schema({
  // DeviceId:String,//设备id
  // GPSStatus:String,//A: 定位; V: 不定位;
  // GPSTime:{ type: String, default:moment().format('YYYY-MM-DD HH:mm:ss')},//定位的UTC时间，格式：yyyy-MM-dd HH:mm:ss
  // MessageTime:{ type: Date, default:new Date()},//way接收到数据的本地时间，格式：yyyy-MM-dd HH:mm:ss
  // Longitude:{ type: Schema.Types.Number,default: 0 },//经度
  // Latitude:{ type: Schema.Types.Number,default: 0 },//纬度
  // Speed:{ type: Schema.Types.Number,default: 0 },//速度
  // Course:{ type: Schema.Types.Number,default: 0 },//航向
  // DeviceStatus:String,//设备状态
  // LAC:{ type: Schema.Types.Number,default: 0 },//	30065	uint16	蜂窝 Location Area Code
  // CellId:{ type: Schema.Types.Number,default: 0 },//	53033	uint16	蜂窝 Cell Id
  // ADC1:{ type: Schema.Types.Number,default: 0 },//	37.8	 	主板温度，单位：摄氏度
  // Altitude:{ type: Schema.Types.Number,default: 0 },//	59	 	海拔，单位：米。
  // SN:{ type: Schema.Types.Number,default: 0 },//	1	uint16	Position数据包序号，循环自增
  // Province:String,//	海南省	string	省
  // City:String,//	海口市	string	市
  // County:String,//	 	string	县
  // created_at:{ type: Date, default:new Date()},//插入数据库时间
  // updated_at:{ type: Date, default:new Date()},//插入数据库时间
}, { strict: false });
HistoryTrackSchema.plugin(mongoosePaginate);
let HistoryTrackModel =mongoose.model('historytrack',  HistoryTrackSchema);
//CAN 数据,原始数据
let CanRawDataSchema = new Schema({
  DeviceId:String,//设备id
  DataTime:{ type: Date, default:new Date()},	//2017-03-28 08:00:00	date	 	采集本地时间，格式：yyyy-MM-dd HH:mm:ss
  MessageTime:{ type: Date, default:new Date()},//	2017-03-28 08:00:00	date	 	Gateway接收到数据的本地时间，格式：yyyy-MM-dd HH:mm:ss
  SN:String,//sn
  Data:String,//
  created_at:{ type: Date, default:new Date()},//插入数据库时间
});
CanRawDataSchema.plugin(mongoosePaginate);
let CanRawDataModel =mongoose.model('canrawdata',  CanRawDataSchema);

//设备历史信息
let HistoryDeviceSchema = new Schema({
  deviceid:{ type: Schema.Types.ObjectId, ref: 'device' },
});
HistoryDeviceSchema.plugin(mongoosePaginate);
let HistoryDeviceModel =mongoose.model('historydevice',  HistoryDeviceSchema);

//登录日志
let UserLogSchema = new Schema({
    username:String,
    organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
    created_at:{ type: Date, default:new Date()},
    creator:{ type: Schema.Types.ObjectId, ref: 'user' },
    type:{type:String,default:'login'}
});
UserLogSchema.plugin(mongoosePaginate);
let UserLogModel =mongoose.model('userlog',  UserLogSchema);


UserAdminSchema = new Schema({
  username:String,
  passwordhash: String,
  passwordsalt: String,
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
  created_at: { type: Date, default:new Date()},
  updated_at: Date,
});
let UserAdmin  = mongoose.model('useradmin',  UserAdminSchema);

//数据字典
let DataDictSchema = new Schema({
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
  name:{type:String},//字段名
  fullname:{type:String},//字段全名
  showname:{type:String},//字段显示名
  type:{type:String},//字段类型
  desc:{type:String},//字段描述
  unit:{type:String},//字段单位
});
DataDictSchema.plugin(mongoosePaginate);
let DataDictModel =mongoose.model('datadict',  DataDictSchema);


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
