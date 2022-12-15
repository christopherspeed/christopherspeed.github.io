import { Group, PlaneGeometry, Scene, MeshBasicMaterial, MeshStandardMaterial, Mesh, Color, BoxGeometry, MeshToonMaterial, Vector3, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { BasicLights } from 'lights';
const menuURL = require("./menuimg.png").default;
const texture = new TextureLoader().load(menuURL);
const pineURL = require("./pine.png").default;
const pineTexture = new TextureLoader().load(pineURL);

const aURL = require("./a.png").default;
const aTex = new TextureLoader().load(aURL);

const wURL = require("./w.png").default;
const wTex = new TextureLoader().load(wURL);

const sURL = require("./s.png").default;
const sTex = new TextureLoader().load(sURL);

const dURL = require("./d.png").default;
const dTex = new TextureLoader().load(dURL);

const apressURL = require("./apress.png").default;
const apressTex = new TextureLoader().load(apressURL);

const wpressURL = require("./wpress.png").default;
const wpressTex = new TextureLoader().load(wpressURL);

const spressURL = require("./spress.png").default;
const spressTex = new TextureLoader().load(spressURL);

const dpressURL = require("./dpress.png").default;
const dpressTex = new TextureLoader().load(dpressURL);

class HUD extends Scene {
    constructor() {
        // Call parent Group() constructor
        super();

        this.background = new Color(0x101010)
        const lights = new BasicLights();
        this.add(lights);
        this.ground_toon_mat = new MeshBasicMaterial()
        this.ground_toon_mat.color = new Color(0x00994F)
        this.ground_toon_mat.map = texture;
        this.pine_mat = new MeshBasicMaterial({map:pineTexture});
        var temp = this;
        const ground_geo = new PlaneGeometry(0.6, 0.6);
        const geo = new PlaneGeometry(2,2);
        this.aMat = new MeshBasicMaterial({map:aTex});
        this.dMat = new MeshBasicMaterial({map:dTex});
        this.wMat = new MeshBasicMaterial({map:wTex});
        this.sMat = new MeshBasicMaterial({map:sTex});

        this.apressMat = new MeshBasicMaterial({map:apressTex});
        this.dpressMat = new MeshBasicMaterial({map:dpressTex});
        this.wpressMat = new MeshBasicMaterial({map:wpressTex});
        this.spressMat = new MeshBasicMaterial({map:spressTex});

        
        this.a = new Mesh(ground_geo, this.aMat);
        this.a.position.set(-0.6,-0.2,0);
       // ground.lookAt(new Vector3(0, 1, 0));
        //ground.setRotationFromQuaternion(quaternion);
        this.add(this.a);

        this.d = new Mesh(ground_geo, this.dMat);
        this.d.position.set(0.6,-0.2,0);
        this.add(this.d);

        this.w = new Mesh(ground_geo, this.wMat);
        this.w.position.set(0,0.4,0);
        this.add(this.w);

        this.s = new Mesh(ground_geo, this.sMat);
        this.s.position.set(0,-0.2,0);
        this.add(this.s);
        
    }

    update(w, a, s, d) {
        if(w) {
            this.w.material = this.wpressMat;            
        } else {
            this.w.material = this.wMat;
        }
        if(a) {
            this.a.material = this.apressMat;            
        } else {
            this.a.material = this.aMat;
        }
        if(s) {
            this.s.material = this.spressMat;            
        } else {
            this.s.material = this.sMat;
        }
        if(d) {
            this.d.material = this.dpressMat;            
        } else {
            this.d.material = this.dMat;
        }
    }
}

export default HUD;
