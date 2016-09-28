/*

//  I will try to port this SC synth to flocking.js

SynthDef(\bass,{arg out=0, freq=120,amp=1, noise=0, pan=0;
	var sig = (
		SinOsc.ar(freq*(1+noise))
		+ SinOsc.ar(if((noise>0),Pulse.ar(2,0.5),0)*freq/2)
	);
	Out.ar(out,Pan2.ar((sig*amp),pan));
});

// and this is the pattern to be ported

Pmono(\bass,
				\dur,Pxrand((1/4!8)++(1/8!4),4),
				\freq, 150,
				\noise, {[-1,-0.5,0,0.25,0.5,0.75,1].choose},
				\pan,{rrand(-1,1)},
				\amp,0.5

			).play;


SynthDef(\bass,
  {arg freq=120, amp=1, noise=0, pan=0;
	var sig = (
		SinOsc.ar(freq*(1+noise))
		+
    SinOsc.ar(if((noise>0),Pulse.ar(2,0.5),0)*freq/2)
	);
	Out.ar(out,Pan2.ar((sig*amp),pan));
});

*/


let started = false;
let environment = flock.init();

window.onunload = () => {
    environment.stop();
};

let s1 = flock.synth({
    synthDef: {
        ugen: 'flock.ugen.filter.moog',
        cutoff: {
            ugen: 'flock.ugen.sinOsc',
            freq: 1 / 4,
            mul: 5000,
            add: 8000
        },
        resonance: {
            ugen: 'flock.ugen.sinOsc',
            freq: 1 / 4,
            mul: 1.0,
            add: 1.0
        },
        source: {
            ugen: 'flock.ugen.sum',
            sources: [{
                id: 'square',
                ugen: 'flock.ugen.square',
                freq: {
                    id: 'squareSeq',
                    ugen: 'flock.ugen.sequence',
                    freq: 6,
                    loop: 1,
                    list: [107, 110 * 5 / 4, 110, 110 * 3 / 2, 110 * 4 / 3, 110]
                }

            }, {
                id: 'saw',
                ugen: 'flock.ugen.lfSaw',
                freq: {
                    id: 'sawSeq',
                    ugen: 'flock.ugen.sequence',
                    freq: 16,
                    loop: 1,
                    list: [55, 54, 55, 54, 54 * 2, 54 * 3 / 2]
                }
            }],
            mul: {
                id: 'env',
                ugen: 'flock.ugen.envGen',
                envelope: {
                    type: 'flock.envelope.adsr',
                    attack: 0.1,
                    decay: 0.1,
                    sustain: 0.5,
                    release: 0.1
                },
                gate: 0.0
            }
        }
    },
    addToEnvironment: false
});


module.exports = (rootOSCServer) => {


    rootOSCServer.on('raw-data', (data) => {
        if (!started) {
            started = true;
            environment.start();
            environment.head(s1);
        }

        s1.set('env.gate', 1);
        s1.set('squareSeq.freq', 10 / data.events_rate);
        s1.set('sawSeq.freq', 10 / data.events_rate);
        environment.asyncScheduler.once(data.events_rate * 0.75, () => {
            s1.set('env.gate', 0);
        });

    });
};
