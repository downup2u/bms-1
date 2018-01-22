let islocalhost = false;
let serverurl = islocalhost?'http://localhost:5011':'http://bmscatl.com28.cn/apisrv';
const organizationid = '599af5dc5f943819f10509e6';
export default {
    restserverurl:`${serverurl}/adminapi/v1/${organizationid}`,
    adminauthserverurl:`${serverurl}/adminauth/v1/${organizationid}`,
    admincustomapi:`${serverurl}/admincustomapi/v1/${organizationid}`,
    serverurl:`${serverurl}`,
    appversion:'1.2.4'
};
