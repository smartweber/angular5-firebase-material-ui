"use strict";
//*************************************************************
//
//			REQUIRED EXTERNAL LIBRARIES
//
//*************************************************************
var nodemailer = require("nodemailer");
var config = require("config");
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

    send: function (opts, fn) {

        var mailOpts, smtpTrans;

        try {
            smtpTrans = nodemailer.createTransport(config.Mailer);
        } catch (err) {
            logger.error('Nodemailer could not create Transport' + err)
            if(helper.isFunction(fn)){
                return fn('Nodemailer could not create Transport', null);
            } else {
                return false;
            }            
        }

        // Send mail
        try {
            // mailing options
            mailOpts = {
                from: opts.from,
                to: opts.to,
                subject: opts.subject,
                html: opts.body
            };

            smtpTrans.sendMail(mailOpts, function (err, info) {
                if (err) {
                    logger.error('Nodemailer could not send Mail' + err);
                }
                if(helper.isFunction(fn)){
                    return fn(err, info || "");
                } 
            });
        } catch (err) {
            logger.error('Nodemailer could not send Mail' + err);
            if(helper.isFunction(fn)){
                return fn('Nodemailer could not send Mail', null);
            } else {
                return false;
            }
        }
    }
    
}
