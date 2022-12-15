import { Color, CylinderGeometry, MeshBasicMaterial, Scene, Vector3 } from 'three'
import { BoxGeometry, SphereGeometry, PlaneGeometry, Mesh, MeshToonMaterial } from 'three';
import { BasicLights } from 'lights'

import ROAD2 from '../models/Road Models/road.gltf'
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
            ROAD2,
            MOUNTAIN
        );
        
    }
}

export default GameScene;