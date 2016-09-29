const osc = require('osc');
const EventEmitter2 = require('eventemitter2').EventEmitter2;
const flyd = require('flyd');
const afterSilence = require('flyd/module/aftersilence');
const ee = new EventEmitter2();

const isTest =  window.location.search === '?demo';
const port = isTest ?
    (() => {
        const that = new EventEmitter2();
        that.open = () => {
            setInterval(() => {
                port.emit('message', {
                    address: '/raw_data',
                    args: [
                        '{"channel": 1, "events_rate": 1}'
                    ]
                });
            }, 1000);
        };
        return that;
    })() :
    new osc.WebSocketPort({
        url: `ws://${window.location.hostname}:8081`
    });

const channels = {};

for (let i = 1; i <= 8; i++) {
    channels[i] = {
        message: flyd.stream(),
        timeout: null
    };
}

port.on('message', (oscMessage) => {
    ee.emit('message', oscMessage);
    const data = JSON.parse(oscMessage.args[0]);

    if (oscMessage.address === '/raw_data') {
        // hay que eliminar la expresion regular porque produce un delay enorme
        ee.emit('raw-data', data);
    }
    ee.emit(`raw-data:channel-${data.channel}`, data);
    const channel$ = channels[data.channel];

    if (!channel$.timeout) {
        ee.emit('channel-added', data.channel);

        ee.on(`raw-data:channel-${data.channel}`, channel$.message);
        channel$.timeout = afterSilence(6000, channel$.message);

        flyd.on(() => {
            channel$.timeout.end(true);
            ee.off(`raw-data:channel-${data.channel}`, channel$.message);
            channel$.timeout = null;
            ee.emit('channel-removed', data.channel);
        }, channel$.timeout);
    }
});

port.open();

module.exports = ee;
