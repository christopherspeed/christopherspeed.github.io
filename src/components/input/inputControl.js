import { Vector3, Quaternion } from "three";
import { Body, Vec3 } from "cannon-es"

class InputControl {
    // IMPORTANT: Input arguments can be updated. Just pass in what ever 
    // you want to modify for any input and set it to a var as below!
    constructor(camera, scene, playerObj, playerMesh, audio, hud){
        this.state = {
            // Put states in here
            gui: 0
        }

        //HUD stuff
        this.w = false;
        this.a = false;
        this.s = false;
        this.d = false;

        // Be able to interact with camera and scene
        this.camera = camera;
        this.scene = scene;
        this.audio = audio;
        this.hud = hud;

        // Currently Not Used
        this.rotateAngleLR = 0; // Left right angle
        this.rotateAngleUD = 0; // Up down angle

        this.currentLookAt = new Vector3();

        this.rotateVar = {
            lerpSpeed: 0.045,
            // Small distance to snap camera to position (instead of lerp)
            snap: 1e-7,
            boundLR: 9 * Math.PI / 16,
            boundUD: Math.PI / 2,
            scale: 0.005
        }
 


        this.subject = playerObj;
        this.subjectMesh = playerMesh;


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

            this.camera.position.copy(this.subjectMesh.position);
            lerpTowardTarget.bind(this)();

            hud.update(this.w, this.a, this.s, this.d)

        }

        this.clamp = function(scalar, min, max){
            return Math.max(Math.min(scalar, max), min);
        }
    
        // IMPORTANT: Add any functionalities for keypresses here!!!!!
        function handleKeyUpdate(ele){
            // If element not being pressed return.
            ele = ele.toLowerCase();
            // See if key is pressed down
            if(this.keyMap[ele] != 1) return;
            // Do action if key is pressed
            const p = this.subject.param;
            const v = this.subject.vehicle

            /* Vehicle controls from rigid vehicle xample:
           https://github.com/pmndrs/cannon-es/blob/master/examples/rigid_vehicle.html
            */

            switch(ele){
                case 'w':
                    // this.targetLocal.add(new Vector3(0,0,-this.camSpeed));
                    v.applyWheelForce(p.maxForce, 2)
                    v.applyWheelForce(-p.maxForce, 3)
                    
                    break;
                case 's':
                    // this.targetLocal.add(new Vector3(0,0,this.camSpeed));

                    v.applyWheelForce(-p.maxForce, 2)
                    v.applyWheelForce(p.maxForce, 3)

                    break;
                case 'a':
                 
                    break;
                case 'd':
                    
                    break;
                case 'arrowup':
                    break;
                case 'arrowdown':
                    break;
                case 'arrowright':
                    break;
                case 'arrowleft':
                    break;
                case 'shift':
                    v.chassisBody.applyImpulse(new Vec3(0, p.maxForce/2, 0));
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
            const param = this.rotateVar;
            this.rotateAngleLR = (0.5 - ele.clientX / window.innerWidth) * param.boundLR
            this.rotateAngleUD = (0.5 - ele.clientY / window.innerHeight- 0.5)  * param.boundUD
        }

        function calculateTarget(lrAngle, udAngle){
            const target1 = new Vector3(Math.sin(lrAngle) , 0, Math.cos(lrAngle));
            const target2 = new Vector3(0, Math.sin(udAngle), Math.cos(udAngle));
            return target1.add(target2).divideScalar(2).normalize().applyAxisAngle(new Vector3(0,1,0), -Math.PI/2);
        }

        // Slowly lerp towards target local position. 
        function lerpTowardTarget(){

            const target = calculateTarget(this.rotateAngleLR, this.rotateAngleUD);
            const result = new Vector3().copy(this.currentLookAt);
            const param = this.rotateVar;
            
            if(this.currentLookAt.distanceTo(target) < param.snap){
                // If close in distance just snap to position
                result.copy(this.currentLookAt);
            } else {
                result.lerp(target, param.lerpSpeed);
            }
            this.currentLookAt.copy(result);
            this.camera.lookAt(this.subjectMesh.localToWorld(result));
            
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
                    this.w = true;
                    break;
                case 's':
                    if(this.keyMap['w'] == 1) this.keyMap['w'] = 0.5;
                    this.s = true;
                    break;
                case 'a':
                    if(this.keyMap['d'] == 1) this.keyMap['d'] = 0.5;
                    this.subject.vehicle.setSteeringValue(this.subject.param.maxSteerVal, 0)
                    this.subject.vehicle.setSteeringValue(this.subject.param.maxSteerVal, 1)
                    this.a = true;
                    break;
                case 'd':
                    if(this.keyMap['a'] == 1) this.keyMap['a'] = 0.5;
                    this.subject.vehicle.setSteeringValue(-this.subject.param.maxSteerVal, 0)
                    this.subject.vehicle.setSteeringValue(-this.subject.param.maxSteerVal, 1)
                    this.d = true;
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
                case 'k':
                    console.log(this.audio.bg);
                    if (this.audio.bg.isPlaying) {
                        this.audio.bg.pause();
                    } else {
                        this.audio.bg.play();
                    }
                    break;
                case 'l':
                    this.audio.beep.play();
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
                    this.w = false;
                    break;
                case 's':
                    if(this.keyMap['w'] == 0.5) this.keyMap['w'] = 1;
                    this.s = false;
                    break;
                case 'a':
                    if(this.keyMap['d'] == 0.5) this.keyMap['d'] = 1;
                    this.subject.vehicle.setSteeringValue(0, 0)
                    this.subject.vehicle.setSteeringValue(0, 1)
                    this.a = false;
                    break;
                case 'd':
                    if(this.keyMap['a'] == 0.5) this.keyMap['a'] = 1;
                    this.subject.vehicle.setSteeringValue(0, 0)
                    this.subject.vehicle.setSteeringValue(0, 1)
                    this.d = false;
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


