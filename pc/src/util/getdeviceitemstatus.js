
const getdevicestatus_isonline = (deviceitem)=>{
  return parseInt(deviceitem.DeviceId)%2 === 0;
}

const getdevicestatus_alaramlevel = (deviceitem)=>{
  let warninglevel = '高';
  const deviceidr = parseInt(deviceitem.DeviceId)%3;
  if(deviceidr %3 === 0){
    warninglevel = '高';
  }
  else if(deviceidr %3 === 1){
    warninglevel = '中';
  }
  else{
    warninglevel = '低';
  }
  return warninglevel;
}

export {getdevicestatus_isonline,getdevicestatus_alaramlevel};
