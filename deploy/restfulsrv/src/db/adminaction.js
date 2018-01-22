const DBModels = require('../db/models.js');
const jpush = require('../smspush/push.js');
const pwd = require('../util/pwd');
const moment = require('moment');

const preaction =(actionname,collectionname,doc,fnresult)=>{
  //console.log(`preaction doc:${JSON.stringify(doc)}`);
  if(actionname === 'save' && collectionname === 'user'){
    //新建用户,hashpassword
    let retdoc = doc;
    retdoc.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
    let passwordsalt = pwd.getsalt();
    pwd.hashPassword(retdoc.password,passwordsalt,(err,passwordhash)=>{
      retdoc.passwordsalt = passwordsalt;
      retdoc.passwordhash = passwordhash;
      fnresult(null,true);
    });
    return;
  }
  if(actionname === 'findByIdAndUpdate' && collectionname === 'device'){
    let retdoc = doc;
    retdoc.UpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');
  }
  fnresult(null,true);
};

const postaction =(actionname,collectionname,doc)=>{

};

exports.preaction = preaction;
exports.postaction = postaction;
