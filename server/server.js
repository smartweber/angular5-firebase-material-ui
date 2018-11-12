"use strict";

//(optional) point at the config directory to match loopbacks
const path = require("path");
process.env["NODE_CONFIG_DIR"] = __dirname;

//*************************************************************
//
//			OUR OPTIONAL REQUIRED LIBRARIES
//
//*************************************************************
const config = require('config')
const helper = require('./lib/helper.js');
const logger = helper.setupLogger(__filename); //to override config setting for log level use  var logger = helper.setupLogger(__filename, "TRACE"); //or "DEBUG", "INFO", "WARN", "ERROR"
const slack = require("./lib/notify-slack.js");
const service = config.get('Service');
//end of our optional libraries


//basic expressJs
const express = require('express')
const app = express()
const distFOLDER = path.join(process.cwd(), 'dist');

// this is just for logging requests (optional)
// app.use(function (req, res, next) {
//     var filename = path.basename(req.url);
//     var extension = path.extname(filename);
//     logger.trace("The file " + filename + " was requested.");
//     next();
// });
// end of optional logging


//basic expressJs
if(service.logEveryRequest){
    app.use(function(request, response, next)
        {
            logger.info('%s : %s %s', request.ip, request.method, request.url);
            next();
        }
    );
};

// Angular DIST output folder
app.use(express.static(distFOLDER));

// Send all other requests to the Angular app
app.get('*',function (req, res) {
    res.sendFile(path.join(distFOLDER, 'index.html'));
});

app.listen(service.port, () => {
    //the following is basic config, but commented because logger is better. use of logger is optional
    //console.log('listening on port XXX')

    //(optional) the following is our own logging and notifications
    logger.info(service.appName, ' is listening on port ', service.port)
    // mailer.send(             
    //     {
    //         from: service.emailFrom,
    //         to: service.emailToOperator,
    //         subject: service.appName + ' is listening on port ' + service.port,
    //         body: service.appName + ' is listening on port ' + service.port
    //     }) ;
    var message = 'The instance of the portal (' + service.appName + ') is accessible at ' + service.protocol + service.hostName + ':' + service.port;
    if(service.hostName !== service.loadBalancerHostName || service.port !== service.loadBalancerPort ){
        message = message + ' or through the load balancer at ' + service.loadBalancerProtocol + service.loadBalancerHostName 
                        + ((service.loadBalancerPort == 443 && service.loadBalancerProtocol == 'https://') ? '' : ':' + service.loadBalancerPort);
    }
    slack.send(message, function(e,r){return true}); 
    //end of our logging and notification  
});



if(service.redirectListenerPort && service.redirectHttps ){
    var http = require('http');
    http.createServer(function (req, res) {
        var hostName = req.headers.host.split(':')[0];
        var targetPort = (service.redirectTargetPort && service.redirectTargetPort.length > 0) ? service.redirectTargetPort + ":" :"";
        logger.info('GET http://' + req.headers['host'] + req.url);
        res.writeHead(301, { 'Location': 'https://' + hostName + targetPort + req.url });
        //res.writeHead(302, { 'Location': 'https://' + hostName + targetPort + req.url });
        res.end();
    }).listen(service.redirectListenerPort);
};

