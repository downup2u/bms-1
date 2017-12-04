import config from '../env/config';

const fetchurl =`${config.serverurlrestful}`;

const statusHelper = (response)=> {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

const restfulapi = {
  getexcelfile({type,query}){
    return fetch(`${fetchurl}/${type}`, {
      method  : 'POST',
      headers : {
        'Content-Type'  : 'application/json'
      },
      body    : JSON.stringify(query)
    })
    .then(statusHelper)
    .then(response => response.blob());
  },
  getdevicegeo (userData) {
    return fetch(`${fetchurl}/getdevicegeo`)
    .then(statusHelper)
    .then(response => response.json());
  },
  gethistorytrack (userData) {
    return fetch(`${fetchurl}/gethistorytrack`, {
      method  : 'POST',
      headers : {
        'Accept'        : 'application/json',
        'Content-Type'  : 'application/json'
      },
      body    : JSON.stringify(userData)
    })
    .then(statusHelper)
    .then(response => response.json());
  },
};


export default restfulapi;
