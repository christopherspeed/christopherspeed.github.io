import { Color, MeshBasicMaterial, Scene, Vector3 } from 'three'
import { BoxGeometry, SphereGeometry, PlaneGeometry, Mesh, MeshToonMaterial} from 'three';
import { BasicLights } from 'lights'
import { Car } from '../objects/Car';
import { Tree } from '../objects/Tree'
import { randFloat } from 'three/src/math/MathUtils';


class SceneCustom extends Scene {
    constructor() {
        super();

        this.background = new Color(0x1b2e4d)
        const lights = new BasicLights();
        this.add(lights);
        const box_toon_mat = new MeshToonMaterial()
        box_toon_mat.color = new Color(0x11bd9a);
        const ground_toon_mat = new MeshBasicMaterial()
        ground_toon_mat.color = new Color(0x00994F)

        const box_geo = new BoxGeometry(1, 1, 2);
        const box = new Mesh(box_geo, box_toon_mat);
        box.position.add(new Vector3(0, 1,0));
        const box2 = box.clone();
        box2.position.add(new Vector3(0, -0.5, 1))
        const box3 = box.clone();
        box3.position.add(new Vector3(0, -0.5, -1))

        const ground_geo = new PlaneGeometry(100, 100);
        const ground = new Mesh(ground_geo, ground_toon_mat);
        // ground.rotateY(Math.PI)
        // ground.rotateX(3 * Math.PI / 2)
        ground.lookAt(new Vector3(0, 1, 0));
        //console.log(ground)
        const thing = new Car();
        // thing.add(box);
        // thing.add(box2, box3)
        
        this.add(ground, thing);
        
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

        for (let i = 0; i < 100; i++){
            moreTrees.push(new Tree());
        }

        for (let i = 0; i < moreTrees.length; i++){
            moreTrees[i].position.add(new Vector3(randFloat(-40, 40), 0, randFloat(-40, 40)));
            this.add(moreTrees[i])
        }

        
        this.target = thing;
        
    }

    update(carPos) {
        for (let i = 3; i < 123; i++) {
            const child = this.children[i];
            this.children[i].update(carPos);
        }

    }
}

export default SceneCustom;