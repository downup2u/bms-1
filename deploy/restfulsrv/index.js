const srvhttp = require('./src/srvhttp.js');
const srvwebsocket = require('./src/srvws.js');
const srvsystem = require('./src/srvsystem.js');

const config = require('./src/config');
const mongoose     = require('mongoose');

// const utilposition = require('./src/handler/common/util_position');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodburl,{
    useMongoClient: true,
    // This options is 1 second by default, its possible the ha
    // takes longer than 30 seconds to recover.
    reconnectInterval: 5000,
    // This options is 30 by default, why not make it 60
    reconnectTries: Number.MAX_VALUE
  });

console.log(`rooturl:${config.rooturl},mongodburl:${config.mongodburl}`);
console.log(`issmsdebug:${config.issmsdebug}`);
// const getpoint = (v)=>{
//   return [v.Longitude,v.Latitude];
// }
// utilposition.getlist_pos([
//   {
//     "GPSTime" : "2017-11-17 13:24:36",
//     "Longitude" : 110.335736,
//     "Latitude" : 20.041613,
//   },
//   {
//     "GPSTime" : "2017-11-17 13:25:36",
//     "Longitude" : 110.337903,
//     "Latitude" : 20.042343,
//   },
//   {
//     "GPSTime" : "2017-11-17 13:25:36",
//     "Longitude" : 0,
//     "Latitude" : 0,
//   },
// ],getpoint,(err,resultobj)=>{
//   console.log(`获得结果:${JSON.stringify(resultobj)}`);
// });

srvsystem.job();
srvwebsocket.startsrv(srvhttp.startsrv());

process.on('uncaughtException', (err)=> {
    console.log(err);
});
