import { Group, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

class Text extends Group {


    constructor(parent, start, duration, position, string) {
        // Call parent Group() constructor
        super();
        this.name = 'text';
        this.start = start;
        this.duration = duration;
        parent.addToUpdateList(this);
        const temp = this;
        this.thing;
        this.string = string;
        const loader = new FontLoader();
        const mat = new MeshStandardMaterial({color:0x020202})
        loader.load( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {

            const geometry = new TextGeometry( string, {
                font: font,
                size: 2,
                height: 0.1,
                curveSegments: 12,
                bevelEnabled: false
            } );
            const Thing = new Mesh(geometry, mat);
            Thing.geometry.center();
            Thing.visible = false;
            temp.thing = Thing;
            console.log(Thing);
            temp.add(Thing);

        } );
        
        
    }

    update(timeStamp, quaternion, position) {
  
        if(this.thing != undefined && position != undefined) {
            var scaledPos = new Vector3().copy(position);
            scaledPos.multiplyScalar(0.5);
            this.position.set(scaledPos.x, scaledPos.y, scaledPos.z);
            debugger;
            if(timeStamp > this.start && timeStamp < this.start + this.duration) {
                this.thing.visible = true;
            } else {
                this.thing.visible = false;
            }
        }
    
        this.setRotationFromQuaternion(quaternion);

    }

}

export default Text;
