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

function updateColor(emitter, data) {
    const color = colors[getRandomInt(0, colors.length)];
    for (let i = 0; i < 4; i++) {
        emitter.color.value[i].setStyle(color);
    }
    emitter.color.value = emitter.color.value;
}

function updateVelocity(emitter, data) {
    let speed = 150;
    // todavia no se como armar una ecuacion inversamente proporcional al events_rate
    if (data.events_rate <= 0.2) {
        speed = 400;
    } else if (data.events_rate <= 0.5) {
        speed = 350;
    } else if (data.events_rate <= 0.8) {
        speed = 300;
    } else if (data.events_rate <= 1) {
        speed = 150;
    } else if (data.events_rate <= 2) {
        speed = 100;
    } else if (data.events_rate <= 3) {
        speed = 50;
    } else if (data.events_rate <= 4) {
        speed = 25;
    } else {
        speed = 10;
    }
    emitter.velocity.spread.x = speed;
    emitter.velocity.spread = emitter.velocity.spread;
}

function updatePosition(emitter, matrixWorld) {
    emitter.position.value.setFromMatrixPosition(matrixWorld);
    emitter.position.value = emitter.position.value;
}

module.exports = (rootOSCServer) => {
    AFRAME.registerComponent('lhc', {
        init() {
            const lhc = this.el;
            const emitter = lhc.components['particle-system'].particleGroup.emitters[0];
            //emitter.disable();

            rootOSCServer.on('raw-data', (data) => {
                updateVelocity(emitter, data);
                updateColor(emitter, data);
                emitter.enable();
            });
        },
        tick() {
            const lhc = this.el;
            const emitter = lhc.components['particle-system'].particleGroup.emitters[0];
            updatePosition(emitter, lhc.object3D.parent.matrixWorld);
        }
    });
};
