import { World, Vec3, Body, Sphere, Plane, Box, Material, Cylinder, RaycastVehicle, RigidVehicle, Quaternion } from 'cannon-es'
import { Shape } from 'three'
class PlayerVehicle {
    /*
    Taken from https://github.com/pmndrs/cannon-es/blob/master/examples/rigid_vehicle.html
    */
    constructor(world, pos){


    // Build the car chassis

    const mass = 2;
    const w = 1.0
    const axisWidth = 1.5
    const chassisShape = new Box(new Vec3(2*w,0.5, axisWidth ))
    const chassisBody = new Body({ mass: mass})
    const centerOfMassAdjust = new Vec3(0, -0.5, 0)
    //chassisBody.collisionResponse = false;
    chassisBody.addShape(chassisShape)
    chassisBody.position.set(pos[0], pos[1], pos[2])

    // Create the vehicle
    const vehicle = new RigidVehicle({
      chassisBody,
    })

  

    const wheelShape = new Sphere(0.5)
    const wheelMaterial = new Material('wheel')
    const down = new Vec3(0, -1, 0)



    const wheelBody1 = new Body({ mass, material: wheelMaterial })
    wheelBody1.addShape(wheelShape)
    vehicle.addWheel({
      body: wheelBody1,
      position: new Vec3(-w, 0, axisWidth / 2).vadd(centerOfMassAdjust),
      axis: new Vec3(0, 0, 1),
      direction: down,
    })

    const wheelBody2 = new Body({ mass, material: wheelMaterial })
    wheelBody2.addShape(wheelShape)
    vehicle.addWheel({
      body: wheelBody2,
      position: new Vec3(-w, 0, -axisWidth / 2).vadd(centerOfMassAdjust),
      axis: new Vec3(0, 0, -1),
      direction: down,
    })

    const wheelBody3 = new Body({ mass, material: wheelMaterial })
    wheelBody3.addShape(wheelShape)
    vehicle.addWheel({
      body: wheelBody3,
      position: new Vec3(w, 0, axisWidth / 2).vadd(centerOfMassAdjust),
      axis: new Vec3(0, 0, 1),
      direction: down,
    })

    const wheelBody4 = new Body({ mass, material: wheelMaterial })
    wheelBody4.addShape(wheelShape)
    vehicle.addWheel({
      body: wheelBody4,
      position: new Vec3(w, 0, -axisWidth / 2).vadd(centerOfMassAdjust),
      axis: new Vec3(0, 0, -1),
      direction: down,
    })

    vehicle.wheelBodies.forEach((wheelBody) => {
      // Some damping to not spin wheels too fast
      wheelBody.angularDamping = 0.4
    })

    vehicle.addToWorld(world)
   
    this.vehicle = vehicle;
    this.chassis = chassisBody;

    this.param = {
        maxSteerVal: Math.PI / 32 ,
        maxForce: 15,
        brakeForce: 1000000
    }

    }

   

}

export default PlayerVehicle;