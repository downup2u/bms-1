let express = require('express');
let app = express();
let path = require('path');
let winston = require('./log/log.js');
let http = require('http').Server(app);
let bodyParser = require("body-parser");
const config = require('./config');
const routerindex = require("./router/index.js");
const upload = require('jquery-file-upload-middleware');
const uuid = require('uuid');
const _  = require('lodash');
const json2xls = require('json2xls');

let startsrv = ()=>{
  // let appdir = path.join(__dirname,config.publishdirapp);
  // console.log("static app:" + appdir);
  // app.use('/app', express.static(appdir));
  //
  // let pcdir = path.join(__dirname,config.publishdirpc);
  // console.log("static pcdir:" + pcdir);
  // app.use('/pc', express.static(pcdir));
  //
  // let testdir = path.join(__dirname,config.publishdirtest);
  // console.log("static test:" + testdir);
  // app.use('/test', express.static(testdir));

  let logdir = path.join(__dirname,config.publishlog);
  console.log("static test:" + logdir);
  app.use('/log', express.static(logdir));

  let admindir = path.join(__dirname,config.publishdiradmin);
  console.log("static admin:" + admindir);
  app.use('/admin', express.static(admindir));

  let uploaddir = path.join(__dirname,'./router',config.uploaddir);
  console.log("static upload:" + uploaddir);
  app.use(config.uploadurl, express.static(uploaddir));


  console.log('uploadurl:' + config.uploadurl);
  console.log('uploaddir:' + uploaddir);


  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(json2xls.middleware);

  app.options("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(200);
  });

  app.use((req, res, next)=> {
      console.log('req.url:' + req.url);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
      next();
  });

  upload.configure({
    uploadDir: uploaddir,
    uploadUrl: config.uploadurl,
    accessControl: {
        allowOrigin: '*',
        allowMethods: 'POST'
    },
    imageVersions: {// apt-get install imagemagick
      thumbnail: {
        width: 300,
        height: 300
      }
    }
  });

  upload.on("begin", (fileInfo)=> {
    let ext = 'jpg';
    let sz = _.split(fileInfo.type, '/');
    if(sz.length > 1){
      ext = sz[sz.length - 1];
    }
    fileInfo.name = `${uuid.v4()}.${ext}`;
    console.log(`开始上传文件:${JSON.stringify(fileInfo)}`);
  });

  upload.on('error', function (e, req, res) {
        console.log(e.message);
    });
  app.use('/uploadavatar',upload.fileHandler());



  routerindex.startrouter(app);

  http.listen(config.listenport, ()=>{
    console.log('listening on *:' + config.listenport);
    winston.initLog();

  });

  return http;
};

exports.startsrv = startsrv;
