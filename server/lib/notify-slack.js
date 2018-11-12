"use strict";
//*************************************************************
//
//			REQUIRED EXTERNAL LIBRARIES
//
//*************************************************************
var config = require("config");
var Slack = require("slack-node");
var path = require("path");


//*************************************************************
//
//			REQUIRED CUSTOM LIBRARIES
//
//*************************************************************
//helper and logger first
var helper = require("../lib/helper.js");
var logger = helper.setupLogger(__filename); //to override config setting for log level use  var logger = helper.setupLogger(__filename, "TRACE"); //or "DEBUG", "INFO", "WARN", "ERROR"

//*************************************************************
//
//      exports are here
//
//*************************************************************
exports = module.exports = {


    send: function (message, fn) {
        try {
            if ((config.get("Slack")) && (config.get("Slack").enabled)) {

                var url = config.get("Slack").webHookUri;
                
                var message = {
                    channel: config.get("Slack").channel,
                    username: config.get("Slack").username,
                    text: message
                };

                logger.trace("trying to post ", message, " to ", url);

                var slack = new Slack();
                slack.setWebhook(url);
                slack.webhook(message, function (err, response) {
                    if (err) {
                        logger.warn(err);
                    } else {
                        logger.trace("posted ", message, " to ", url);
                    }
                    return true;
                });
            } else {
                logger.warn("No Slack section on the config");
                return false;
            }
        } catch (err) {
            logger.warn("Could not send slack message");                
            return false;
        }
    }

};
