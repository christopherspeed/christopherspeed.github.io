import {Group, Color, MeshToonMaterial, TextureLoader, Vector3} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './tree.gltf';
const pineURL = require("./pine.png").default;
const texture = new TextureLoader().load(pineURL);
const texMaterial = new MeshToonMaterial({map: texture});

class Tree extends Group {
    constructor(parent){
        // Call parent Group() constructor
        super();
    



        // Load object
        const loader = new GLTFLoader();
        loader.load(MODEL, (gltf) => {
            gltf.scene.traverse(function(child) {
                if(child.isMesh) {
                    if(child.name == "Cylinder001_1") {
                        child.material = texMaterial;
                    } else {
                        child.material = new MeshToonMaterial({color:0x4f2f2f});
                    }
                }
            })
            this.add(gltf.scene);
        });
        
        
        
    }

    update(position) {
        let dist = new Vector3().subVectors(position, this.position);
        const loader = new GLTFLoader();
        loader.load(MODEL, (gltf) => {
            if (dist.length() > 20) {
                this.material = new MeshToonMaterial({color:0x4f2f2f});
            } else {
                this.material = texMaterial;
            }
        });
    }

}

export default Tree;