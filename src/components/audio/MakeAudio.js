import {AudioListener, Audio, AudioLoader} from 'three'

class MakeAudio{
    constructor(camera){
        const guitarMusic = require("./music.mp3").default;;
        const beepSound = require("./censor.mp3").default;

        const listener = new AudioListener();
        camera.add( listener );

        // create a global audio source
        this.guitar = new Audio( listener );

        // load a sound and set it as the Audio object's buffer
        const audioLoader = new AudioLoader();

        const g = this.guitar;
        audioLoader.load( guitarMusic, function( buffer ) {
            g.setBuffer( buffer );
            g.setLoop( true );
            g.setVolume( 0.5 );
            g.setPlaybackRate (1); 
            g.play();
        });

        this.beep = new Audio(listener);

        const be = this.beep;
        const beepLoader = new AudioLoader();
        beepLoader.load(beepSound, function(buffer) {
            be.setBuffer(buffer);
            be.setLoop(false);
            be.setVolume(0.1);
        });

        this.update = function(){
            this.guitar.context.resume();
        };
    }
}


export default MakeAudio;