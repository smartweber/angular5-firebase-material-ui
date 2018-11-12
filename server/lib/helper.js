"use strict";
//*************************************************************
//
//			REQUIRED EXTERNAL LIBRARIES
//
//*************************************************************
var config = require("config");
var log4js = require("log4js");
var async = require("async");
var path = require("path");
var _ = require("lodash");


//set up own logger
var _module = path.basename(__filename, path.extname(__filename) ),
    _config = config.get("Logger");
log4js.configure(_config);
var _logger = log4js.getLogger(_module); 
console.log("Loading module: " + _module + Array(20-_module.length).join(' ') + "\t logging level: " + _logger.level);  
             


//*************************************************************
//
//      exports are here
//
//*************************************************************
exports = module.exports = { 

    setupLogger: function (fileName){

        var moduleName = path.basename(fileName, path.extname(fileName) ),
            loggerConfig = config.get("Logger");
        
        log4js.configure(loggerConfig);
        var returnLogger = log4js.getLogger(moduleName);        
        console.log("Loading module: " + moduleName + Array(20-moduleName.length).join(' ') + "\t logging level: " + returnLogger.level);  
        return returnLogger;     

    },


    parseBoolean: function(val, def) {
        var out = def || false;

        if(_.isBoolean(val) && val == true){
            out = true;
        }
        else if(_.isString(val) && _.lowerCase(val) === "true"){
            out = true;
        }
        else if(_.isNumber(val) && val != 0){
            out = true;
        };

        //potentially use _.isMatchWith OR
        //potentially use solution proposed in https://github.com/lodash/lodash/issues/2703
        //as a jsfiddle https://jsfiddle.net/greenpioneer/4y744xyd/

        return out;

    },

    isFunction: function(object) {
        //from https://jsperf.com/alternative-isfunction-implementations
        return !!(object && object.constructor && object.call && object.apply);
       }

} 

