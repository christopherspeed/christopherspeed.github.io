import { Color, CylinderGeometry, MeshBasicMaterial, Scene, Vector3 } from 'three'
import { BoxGeometry, SphereGeometry, PlaneGeometry, Mesh, MeshToonMaterial } from 'three';
import { BasicLights } from 'lights'

import ROAD from '../models/road.gltf'
import EDGE from '../models/road_edge.gltf'
import MOUNTAIN from '../models/mountain.gltf'

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
        
    }
}

export default GameScene;