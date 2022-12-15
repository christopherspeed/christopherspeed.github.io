import { BoxGeometry, DirectionalLight, Mesh, MeshToonMaterial, PointLight, Scene, Vector3 } from "three"
import { PlaneGeometry } from "three";
import { Color } from "three";
import { AxesHelper } from "three";

// doing it all manually, for funzies
class TestScene extends Scene {
    constructor(){
        super();

        // ground
        const plane_geo = new PlaneGeometry(100, 100)
        const ground_mat = new MeshToonMaterial();
        ground_mat.color = new Color(0x1b2e4d)
        const ground = new Mesh(plane_geo, ground_mat);
        // rotate to face upwards
        ground.lookAt(new Vector3(0, 1, 0));
        this.add(ground)

        // add a box
        const box_geo = new BoxGeometry(1, 1, 1);
        const box_mat = new MeshToonMaterial();
        box_mat.color = new Color(0xF23456)
        const box = new Mesh(box_geo, box_mat);
        box.position.add(new Vector3(0, .5, 0))
        this.add(box)

        // // light the scene
        const lights = []
        lights.push(new PointLight(0xFFFFFF, 2));
        lights[0].position.add(new Vector3(0, 1, -1))

        // this.add(lights[0])
        const axesHelper = new AxesHelper( 5 );
        this.add( axesHelper );

    }
}


export default TestScene;