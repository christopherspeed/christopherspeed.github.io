import { Group, Vector3 } from 'three';
import { CylinderGeometry, BoxGeometry, MeshPhongMaterial, MeshStandardMaterial, Mesh, TextureLoader } from 'three';

class CarInterior extends Group {
    constructor(parent, camera) {
        // Call parent Group() constructor
        super();

        this.name = 'carInterior';
        
        const lookAtVector = new Vector3();
        const factor = -3;
        camera.getWorldDirection(lookAtVector);
        // Add all necessary geometry elements

        // left vertical rail
        const geo = new CylinderGeometry(0.5,0.5,6,20);
        const mat = new MeshStandardMaterial({color:0x202020});
        const mat2 = new MeshStandardMaterial({color:0x400000});
        const cylinder = new Mesh(geo, mat);
        cylinder.position.x = -2.8;
        cylinder.rotateZ(0.3);
        this.add(cylinder);

        // horizontal bottom rail
        const cylinder2 = new Mesh(geo, mat);
        cylinder2.position.x = 0;
        cylinder2.position.y = -1.4;
        cylinder2.rotateZ(Math.PI/2);
        this.add(cylinder2);

        // car radio
        const boxGeo = new BoxGeometry(1, 1, 1);
        const radioTexture = new TextureLoader().load('assets/textures/radio.jpg');
        const radioMat = new MeshStandardMaterial({map: radioTexture});
        const cube = new Mesh(boxGeo, radioMat);
        cube.rotateX(1.1);
        this.add(cube);

        // const cylinder2 = new Mesh(geo, mat);
        // cylinder2.position.x = 2.5;
        // this.add(cylinder2);

        this.position.y = 2;
        this.position.x = 4

        parent.addToUpdateList(this);

    }

    update(timeStamp, camera) {
        const lookAtVector = new Vector3();
        const factor = -3;
        camera.getWorldDirection(lookAtVector);
        this.position.x = camera.position.x - factor*lookAtVector.x;
        this.position.y = camera.position.y - factor*lookAtVector.y;
        this.position.z = camera.position.z - factor*lookAtVector.z;
        //debugger;
        this.rotation.x = camera.rotation.x;
        this.rotation.y = camera.rotation.y;
        this.rotation.z = camera.rotation.z;
    }
}

export default CarInterior;