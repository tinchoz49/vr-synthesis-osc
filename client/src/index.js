const rootOSCServer = require('./lib/root-osc-server');

rootOSCServer.onRawData(data => {
    console.log(data);
});
