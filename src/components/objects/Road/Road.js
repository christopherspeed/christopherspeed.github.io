/**
 * Road.js
 * Contains the mesh and collision body for a road segment
 */
import { Vec3, Body, Material, Trimesh} from 'cannon-es'
import { Mesh, Vector3 } from 'three'
class Road {
    constructor(loadedGLTF, mat, useMesh){
        // construct collision body out of the provided geometry
        const triMesh = new Trimesh(
            loadedGLTF.scene.children[0].geometry.attributes.position.array,
            loadedGLTF.scene.children[0].geometry.index.array);
        let triBody = new Body({
            shape: triMesh,
            material: new Material({
                friction: 0
            }),
        })

        // construct the corresponding mesh, with the provided material
        const roadMesh = new Mesh(loadedGLTF.scene.children[0].geometry, mat);

        // fields for scene/world adding
        this.body = triBody;
        this.mesh = null;
        if (useMesh) this.mesh = roadMesh;
    }

    // change the position of both the mesh and the physics body
    translate(x, y, z){
        console.log(x, y, z)
        this.body.position.vadd(new Vec3(x, y, z), this.body.position);
        if(this.mesh) this.mesh.position.add(new Vector3(x, y, z));
    }

    // change the rotation of both the mesh and the physics body
    rotate(xRot, yRot, zRot){
        this.body.quaternion.setFromEuler(xRot, yRot, zRot);
        // perhaps a bit hacky
        this.mesh.rotateX(xRot);
        this.mesh.rotateY(yRot);
        this.mesh.rotateZ(zRot);
    }

}
export default Road 