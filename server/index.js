/**
 *  Bi-Directional OSC messaging Websocket <-> UDP
 */

const osc = require('osc');
const WebSocket = require('uws');
const getIPAddresses = require('./lib/ip-addresses');

const udp = new osc.UDPPort({
    localAddress: '0.0.0.0',
    localPort: 50001,
    remoteAddress: '127.0.0.1',
    remotePort: 50000
});

udp.on('ready', () => {
    const ipAddresses = getIPAddresses();
    console.log('Listening for OSC over UDP.');
    ipAddresses.forEach((address) => {
        console.log(' Host:', address + ', Port:', udp.options.localPort);
    });

    udp.send({
        address: '/unsubscribe',
        args: []
    });
    udp.send({
        address: '/subscribe',
        args: []
    });
});

let i = 0;
udp.on('message', () => {
    i++;
    console.log(i);
});
udp.open();

const wss = new WebSocket.Server({
    port: 8081
});

wss.on('connection', (socket) => {
    console.log('A Web Socket connection has been established!');
    const socketPort = new osc.WebSocketPort({
        socket
    });

    const relay = new osc.Relay(udp, socketPort, {
        raw: true
    });
});
