import {PerspectiveCamera, Vector3} from "three";

class CameraControl extends PerspectiveCamera{
    constructor(){
        super();

        this.state = {
            // Put states in here
            gui: 0
        }

        this.camSpeed = 0.4;
        
        this.keyMap = {
            w: false,
            s: false,
            a: false,
            d: false
        }

        this.position.set(6, 3, -10);
        this.lookAt(new Vector3(0, 0, 0));

        addEventListener('keyup', this.keyUpHandle.bind(this));
        addEventListener('keydown', this.keyDownHandle.bind(this));
    }

    // Check if typing is in textbox or just outside of scope.
    // Returns true if you shouldn't process it.
    static checkEvent(event){
        return event.isComposing || event.target.tagName === "INPUT" || event.keyCode === 229;
    }

    keyDownHandle(event){
        if (CameraControl.checkEvent(event)) return;
        const key = event.key.toLowerCase();
        switch(key){
            case 'w': 
                this.translateZ(-this.camSpeed);
                break;
            case 's':
                this.translateZ(this.camSpeed);
                break;
            default:
                return;
        }
        this.keyMap[key] = true;
        console.log(this.keyMap[key]);
    }

    keyUpHandle(event){
        if (CameraControl.checkEvent(event)) return;
        const key = event.key.toLowerCase();
        if(this.keyMap[key]) this.keyMap[key] = false;
        console.log(this.keyMap[key]);
    }

}

export default CameraControl;


