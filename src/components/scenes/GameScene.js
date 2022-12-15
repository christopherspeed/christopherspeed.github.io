import { Color, CylinderGeometry, MeshBasicMaterial, Scene, Vector3 } from 'three'
import { BoxGeometry, SphereGeometry, PlaneGeometry, Mesh, MeshToonMaterial, Object3D, InstancedMesh, TextureLoader } from 'three';
import { BasicLights } from 'lights'
import { Tree } from '../objects/Tree';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ROAD from '../models/road.gltf'
import EDGE from '../models/road_edge.gltf'
import MOUNTAIN from '../models/mountain.gltf'
import { randFloat } from 'three/src/math/MathUtils';


class GameScene extends Scene {
    constructor() {
        super();

        this.background = new Color(0x1b2e4d)
        const lights = new BasicLights();
        this.add(lights);

        this.roads = [];
        this.models = [];
        this.models.push(
            //MOUNTAIN,
            ROAD,
            //EDGE
        );
        const loader = new GLTFLoader();
        const temp = this;
        function loadRoad (gltf) {
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
        
        loader.load(ROAD, loadRoad);

        const tree1 = new Tree();
        tree1.position.add(new Vector3(5, 0, 0))
        const left_trees = []
        const right_trees = []
        for (let i = 0; i < 5; i++){
            left_trees[i] = tree1.clone();
            left_trees[i].position.add(new Vector3(0, 0, 5 * (i + 1)))
        }
        for (let i = 0; i < 5; i++){
            right_trees[i] = left_trees[i].clone();
            left_trees[i].position.add(new Vector3(-10, 0, 0))
        }
        const both_sides_trees = left_trees.concat(right_trees); // a new array w/ refs to both
        const copy_both = [];
        for (let i = 0; i < both_sides_trees.length; i++){
            copy_both[i] = both_sides_trees[i].clone();
        }
        for (let i = 0; i < copy_both.length; i++){
            copy_both[i].position.add(new Vector3(0, 0, 25))
            this.add(copy_both[i])
        }
        for (let i = 0; i < left_trees.length; i++){
            this.add(left_trees[i]);
            this.add(right_trees[i]);
        }

        // more trees
        const moreTrees = []

        for (let i = 0; i < 20; i++){
            moreTrees.push(new Tree());
        }

        for (let i = 0; i < moreTrees.length; i++){
            moreTrees[i].position.add(new Vector3(randFloat(-1, 6), 10, randFloat(-40, 40) + 30));
            this.add(moreTrees[i])
        }

        
        
        
    }

    update(carPos) {
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if(child.name == 'tree') {
                this.children[i].update(carPos);
            }
        }

    }
}

export default GameScene;