const config =  {
  secretkey:'bmskey',
  listenport:process.env.listenport ||5011,
  rooturl:process.env.rooturl || 'http://bmscatl.com28.cn',
  issmsdebug:process.env.issmsdebug || false,
  publishdirtest:'../../../bms/test/build',
  publishdirapp:'../../../bms/app/build',
  publishdirpc:'../../../dist/pc/build',
  publishdiradmin:'../../dist/admin',
  publishlog:'../../log',
  uploaddir:'../uploader',
  uploadurl:'/uploader',
  jpush_appkey:'630950d8101fe73d19d64aaf',
  jpush_mastersecret:'dd52bf9de919a2a53441fce3',

  expRequestMinutes:200,//2分钟之内
  maxAge:86400000,
  maxDistance:3,
  authexptime:120,//验证码有效期，2分钟
  loginuserexptime:60*60*24*30,//用户登录有效期,30天
  mongodburl:process.env.MONGO_URL || 'mongodb://localhost/bms',
  mapdict:{},
  kafka_consumersettings:{
    host: process.env.KAFKA_HOST ||'bmscatl.com28.cn:2181',
    groupId:  process.env.KAFKA_PUSHDEVICEGROUP ||'PUSHDEVICEGROUP',
    sessionTimeout: 15000,
    protocol: ['roundrobin'],
    fromOffset: 'earliest' // equivalent of auto.offset.reset valid values are 'none', 'latest', 'earliest'
  },
  defaultmappopclusterfields:[
    'TotalWorkCycle','ChargeACVoltage','BAT_I_HVS',
  ],
  defaultmappopfields:[
    'TotalWorkCycle','ChargeACVoltage','BAT_I_HVS','BAT_ISO_R_Pos','BAT_ISO_R_Neg',
    'BAT_Ucell_Max','BAT_Ucell_Min','BAT_Ucell_Avg','BAT_T_Max','BAT_T_Min','BAT_T_Avg'],
  defaultmapdetailfields:[
    {
      groupname:'基本信息',
      fieldslist:['TotalWorkCycle','ChargeACVoltage','BAT_I_HVS','BAT_ISO_R_Pos','BAT_ISO_R_Neg',]
    },
    {
      groupname:'GPS信息',
      fieldslist:['TotalWorkCycle',]
    },
    {
      groupname:'车辆状态',
      fieldslist:['ChargeACVoltage']
    },
    {
      groupname:'电池类信息',
      fieldslist:['BAT_Ucell_Max','BAT_Ucell_Min','BAT_Ucell_Avg','BAT_T_Max','BAT_T_Min','BAT_T_Min',]
    },
  ]
};



module.exports = config;
