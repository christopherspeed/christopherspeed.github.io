import { Vector3, Quaternion } from "three";
import { Body, Vec3 } from "cannon-es"

class InputControl {
    // IMPORTANT: Input arguments can be updated. Just pass in what ever 
    // you want to modify for any input and set it to a var as below!
    constructor(camera, scene, playerObj, audio){
        this.state = {
            // Put states in here
            gui: 0
        }

        // Be able to interact with camera and scene
        this.camera = camera;
        this.scene = scene;
        this.audio = audio;

        // Locally where is the camera moving towards.
        this.targetLocal = new Vector3();

        // Currently Not Used
        this.rotateLocal = new Quaternion();
        this.rotateFromEquilibrium = new Quaternion();

        // Speed of camera per frame of movement
        this.camSpeed = 0.35;

        // Fraction of step to take towards local position
        this.lerpSpeed = 0.045;

        // Small distance to snap camera to position (instead of lerp)
        this.snap = 1e-7;

        this.subject = playerObj;


        // 0 = not being pressed
        // 0.5 = conflicting key most recently press. 
        // Will become 1 if conflicting key is let go
        // 1 = being pressed
        this.keyMap = {
            w: 0,
            s: 0,
            a: 0,
            d: 0,
            k: 0,
            l: 0,
            arrowup: 0,
            arrowdown: 0,
            arrowleft: 0,
            arrowright: 0,
            shift: 0,
        }

        // Prevent right menu bring up for us poor mac users.
        addEventListener('contextmenu', (e) => {e.preventDefault();})
        
        // function.bind(this) passes the object as context.
        // If someone knows a better way to pass this in lmk
        addEventListener('keyup', keyUpHandle.bind(this));
        addEventListener('keydown', keyDownHandle.bind(this));
        addEventListener('mousemove', mouseMove.bind(this));
    
        // Every frame check all valid keys to see if held down 
        // and update accordingly
        this.update = function(){
            Object.keys(this.keyMap).forEach(handleKeyUpdate.bind(this));
            // Slowly lerp towards target position
            lerpTowardTarget.bind(this)();
        }
    
        // IMPORTANT: Add any functionalities for keypresses here!!!!!
        function handleKeyUpdate(ele){
            // If element not being pressed return.
            ele = ele.toLowerCase();
            // See if key is pressed down
            if(this.keyMap[ele] != 1) return;
            // Do action if key is pressed
            switch(ele){
                case 'w':
                    // this.targetLocal.add(new Vector3(0,0,-this.camSpeed));
                    this.subject.applyLocalImpulse(new Vec3(0, 0, 25))
                    break;
                case 's':
                    // this.targetLocal.add(new Vector3(0,0,this.camSpeed));
                    this.subject.applyLocalImpulse(new Vec3(0, 0, -25))
                    break;
                case 'a':
                    this.subject.applyLocalImpulse(new Vec3(5, 0, 0))
                    break;
                case 'd':
                    this.subject.applyLocalImpulse(new Vec3(-5, 0, 0))
                    break;
                case 'k':
                    if (this.audio.guitar.isPlaying) {
                        this.audio.guitar.pause();
                    } else {
                        this.audio.guitar.play();
                    }
                case 'l':
                    this.audio.beep.play();
                case 'arrowup':
                    break;
                case 'arrowdown':
                    break;
                case 'arrowright':
                    break;
                case 'arrowleft':
                    break;
                case 'shift':
                    this.subject.applyLocalImpulse(new Vec3(0, 0, 5))
                    break
                default:
                    return;
            }
        }

        function mouseMove(ele){
            // 1 for just left, 2 for just right, 1 + 2 for both
            const button = ele.buttons;
            const left = (button & 1 == 1);
            const right = (button & 2 == 2);
            if(right){
                
            }
        }

        // Slowly lerp towards target local position. 
        function lerpTowardTarget(){
            const result = new Vector3();
            if(this.targetLocal.length() < this.snap){
                // If close in distance just snap to position
                result.copy(this.targetLocal);
                this.targetLocal.multiplyScalar(0);
            } else {
                result.lerp(this.targetLocal, this.lerpSpeed);
                this.targetLocal.sub(result);
            }
            this.camera.position.copy(this.camera.localToWorld(result));
        }

        // Check if typing is in textbox or just outside of scope(?).
        // Returns true if you shouldn't process it.
        function checkKeyEvent(event){
            return event.isComposing || event.target.tagName === "INPUT" 
            || event.keyCode === 229;
        }


        /* -------------------------------------------------------------
        Don't really need to worry about what happens below this comment 
        ---------------------------------------------------------------- */


        // For pressed down key changes key map entry to 1.
        // If opposite key already pressed down also changes opposite key to 0.5.
        function keyDownHandle(event){
            if (checkKeyEvent(event)) return;
            const key = event.key.toLowerCase();
            if(this.keyMap[key] == undefined) return;
            this.keyMap[key] = 1;
            switch(key){
                case 'w':
                    if(this.keyMap['s'] == 1) this.keyMap['s'] = 0.5;
                    break;
                case 's':
                    if(this.keyMap['w'] == 1) this.keyMap['w'] = 0.5;
                    break;
                case 'a':
                    if(this.keyMap['d'] == 1) this.keyMap['d'] = 0.5;
                    break;
                case 'd':
                    if(this.keyMap['a'] == 1) this.keyMap['a'] = 0.5;
                    break;
                case 'arrowup':
                    if(this.keyMap['arrowdown'] == 1) this.keyMap['arrowdown'] = 0.5;
                    break;
                case 'arrowdown':
                    if(this.keyMap['arrowup'] == 1) this.keyMap['arrowup'] = 0.5;
                    break;
                case 'arrowright':
                    if(this.keyMap['arrowleft'] == 1) this.keyMap['arrowleft'] = 0.5;
                    break;
                case 'arrowleft':
                    if(this.keyMap['arrowright'] == 1) this.keyMap['arrowright'] = 0.5;
                    break;
                default:
                    return;
            }
        }

        // For let go key changes key map entry to 0.
        // If opposite key still 0.5 (currently pressed down)
        // also changes opposite key to 1.
        function keyUpHandle(event){
            if (checkKeyEvent(event)) return;
            const key = event.key.toLowerCase();
            if(this.keyMap[key] == undefined) return;
            this.keyMap[key] = 0;
            switch(key){
                case 'w':
                    if(this.keyMap['s'] == 0.5) this.keyMap['s'] = 1;
                    break;
                case 's':
                    if(this.keyMap['w'] == 0.5) this.keyMap['w'] = 1;
                    break;
                case 'a':
                    if(this.keyMap['d'] == 0.5) this.keyMap['d'] = 1;
                    break;
                case 'd':
                    if(this.keyMap['a'] == 0.5) this.keyMap['a'] = 1;
                    break;
                case 'arrowup':
                    if(this.keyMap['arrowdown'] == 0.5) this.keyMap['arrowdown'] = 1;
                    break;
                case 'arrowdown':
                    if(this.keyMap['arrowup'] == 0.5) this.keyMap['arrowup'] = 1;
                    break;
                case 'arrowright':
                    if(this.keyMap['arrowleft'] == 0.5) this.keyMap['arrowleft'] = 1;
                    break;
                case 'arrowleft':
                    if(this.keyMap['arrowright'] == 0.5) this.keyMap['arrowright'] = 1;
                    break;
                default:
                    return;
            }
        }
    }

}

export default InputControl;


