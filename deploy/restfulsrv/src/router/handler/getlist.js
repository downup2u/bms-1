const mongoose     = require('mongoose');
const _ = require('lodash');
const getquery = require('./getquery.js');

const getlist = (schmodel)=>{
  return (req,res)=>{
    const organizationid = mongoose.Types.ObjectId(req.params.organizationid);
    const dbModel = mongoose.model(schmodel.collectionname, schmodel.schema);
    let query = _.get(req,'body.query',{});
    let fields = _.get(req,'body.fields',{});
    query['organizationid'] = organizationid;
    getquery(req.userid,schmodel.collectionname,query,(querynew)=>{
        const queryexec = dbModel.find(querynew).select(fields);
        queryexec.exec((err,result)=>{
          res.status(200)
              .json(result);
        });
      });
  };
};

module.exports= getlist;
