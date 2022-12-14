import {Group, Color, MeshToonMaterial, TextureLoader, Vector3} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TreeMODEL from './tree.gltf';
import FlowerMODEL from './flower.gltf';
const pineURL = require("./pine.png").default;
const texture = new TextureLoader().load(pineURL);
const texMaterial = new MeshToonMaterial({map: texture});

class Tree extends Group {
    constructor(parent){
        // Call parent Group() constructor
        super();
    
        this.tree = undefined;
        this.flower = undefined;


        // Load object
        const loader = new GLTFLoader();
        const temp = this;
        function loadTree (gltf) {
            gltf.scene.traverse(function(child) {
                if(child.isMesh) {
                    if(child.name == "Cylinder001_1") {
                        child.material = texMaterial;
                    } else {
                        child.material = new MeshToonMaterial({color:0x4f2f2f});
                    }
                }
            })
            temp.tree = gltf.scene;
            temp.add(gltf.scene);
            
        }

        loader.load(TreeMODEL, loadTree);

        function loadFlower(gtlf) {
            temp.flower = gtlf.scene;
            temp.add(gtlf.scene);
        }
        
        loader.load(FlowerMODEL, loadFlower);
        

        
        
        
    }

    update(position) {
        let dist = new Vector3().subVectors(position, this.position);
        
        if(this.tree != undefined && this.flower != undefined) {
            
            if(this.tree.isObject3D && this.flower.isObject3D) {
                if (dist.length() > 20) {
                    this.tree.visible = false;
                    this.flower.visible = true;
                } else {
                    this.tree.visible = true;
                    this.flower.visible = false;
                }
            }
        }
        
    }

}

export default Tree;