import { Group, SpotLight, AmbientLight, HemisphereLight } from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        const dir = new SpotLight(0xffffff, 0.6, 7, 0.8, 1, 1);
        const ambi = new AmbientLight(0x404040, 0.32);
        const hemi = new HemisphereLight(0xffffbb, 0x080820, 0.7);


        this.add(hemi, dir);
    }
}

export default BasicLights;
