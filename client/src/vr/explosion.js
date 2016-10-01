const SPE = require('shader-particle-engine');
const raf = require('raf');
const pos = new THREE.Vector3();

function updateColor(particleGroup, color) {
    if (particleGroup._pool.length) {
        const emitter = particleGroup._pool[particleGroup._pool.length - 1];
        for (let i = 0; i < 4; i++) {
            emitter.color.value[i].setStyle(color);
        }
        emitter.color.value = emitter.color.value;
    }
    particleGroup._poolCreationSettings.color.value = [new THREE.Color(color)];
}

function trigger(options) {
    if (this.lastColor !== options.color) {
        updateColor(this.particleGroup, options.color);
        this.lastColor = options.color;
    }
    this.particleGroup.triggerPoolEmitter( 1, pos.setFromMatrixPosition(options.matrixWorld) );
}

AFRAME.registerComponent('explosion', {
    schema: {},
    init() {
        this.emitterSettings = {
            type: SPE.distributions.SPHERE,
            position: {
                spread: new THREE.Vector3(3),
                radius: 1
            },
            velocity: {
                value: new THREE.Vector3( 10 )
            },
            size: {
                value: [ 30, 0 ]
            },
            opacity: {
                value: [1, 0]
            },
            color: {
                value: [new THREE.Color('yellow')]
            },
            particleCount: 100,
            alive: true,
            duration: 0.10,
            maxAge: {
                value: 1
            }
        };
    },
    update() {
        this.clock = new THREE.Clock();
        this.lastColor = 'yellow';

        this.particleGroup = new SPE.Group({
            texture: {
                value: THREE.ImageUtils.loadTexture('./images/flare-2.png')
            },
            blending: THREE.AdditiveBlending
        });

        this.particleGroup.addPool( 10, this.emitterSettings, false );

        this.el.sceneEl.object3D.add(this.particleGroup.mesh);

        this.create = (options) => {
            raf(() => trigger.call(this, options));
        };
    },
    tick() {
        this.particleGroup.tick(this.clock.getDelta());
    }
});
