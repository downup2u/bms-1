const startrouter = (app)=>{
  require('./upload.js')(app);
  require('./useradmin.js')(app);
  require('./useradmincustom.js')(app);
  require('./m2mgw.js')(app);
};


exports.startrouter = startrouter;
