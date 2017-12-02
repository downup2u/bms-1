let config =  {
  mongodburl:process.env.MONGO_URL || 'mongodb://localhost/bms',
  consumerOptions:{
    host: process.env.KAFKA_HOST ||'bmscatl.com28.cn:2181',
    groupId: 'BMSRecvGroup2',
    sessionTimeout: 15000,
    protocol: ['roundrobin'],
    fromOffset: 'earliest' // equivalent of auto.offset.reset valid values are 'none', 'latest', 'earliest'
  },
  consumertopics:['BMS.Data']
};



module.exports = config;
