import { Group, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

class Text extends Group {


    constructor(parent, direction, distance) {
        // Call parent Group() constructor
        super();
        this.name = 'text';
        const temp = this;
        parent.addToUpdateList(this);
        const loader = new FontLoader();
        const mat = new MeshStandardMaterial({color:0x020202})
        loader.load( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {

            const geometry = new TextGeometry( 'Hello three.js!', {
                font: font,
                size: 30,
                height: 2,
                curveSegments: 12,
                bevelEnabled: false
            } );
            const Thing = new Mesh(geometry, mat);
            Thing.position.z = -30;
            temp.add(Thing);

        } );
        
        
    }

    update(timeStamp, quaternion) {

        this.setRotationFromQuaternion(quaternion);

    }

}

export default Text;
