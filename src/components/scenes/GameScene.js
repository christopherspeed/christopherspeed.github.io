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
        

        // manually place trees for MVP
        const trees = [];
        for (let i = 0; i < 20; i++) {
            trees.push(new Tree());
        }
        trees[0].position.add(new Vector3(20, 10.1, 44));
        trees[1].position.add(new Vector3(30, 11.3, 42));
        trees[2].position.add(new Vector3(33, 13.2, 40));
        trees[3].position.add(new Vector3(25, 11.6, 42));
        trees[4].position.add(new Vector3(40, 16, 30));
        trees[5].position.add(new Vector3(48, 18, 10));
        trees[6].position.add(new Vector3(52, 18, 14));
        trees[7].position.add(new Vector3(41, 17, 17));
        trees[8].position.add(new Vector3(37, 23, 14));
        trees[9].position.add(new Vector3(30, 23, 12));
        
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