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
            MOUNTAIN,
            ROAD,
            EDGE
        );
        

        
        const trees = [];
        for (let i = 0; i < 4; i++) {
            trees.push(new Tree());
        }
        trees[0].position.add(new Vector3(20, 10.1, 44));
        trees[1].position.add(new Vector3(30, 11.3, 42));
        trees[2].position.add(new Vector3(33, 13.2, 40));
        trees[3].position.add(new Vector3(25, 11.6, 42));
        
        for (let i = 0; i < trees.length; i++) {
            this.add(trees[i]);
        }

        // more trees
        const moreTrees = []

        for (let i = 0; i < 15; i++){
            moreTrees.push(new Tree());
        }

        for (let i = 0; i < moreTrees.length; i++){
            moreTrees[i].position.add(new Vector3(randFloat(-1, 6), 10.1, randFloat(0, 40) + 50));
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