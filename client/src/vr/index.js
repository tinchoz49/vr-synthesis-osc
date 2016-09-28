const colors = [
    '#e00b0b',
    '#477bff',
    '#4cff00',
    '#ff8300',
    '#ffffff',
    '#fff951'
];

function clamp(val, min, max) {
    return Math.max(Math.min(val, max), min);
}

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

function updatePosition(emitter, matrixWorld) {
    emitter.position.value.setFromMatrixPosition(matrixWorld);
    emitter.position.value = emitter.position.value;
}

const pos = new THREE.Vector3();

module.exports = (rootOSCServer) => {
    AFRAME.registerComponent('lhc', {
        init() {
            const lhc = this.el;
            const particleGroup = lhc.components['particle-system'].particleGroup;
            particleGroup.removeEmitter(lhc.components['particle-system'].particleGroup.emitters[0]);

            particleGroup.addPool( 10, {
                type: 2,
                position: {
                    spread: new THREE.Vector3(10),
                    radius: 1,
                },
                velocity: {
                    value: new THREE.Vector3( 100 )
                },
                size: {
                    value: [ 10, 0 ]
                },
                opacity: {
                    value: [1, 0]
                },
                color: {
                    value: [new THREE.Color('white')]
                },
                particleCount: 100,
                alive: true,
                duration: 0.05,
                maxAge: {
                    value: 0.5
                }
            }, false);

            rootOSCServer.on('raw-data', (data) => {
                if (particleGroup._pool.length) {
                    updateEmitterColor(particleGroup._pool[particleGroup._pool.length - 1], data);
                } else {
                    updateSettingsColor(particleGroup, data);
                }
                particleGroup.triggerPoolEmitter( 1, pos.setFromMatrixPosition(lhc.object3D.parent.matrixWorld) );
            });
        }
    });
};
