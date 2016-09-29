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

function updateEmitterColor(emitter, data) {
    const color = getColor(data);
    for (let i = 0; i < 4; i++) {
        emitter.color.value[i].setStyle(color);
    }
    emitter.color.value = emitter.color.value;
}

function updateSettingsColor(particleGroup, data) {
    const color = getColor(data);
    particleGroup._poolCreationSettings.color.value = [new THREE.Color(color)];
}

const pos = new THREE.Vector3();

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
            const particleGroup = el.components['particle-system'].particleGroup;
            particleGroup.removeEmitter(particleGroup.emitters[0]);

            particleGroup.addPool(10, {
                type: 2,
                position: {
                    spread: new THREE.Vector3(3),
                    radius: 1
                },
                velocity: {
                    value: new THREE.Vector3(10)
                },
                size: {
                    value: [5, 0]
                },
                opacity: {
                    value: [1, 0]
                },
                color: {
                    value: [new THREE.Color('white')]
                },
                particleCount: 100,
                duration: 0.10,
                maxAge: {
                    value: 1
                }
            }, false);

            rootOSCServer.on(`raw-data:channel-${id}`, (data) => {
                if (particleGroup._pool.length) {
                    updateEmitterColor(particleGroup._pool[particleGroup._pool.length - 1], data);
                } else {
                    updateSettingsColor(particleGroup, data);
                }
                particleGroup.triggerPoolEmitter(1, pos.setFromMatrixPosition(sphere.object3D.matrixWorld));
            });
        }
    });

    return function createChannel(parent, id) {
        parent.insertAdjacentHTML('beforeend', `
        <a-entity id="channel-${id}" particle-system="texture: images/flare-2.png;" channel="id: ${id};">
            <a-sphere class="sphere" wireframe radius="0.5" position="18 0 ${id}" color="#bc2f2f" metalness="0.5">
            </a-sphere>
            <a-animation attribute="rotation" to="0 -360 0" dur="5000" easing="linear" repeat="indefinite">
            </a-animation>
        </a-entity>
        `);
    };
};
