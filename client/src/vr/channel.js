require('./explosion');

const colors = [
    '#e00b0b',
    '#477bff',
    '#4cff00',
    '#ff8300',
    '#ffffff',
    '#fff951'
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getColor(data) {
    const color = colors[getRandomInt(0, colors.length)];
    return color;
}

module.exports = function (rootOSCServer) {

    AFRAME.registerComponent('channel', {
        schema: {
            id: {
                type: 'int',
                default: 1
            }
        },
        init() {
            const id = this.data.id;
            const el = this.el;
            const sphere = el.querySelector('.sphere');
            const explosion = el.components.explosion;

            rootOSCServer.on(`raw-data:channel-${id}`, (data) => {
                explosion.create({
                    color: getColor(data),
                    matrixWorld: sphere.object3D.matrixWorld
                });
            });
        }
    });

    return function createChannel(parent, id) {
        parent.insertAdjacentHTML('beforeend', `
        <a-entity id="channel-${id}" explosion channel="id: ${id};">
            <a-sphere class="sphere" wireframe radius="0.5" position="${id} 0 -20" color="#bc2f2f" metalness="0.5">
                <a-animation attribute="rotation" to="-360 -360 0" dur="5000" easing="linear" repeat="indefinite">
                </a-animation>
            </a-sphere>
            <a-animation attribute="rotation" to="0 -360 0" dur="10000" easing="linear" repeat="indefinite">
            </a-animation>
        </a-entity>
        `);
    };
};
