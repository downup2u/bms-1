const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;
const _ = require('lodash');
const async = require('async');

const OsmgeoSchema = new Schema({
}, { strict: false, collection: 'geo_osm' });

const OsmgeoModel = mongoose.model('geo_osm',  OsmgeoSchema );

const getpostion_frompos = (point,callback)=>{
  if(point[0] === 0){
    callback({
      'Provice':'未知',
      'City':'未知',
      'Area':'未知',
    });
    return;
  }
  let dbModel = OsmgeoModel;
  dbModel.aggregate(  [
      {
          $match: {
              'geometry': {
                  $geoIntersects: {
                      $geometry: {
                          "type": "Point",
                          "coordinates": point
                      }
                  }
              }
          }
      },
      {
          $project: {
              name: '$properties.name:zh',
              admin_level: '$properties.admin_level',

          }
      },
      {
          $group: {
              _id: "$name",
              admin_level: {
                  $first: "$admin_level"
              }
          }
      },
      {
          $sort: {
              "admin_level": 1
          }
      }
  ],
  (err, result)=> {
    let resultobj = {
      'Provice':'未知',
      'City':'未知',
      'Area':'未知',
    };
    if(!err && !!result){
      //[{"_id":"广西壮族自治区","admin_level":"4"},{"_id":"柳州市","admin_level":"5"},{"_id":"城中区","admin_level":"6"}]
      // //console.log(`result=>${JSON.stringify(result)}`);
      _.map(result,(v)=>{
        if(_.get(v,'admin_level','') === '4'){
          resultobj['Provice'] = _.get(v,'_id','未知');
        }
        else if(_.get(v,'admin_level','') === '5'){
          resultobj['City'] = _.get(v,'_id','未知');
        }
        else if(_.get(v,'admin_level','') === '6'){
          resultobj['Area'] = _.get(v,'_id','未知');
        }
      });
    }

    callback(resultobj);
  });
}

const getlist_pos = (list,fngetpoint,callback)=>{
  let asyncfnsz = [];
  _.map(list,(v)=>{
    const fn = (callback)=>{
      if(!v.Provice){
        const point = fngetpoint(v);
        //console.log(`call:${JSON.stringify(point)}`)
        getpostion_frompos(point,(retobj)=>{
          const newitem = _.merge(v,retobj);
          //console.log(`retobj:${JSON.stringify(retobj)}`)
          //console.log(`newitem:${JSON.stringify(newitem)}`)
          callback(null,newitem);
        });
      }
      else{
        callback(null,v);
      }

    }
    asyncfnsz.push(fn);
  });
  async.parallel(asyncfnsz,callback);

}

exports.getpostion_frompos = getpostion_frompos;
exports.getlist_pos = getlist_pos;
