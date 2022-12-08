import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './land.gltf';

class carInterior extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        this.name = 'carInterior';
        
        // Add all necessary geometry elements
        const geo = new THREE.CylinderGeometry(5,5,20,32);
        const mat = new THREE.MeshBasicMaterial({color:0xfff00});
        const cylinder = new THREE.Mesh(geo, mat);
        this.add(cylinder);

    }
}

export default Land;