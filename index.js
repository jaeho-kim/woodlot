// Woodlot logging middleware

'use strict';

var woodlotEvents = require('./lib/events').woodlotEvents,
    woodlotInit = require('./lib/initialiser'),
    foregroundYellow = require('./lib/stdoutColors').foregroundYellow,
    underlineText = require('./lib/stdoutColors').underlineText,
    customLogger = require('./lib/customLogger');

// Woodlot entry
function woodlot(config) {
    if(!config || !config.streams) {
        console.log(foregroundYellow('Woodlot warning: Please provide at least one valid file stream to start logging. More info here - ' + underlineText('https://github.com/adpushup/woodlot')));
        return function(req, res, next) { 
            next(); 
        }
    }

    var routeWhitelist = config.routeWhitelist;
    
    config.logToConsole = ('stdOut' in config) ? config.stdOut : true;
    config.logHeaders = (config.format && 'options' in config.format && 'headers' in config.format.options) ? config.format.options.headers : true;
    
    return function(req, res, next) {

        // Create log entry for all valid routes present in 'routeWhitelist' option
        if(typeof routeWhitelist === 'object' && routeWhitelist.length) {
            var foundRoute = routeWhitelist.find(function(element) {
                //return req.url.indexOf(element) !== -1;
                return element === req.url;
            }),
                validLogRoute = foundRoute ? foundRoute : null;

            if(validLogRoute) {
                return woodlotInit(req, res, next, config);
            } else {
                next();
            }
        }
        // Else create log entry for all routes
        else {
            return woodlotInit(req, res, next, config);
        }
    }
};

module.exports = {
    middlewareLogger: woodlot,
    events: woodlotEvents,
    customLogger: customLogger
};

