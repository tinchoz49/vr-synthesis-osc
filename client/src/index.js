const rootOSCServer = require('./lib/root-osc-server');

rootOSCServer.on('raw-data', data => {
    console.log(data);
});
