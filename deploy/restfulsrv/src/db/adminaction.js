const DBModels = require('../db/models.js');
const jpush = require('../smspush/push.js');
const pwd = require('../util/pwd');

const preaction =(actionname,collectionname,doc,fnresult)=>{
  //console.log(`preaction doc:${JSON.stringify(doc)}`);
  if(actionname === 'save' && collectionname === 'user'){
    //新建用户,hashpassword
    let retdoc = doc;
    let passwordsalt = pwd.getsalt();
    pwd.hashPassword(retdoc.password,passwordsalt,(err,passwordhash)=>{
      retdoc.passwordsalt = passwordsalt;
      retdoc.passwordhash = passwordhash;
      fnresult(null,true);
    });
    return;
  }
  fnresult(null,true);
};

const postaction =(actionname,collectionname,doc)=>{

};

exports.preaction = preaction;
exports.postaction = postaction;
