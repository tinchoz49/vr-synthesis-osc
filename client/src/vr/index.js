require('./components/wireframe');

module.exports = (rootOSCServer) => {
    const createChannel = require('./channel')(rootOSCServer);

    AFRAME.registerComponent('channels', {
        init() {
            const el = this.el;
            rootOSCServer.on('channel-added', (id) => {
                createChannel(el, id);
            });

            rootOSCServer.on('channel-removed', (id) => {
                el.removeChild(el.querySelector(`#channel-${id}`));
            });
        }
    });
};
