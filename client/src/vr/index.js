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

function updateColor(emitter, data) {
    const color = colors[getRandomInt(0, colors.length)];
    for (let i = 0; i < 4; i++) {
        emitter.color.value[i].setStyle(color);
    }
    emitter.color.value = emitter.color.value;
}

function updateVelocity(emitter, data) {
    // inversamente proporcional al events_rate
    let speed = 125 / clamp(data.events_rate, 0.01, 5);
    emitter.velocity.spread.x = speed;
    emitter.velocity.spread = emitter.velocity.spread;
}

module.exports = (rootOSCServer) => {
    AFRAME.registerComponent('lhc', {
        init() {
            const lhc = this.el;
            const emitter = lhc.components['particle-system'].particleGroup.emitters[0];
            emitter.disable();

            rootOSCServer.on('raw-data', (data) => {
                emitter.enable();
                updateVelocity(emitter, data);
                updateColor(emitter, data);
            });
        }
    });
};
