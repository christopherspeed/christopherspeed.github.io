import {Group, Color, MeshToonMaterial, TextureLoader, Vector3} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TreeMODEL from './tree.gltf';
import LowResTreeMODEL from './tree_low_poly.gltf';
const pineURL = require("./pine.png").default;
const texture = new TextureLoader().load(pineURL);
const texMaterial = new MeshToonMaterial({map: texture});

class Tree extends Group {
    constructor(x, y, z){
        // Call parent Group() constructor
        super();
    
        this.tree = undefined;
        this.lowrestree = undefined;
        this.name = "tree";

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
        

        function loadLowResTree (gltf) {
            gltf.scene.traverse(function(child) {
                if(child.isMesh) {
                    if(child.name == "Cylinder001_1") {
                        child.material = texMaterial;
                    } else {
                        child.material = new MeshToonMaterial({color:0x114312});
                    }
                }
            })
            temp.lowrestree = gltf.scene;
            temp.add(gltf.scene);
            
        }
        
        loader.load(LowResTreeMODEL, loadLowResTree);
        
        

        
        
        
    }

    update(position) {
        let dist = new Vector3().subVectors(position, this.position);
        
        if(this.tree != undefined && this.lowrestree != undefined) {
            
            if(this.tree.isObject3D && this.lowrestree.isObject3D) {
                if (dist.length() > 40) {
                    this.tree.visible = false;
                    this.lowrestree.visible = true;
                } else {
                    this.tree.visible = true;
                    this.lowrestree.visible = false;
                }
            }
        }
        
    }

}

export default Tree;