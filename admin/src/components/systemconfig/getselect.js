import restClient from '../../restClient.js';
import config from '../../env/config';
import _ from 'lodash';

const getOptions = (input,callback) => {
  restClient('GET_LIST','datadict',{
    // filter:{
    //   name_q:"AL_"
    // },
    pagination:{
      page:1,
      perPage:100
    },
    sort:{
      field:"id",
      order:'DESC'
    }
  }).then((json)=>{
    let options = [];
    if(!!json.data){
      _.map(json.data,(v)=>{
        options.push({
          label:v.showname,
          value:v.name
        });
      });
    }
    callback(null, { options: options ,complete: true});
  });
}

export {getOptions};
