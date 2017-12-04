let islocalhost = false;
const serverurl = islocalhost?'http://localhost:5011':'http://bmscatl.com28.cn';
const wspath = islocalhost?'/socket.io':'/apisrv/socket.io';
const organizationid = '599af5dc5f943819f10509e6';
let config = {
    serverurl:`${serverurl}`,
    wspath:`${wspath}`,
    requesttimeout:5000,
    appversion:'1.1.0',
    sendlocationinterval:20000,
    softmode:'app'
};


export default config;
