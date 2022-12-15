/*
    Contains all of the physics volumes associated with the game visuals
*/

import { Body, Box, Vec3, Cylinder, Material, Quaternion } from "cannon-es"
import * as Dat from 'dat.gui';
import { Vector3 } from "three";


class GamePhysicsScene {
    constructor() {
        this.roadBodies = []
        this.environBodies = []
        
        // const road1 = new Body({
        //     shape: new Box(new Vec3(4, 1, 10)),
        //     position: new Vec3(-5, 1, -24),
        //     quaternion: new Quaternion().setFromEuler(-0.5, -1, -0.5),
        //     type: Body.STATIC,
        //     material: new Material({
        //         friction: 0
        //     })
        // })
        // const road2 = new Body({
        //     shape: new Box(new Vec3(6, 1, 10)),
        //     position: new Vec3(-14, 5, -16),
        //     quaternion: new Quaternion().setFromEuler(-0.5, -0.5, -0.5),
        //     type: Body.STATIC,
        //     material: new Material({
        //         friction: 0
        //     })
        // })
        // const road3 = new Body({
        //     shape: new Box(new Vec3(6, 1, 10)),
        //     position: new Vec3(-20, 11, -2),
        //     quaternion: new Quaternion().setFromEuler(-0.2, 0, -0.5),
        //     type: Body.STATIC,
        //     material: new Material({
        //         friction: 0
        //     })
        // })
        // this.roadBodies.push(road1, road2, road3)
        //#region Environmental Physics Bodies
        // mountain physics body
        const mountainBody = new Body({
            type: Body.STATIC,
            shape: new Cylinder(10, 20, 60, 40),
            material: new Material({
                friction: 0
            }),
            position: new Vec3(0, 30, 0),
        })
        // this.environBodies.push(mountainBody)
        //#endregion
    }
}

export default GamePhysicsScene