import { Group, PlaneGeometry, Scene, MeshBasicMaterial, Mesh, Color, BoxGeometry, MeshToonMaterial, Vector3, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BasicLights } from 'lights';
const pineURL = require("./menu_texture.png").default;
const texture = new TextureLoader().load(pineURL);

class Menu extends Scene {
    constructor(width, height, quaternion) {
        // Call parent Group() constructor
        super();

        this.background = new Color(0xffffff)
        const lights = new BasicLights();
        this.add(lights);
        const ground_toon_mat = new MeshBasicMaterial()
        ground_toon_mat.color = new Color(0xffffff)
        ground_toon_mat.map = texture;

        const ground_geo = new PlaneGeometry(width, height);
        const ground = new Mesh(ground_geo, ground_toon_mat);

       // ground.lookAt(new Vector3(0, 1, 0));
        //ground.setRotationFromQuaternion(quaternion);
        this.add(ground);
    }


}

export default Menu;
