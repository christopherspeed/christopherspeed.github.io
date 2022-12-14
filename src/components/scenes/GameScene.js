import { Color, CylinderGeometry, MeshBasicMaterial, Scene, Vector3 } from 'three'
import { BoxGeometry, SphereGeometry, PlaneGeometry, Mesh, MeshToonMaterial} from 'three';
import { BasicLights } from 'lights'
import { Car } from '../objects/Car';
import { Tree } from '../objects/Tree'
import { randFloat } from 'three/src/math/MathUtils';


class GameScene extends Scene {
    constructor() {
        super();

        this.background = new Color(0x1b2e4d)
        const lights = new BasicLights();
        this.add(lights);

        // ground
        const ground = new Mesh(
            new PlaneGeometry(100, 100),
            new MeshToonMaterial({
                color: new Color(0x153019)
            })
        )
        ground.lookAt(new Vector3(0, 1, 0));
        // this.add(ground)

        // mountain
        const mountain = new Mesh(
            new CylinderGeometry(10, 20, 60, 30),
            new MeshToonMaterial({
                color: new Color(0x2a2b2b)
            })
        )
        mountain.position.add(new Vector3(0, 30, 0))
        // this.add(mountain)
        
    }
}

export default GameScene;