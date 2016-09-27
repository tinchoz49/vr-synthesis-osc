const osc = require('osc');

const port = new osc.WebSocketPort({
    url: 'ws://localhost:8081'
});

let _onMessage = () => {};
let _onRawData = () => {};

port.on('message', (oscMessage) => {
    _onMessage(oscMessage);

    if (oscMessage.address === '/raw_data') {
        _onRawData(
            JSON.parse(oscMessage.args[0].replace(/(\"lep_E\":[0-9\.\-]*)(,)/g, '$1'))
        );
    }
});

port.open();

module.exports = {
    onMessage(cb) {
        _onMessage = cb;
    },
    onRawData(cb) {
        _onRawData = cb;
    }
};
