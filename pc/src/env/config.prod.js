let islocalhost = false;
const serverurl = islocalhost?'http://localhost:5011':'http://bmscatl.com28.cn';
const serverurlrestful = islocalhost?`${serverurl}/api`:`${serverurl}/apisrv/api`;
const wspath = islocalhost?'/socket.io':'/apisrv/socket.io';
const organizationid = '599af5dc5f943819f10509e6';
let config = {
    ispopalarm:false,
    serverurlrestful,
    serverurl:`${serverurl}`,
    wspath:`${wspath}`,
    requesttimeout:5000,
    appversion:'1.2.4',
    sendlocationinterval:20000,
    softmode:'pc'
};


export default config;
