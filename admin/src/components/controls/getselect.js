import { fetchJson } from '../../util/fetch.js';
import config from '../../env/config';
import _ from 'lodash';

const getOptions = (resourcename,label,value)=>{
  const url = `${config.admincustomapi}/${resourcename}`;
  const token = localStorage.getItem('admintoken');
  let fields = {};
  fields[label] = 1;
  fields[value] = 1;
  const options = {
    method:'POST',
    headers: new Headers({
     'Accept': 'application/json',
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${token}`
    }),
    body: JSON.stringify({
      query:{},
      fields
    })
  };
  return (input,callback) => {
    fetchJson(url,options).then(({json})=>{
       console.log(json);
       let options = [];
        _.map(json,(v)=>{
          options.push({
            label:v[label],
            value:v[value]
          });
        });
        callback(null, { options: options ,complete: true});
    });
  }
}

export {getOptions};
