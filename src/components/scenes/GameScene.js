import { Color, CylinderGeometry, MeshBasicMaterial, Scene, Vector3 } from 'three'
import { BoxGeometry, SphereGeometry, PlaneGeometry, Mesh, MeshToonMaterial } from 'three';
import { BasicLights } from 'lights'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import MODEL from '../models/test_road.gltf'
import MODEL2 from '../models/test_environment.gltf'
import Road from '../objects/Road/Road.js'

class GameScene extends Scene {
    constructor() {
        super();

        this.background = new Color(0x1b2e4d)
        const lights = new BasicLights();
        this.add(lights);

        this.roads = []
        this.models = []
        this.models.push(MODEL, MODEL2)
        
    }
}

export default GameScene;