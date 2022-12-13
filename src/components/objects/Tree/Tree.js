import {Group, Color, MeshToonMaterial, Texture} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './tree.gltf';
const pineURL = require("pine.jpg").defaut;

class Tree extends Group {
    constructor(color){
        // Call parent Group() constructor
        super()
        
        // Load texture
        const texture = new

        // Load object
        const loader = new GLTFLoader();
        let object;
        this.name = 'tree';
        let meshes = []
        loader.load(MODEL, (gltf) => {
            let object = gltf.scene;
            gltf.scene.traverse(e => e.isMesh && meshes.push(e) )
            meshes[0].material = new MeshToonMaterial({color: new Color(0x6E4400)})
            meshes[1].material = new MeshToonMaterial({color: new Color(0x082909)})
            this.add(gltf.scene)
        });
        
        
        
    }

}

export default Tree;