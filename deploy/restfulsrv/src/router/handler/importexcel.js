const mongoose     = require('mongoose');
const _ = require('lodash');
const DBModels = require('../../db/models.js');

const importexcel = (excelfilepath,callbackfn)=>{
  console.log(`开始导入excel:${excelfilepath}`);
  callbackfn({
    result:'OK',
    list:[
      {
        name:'ff',
        count:8
      },
      {
        name:'bb',
        count:5
      }
    ]
  });
};

module.exports= importexcel;
