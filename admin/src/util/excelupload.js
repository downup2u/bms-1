import {requestpostdatawithtoken} from '../util/util.js';

export const excelupload = (fileobj,usertoken,callbackfn)=>{
  let file = fileobj;
  console.log('onChange call setimage:' + file.filename);
  const reader = new FileReader();
  reader.onload = () => {
    const bin = atob(reader.result.replace(/^.*,/, ''));
    const buffer = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      buffer[i] = bin.charCodeAt(i);
    }
    const excel = new Blob([buffer.buffer], {
      type: 'application/vnd.ms-excel',
    });

    const data = new FormData();

    data.append('file', excel);
    requestpostdatawithtoken('/excelupload',usertoken,data,(issuc,result)=>{
        console.log("issuc:" + issuc);
        console.log("result:" + JSON.stringify(result));
        callbackfn(issuc,result);
    });

  };
  reader.readAsDataURL(file);
}
