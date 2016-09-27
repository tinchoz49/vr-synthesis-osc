const osc = require('osc');
const EventEmitter2 = require('eventemitter2').EventEmitter2;
const ee = new EventEmitter2();

const port = new osc.WebSocketPort({
    url: `ws://${window.location.hostname}:8081`
});

port.on('message', (oscMessage) => {
    ee.emit('message', oscMessage);
    if (oscMessage.address === '/raw_data') {
        // hay que eliminar la expresion regular porque produce un delay enorme
        ee.emit('raw-data', JSON.parse(oscMessage.args[0]));
    }
});

port.open();

module.exports = ee;
