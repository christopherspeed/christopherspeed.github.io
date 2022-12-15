import {Scene,Vector3, Vector4, Box3} from 'three'

class FrustumCulling {
    constructor(scene, camera){

        // Local variables
        this.scene = scene;
        this.camera = camera;

        // Turnoff frustumCulled 
        this.scene.traverse((obj) => {obj.frustumCulled = false;
        obj.boundBox = new Box3().setFromObject(obj);
    })
        this.perpRow = new Array(4);
        this.numNotRendered = 0;
        this.update = function(){
            camera.updateProjectionMatrix();
            this.numNotRendered = 0;
            const camMatrix = this.camera.projectionMatrix.clone().multiply(this.camera.matrixWorldInverse);
            const proj = camMatrix.transpose().elements;
            this.perpRow = [new Vector4().fromArray(proj), 
            new Vector4().fromArray(proj, 4), new Vector4().fromArray(proj, 8), 
            new Vector4().fromArray(proj, 12)];

            scene.traverse((obj) => {this.checkObjInFrustum(obj, this.perpRow, this.camera);
            if(!obj.visible) this.numNotRendered++;
            });
            //console.log(this.numNotRendered);
            
        }

        this.checkObjInFrustum = function(obj, perpRow){
            if(!obj.isMesh) {
                return;
            }
            let b = obj.boundBox;
            if(!b){
                obj.boundBox = new Box3();
                b = obj.boundBox;
            }
            
            if(obj.frustumCulled){
                obj.frustumCulled = false;
                console.log("bro I'm dead");
            }
            b.setFromObject(obj);
            const row1 = perpRow[0];
            const row2 = perpRow[1];
            const row3 = perpRow[2];
            const row4 = perpRow[3];


            const planeCheck = [
                new Vector4().addVectors(row4, row1), // left
                new Vector4().subVectors(row4, row1), // right
                new Vector4().addVectors(row4, row2), // bottom
                new Vector4().subVectors(row4, row2), // top 
                new Vector4().addVectors(row4, row3), // near
                new Vector4().subVectors(row4, row3) // far
            ]

            // Checking intersection with box algorithm
            // https://www.gamedev.net/forums/topic/512123-fast-and-correct-frustum-aabb-intersection/
            let inFrust = true;
            for(let j = 0; j < planeCheck.length; j++){
                const plane = planeCheck[j];
                
                const p = new Vector4(0,0,0,1);
                p.x = plane.x > 0 ? b.max.x : b.min.x;
                p.y = plane.y > 0 ? b.max.y : b.min.y;
                p.z = plane.z > 0 ? b.max.z : b.min.z;

                if(p.dot(planeCheck[j]) < 0){
                    inFrust = false; break;
                }
            }

            if(inFrust){
                obj.visible = true;
            } else {
                obj.visible = false;
            }
        }
    }

   
}

export default FrustumCulling;