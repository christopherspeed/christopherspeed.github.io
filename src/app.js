/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, SphereGeometry, MeshNormalMaterial, Mesh, BoxGeometry, Scene, BufferGeometry, MeshBasicMaterial, Color, ConvexGeometry, DoubleSide } from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { SeedScene } from 'scenes';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { InputControl } from './components/input';
import { GamePhysicsScene, GameScene, SceneCustom, TestScene } from './components/scenes';
import { World, Vec3, Body, Sphere, Plane, Box, Material, Cylinder, Ray, Trimesh, Quaternion, ConvexPolyhedron } from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger';


// Initialize core ThreeJS components
// const scene = new SeedScene();
const scene = new GameScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

// Set up camera
camera.position.set(0, 30, -100);
camera.lookAt(new Vector3(0, 0, 0));


// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

//Ew Orbit controls trash
// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 1000;
controls.update();

// physics
const world = new World(
    {
        gravity: new Vec3(0, -9.82 * 1.5, 0),
    }
)



const radius = 2
const sphereBody = new Body({
    mass: 5,
    shape: new Sphere(radius),
    angularDamping: 0.4,

})
sphereBody.position.set(0, 5, 0)

const boxBody = new Body({
    shape: new Sphere(1),
    mass: 100,
    linearDamping: 0.8,
    angularDamping: 0.8,
    material: new Material({
        friction: 0.5
    }),
    fixedRotation: true
})
boxBody.position.set(20, 120, -140)

const inputControl = new InputControl(camera, scene, boxBody);
console.log(boxBody.position)

const geometry = new SphereGeometry(radius)
const material = new MeshNormalMaterial()
const sphereMesh = new Mesh(geometry, material)
const box_geo = new BoxGeometry(1, 1, 2);
const boxMesh = new Mesh(box_geo, material);
// scene.add(boxMesh, sphereMesh)
scene.add(boxMesh)
const groundBody = new Body({
    type: Body.STATIC,
    shape: new Plane(),
    material: new Material({
        friction: 0
    })
})
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
// world.addBody(groundBody)
const angledGroundBody = new Body({
    type: Body.STATIC,
    shape: new Plane(),
    material: new Material({
        friction: 0
    })
})
angledGroundBody.quaternion.setFromEuler(Math.PI, 0, 0)
angledGroundBody.position.set(0, 0, 50)
// second boundary
const angledGroundBody2 = new Body({
    type: Body.STATIC,
    shape: new Plane(),
    material: new Material({
        friction: 0
    })
})
angledGroundBody2.quaternion.setFromEuler(-  2 * Math.PI, 0, 0)
angledGroundBody2.position.set(0, 0, -50)
// third boundary
const angledGroundBody3 = new Body({
    type: Body.STATIC,
    shape: new Plane(),
    material: new Material({
        friction: 0
    })
})
angledGroundBody3.quaternion.setFromEuler(0, - Math.PI / 2, 0)
angledGroundBody3.position.set(50, 0, 0)
// fourth boundary
const angledGroundBody4 = new Body({
    type: Body.STATIC,
    shape: new Plane(),
    material: new Material({
        friction: 0
    })
})
angledGroundBody4.quaternion.setFromEuler(0, Math.PI / 2, 0)
angledGroundBody4.position.set(-50, 0, 0)
// world.addBody(angledGroundBody)
// world.addBody(angledGroundBody2)
// world.addBody(angledGroundBody3)
// world.addBody(angledGroundBody4)
// world.addBody(sphereBody);
world.addBody(boxBody)

// const bump = new Body({
//     type: Body.STATIC,
//     shape: new Box(new Vec3(1, 5, 5)),
//     material: new Material({
//         friction: 0
//     })
// })
// bump.position.set(0, -0.5, 15)
// bump.quaternion.setFromEuler(- Math.PI / 6, 0, Math.PI / 2)
// const bump2 = new Body({
//     type: Body.STATIC,
//     shape: new Box(new Vec3(1, 5, 5)),
//     material: new Material({
//         friction: 0
//     })
// })
// bump2.position.set(0, -0.5, 30)
// bump2.quaternion.setFromEuler(Math.PI / 6, 0, Math.PI / 2)
// world.addBody(bump2) 
// world.addBody(bump)


// load all of the physics colliders
// const gamePhysics = new GamePhysicsScene()
// const physicsBodies = gamePhysics.roadBodies
// const environmentalBodies = gamePhysics.environBodies;
// for (let i = 0; i < physicsBodies.length; i++) {
//     world.addBody(physicsBodies[i])
// }
// for (let i = 0; i < environmentalBodies.length; i++) {
//     world.addBody(environmentalBodies[i])
// }

// testing the trigger
const triggerBody = new Body({
    isTrigger: true,
    type: Body.STATIC,
    position: new Vec3(0, 1.5, -10),
    shape: new Box(new Vec3(4, 1, 2),)
})

function printTrigger(event) {
    console.log(event)
    console.log(triggerBody.world)
    bodiesToRemove.push(triggerBody)
    world.addBody(sphereBody)
    triggerBody.removeEventListener("collide", printTrigger)
}
triggerBody.addEventListener("collide", printTrigger)
const bodiesToRemove = []
// world.addBody(triggerBody)
//window.addEventListener('keydown', testMove);
// document.body.style.cursor = 'none';
// Render loop
let bodyToRemove = 0
let boxRay = new Ray(boxBody.position, boxBody.position.vadd(new Vec3(0, -1, 0)))
const roads = scene.roads;


// console.log(roads[0])
// world.addBody(roads[0].body)
// scene.add(roads[0].mesh)

// world.addBody(roads[1].body)
// scene.add(roads[1].mesh)
// roads[1].rotate(0, Math.PI, 0)

const cannonDebugger = new CannonDebugger(scene, world);
const onAnimationFrameHandler = (timeStamp) => {

    controls.update();
    inputControl.update();
    // camera.lookAt(scene.target.position);
    boxRay = new Ray(boxBody.position.clone().vadd(new Vec3(0, 4, 0)), boxBody.position.clone().vadd(new Vec3(0, -4, 0)))
    // if (boxRay.result != null) console.log(boxRay.result)
    world.fixedStep();
    // draw new ray


    cannonDebugger.update();
    if (bodiesToRemove.length > 0) {
        world.removeBody(bodiesToRemove[0])
    }
    // move all physics things and move their three visualizations along with them

    sphereMesh.position.copy(sphereBody.position)
    sphereMesh.quaternion.copy(sphereBody.quaternion)
    boxMesh.position.copy(boxBody.position)
    boxMesh.quaternion.copy(boxBody.quaternion)

    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
window.addEventListener('keyup', (event) => {
    if (event.key == 'p') {
        console.log('hello')
        box.applyImpulse(new Vec3(0, 10, 0))
    }
})




// window.addEventListener('mousemove', testMouseStuff);

function testMouseStuff(event) {
    console.log(event.movementX, event.movementY)
    camera.rotateY(- event.movementX * 0.001)
    camera.rotateX(- event.movementY * 0.001)
}

