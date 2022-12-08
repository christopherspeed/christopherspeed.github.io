import { Group } from 'three';
import { CylinderGeometry, MeshPhongMaterial, MeshStandardMaterial, Mesh } from 'three';

class CarInterior extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        this.name = 'carInterior';
        
        // Add all necessary geometry elements
        const geo = new CylinderGeometry(1,1,2,32);
        const mat = new MeshStandardMaterial({color:0x202020});
        const mat2 = new MeshStandardMaterial({color:0x400000});
        const cylinder = new Mesh(geo, mat);
        this.add(cylinder);
        const cylinder2 = new Mesh(geo, mat2);
        cylinder2.position.x = 2;
        this.add(cylinder2);

        this.position.y = 2;
        this.position.x = 4

        parent.addToUpdateList(this);

    }

    update(timeStamp, camera) {
        this.position.x = camera.position.x*0.7;
        this.position.y = camera.position.y*0.7;
        this.position.z = camera.position.z*0.7;
        this.rotation.x = camera.rotation.x;
        this.rotation.y = camera.rotation.y;
        this.rotation.z = camera.rotation.z;
    }
}

export default CarInterior;