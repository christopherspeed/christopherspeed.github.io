import { Group, PlaneGeometry, Scene, MeshBasicMaterial, Mesh, Color, BoxGeometry, MeshToonMaterial, Vector3, TextureLoader } from 'three';

import { BasicLights } from 'lights';
const gameover = require("./gameover.png").default;
const texture = new TextureLoader().load(gameover);

class GameOver extends Scene {
    constructor(width, height, quaternion) {
        // Call parent Group() constructor
        super();

        this.background = new Color(0x1b2e4d)
        const lights = new BasicLights();
        this.add(lights);
        const ground_toon_mat = new MeshBasicMaterial()
        ground_toon_mat.color = new Color(0x00994F)
        ground_toon_mat.map = texture;

        const ground_geo = new PlaneGeometry(width, height);
        const ground = new Mesh(ground_geo, ground_toon_mat);

        ground.lookAt(new Vector3(0, 1, 0));
        ground.setRotationFromQuaternion(quaternion);
        this.add(ground);
    }


}

export default GameOver;
