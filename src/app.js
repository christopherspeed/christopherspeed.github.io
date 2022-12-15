/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */

import { WebGLRenderer, PerspectiveCamera, Vector3, SphereGeometry, MeshNormalMaterial, Points, PointsMaterial, AdditiveBlending, Mesh, BoxGeometry, TextureLoader, sRGBEncoding, PlaneGeometry, MeshLambertMaterial, Group, Scene, BufferGeometry, MeshBasicMaterial, Color, ConvexGeometry, DoubleSide, FogExp2 } from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { SeedScene } from 'scenes';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { MakeAudio } from './components/audio';
import { InputControl } from './components/input';

import { GamePhysicsScene,  FrustumCulling, GameScene, SceneCustom, TestScene } from './components/scenes';
import { World, Vec3, Body, Sphere, Plane, Box, Material, Cylinder, Ray, Trimesh, Quaternion, ConvexPolyhedron } from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger';
import MODEL1 from './components/models/test_environment.gltf'
import MODEL2 from './components/models/test_road.gltf'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Road from './components/objects/Road/Road';


// Initialize core ThreeJS components
// const scene = new SeedScene();
const scene = new GameScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

const frustCull = new FrustumCulling(scene, camera);
const sound = new MakeAudio(camera);

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

scene.fog = new FogExp2(new Color(0x1b2e4d), .002);


const smokeParticleLocation = require("./components/textures/particlesmoke.png").default;
const smokeParticleTexture = new TextureLoader().load(smokeParticleLocation);

// createParticleSystem(scene); ADD THIS BACK IN WHEN NEEDED!

/*
// NOT PROPERLY IMPLEMENTED YET, NEEDS TO BE UNCOMMENTED/TWEAKED.
// UNCOMMENT LINES 230-231 WHEN WORKING
// SMOKE TEXTURE
// adapted from: https://www.youtube.com/watch?v=otavCmIuEhY

const smokeTextureLocation = require("./components/textures/Smoke15Frames.png").default;
const smokeTexture = new TextureLoader().load(smokeTextureLocation);
smokeTexture.encoding = sRGBEncoding; // default is linear
const smokeGeometry = new PlaneGeometry(100, 100);

// LambertMaterial for nonshiny surfaces
const smokeMaterial = new MeshLambertMaterial( {
    color: 0x0000ff, // white for debugging
    map: smokeTexture,
    emissive: 0x222222,
    opacity: .9,
    transparent: true
});

const smoke = new Group();

for (let i = 0; i < 20; i++) {
    // can tweak i for more or less layers
    let smokeElement = new Mesh(smokeGeometry, smokeMaterial);
    smokeElement.scale.set(2,2,2);

    // position textures at random xy positions
    smokeElement.position.set(Math.random() * 200 - 50, Math.random() * 200 - 50, -20);
    // probably have to adjust z

    // set smoke texture rotations to random amounts on z axis
    smokeElement.rotateOnAxis.z = Math.random * 360;
    smoke.add(smokeElement);

    console.log(smokeElement.visible);

}
scene.add(smoke);
*/

// Set up controls
// ????
// const controls = new FirstPersonControls( camera, canvas );
// controls.movementSpeed = 150;
// controls.lookSpeed = 0.01;

// Ew Orbit controls trash
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
boxBody.position.set(-20, 120, 140)

const inputControl = new InputControl(camera, scene, boxBody, sound);
console.log(boxBody.position)

const geometry = new SphereGeometry(radius)
const material = new MeshNormalMaterial()
const sphereMesh = new Mesh(geometry, material)
const box_geo = new BoxGeometry(1, 1, 2);
const boxMesh = new Mesh(box_geo, material);
// scene.add(boxMesh, sphereMesh)
scene.add(boxMesh)

world.addBody(boxBody)
// testing the trigger
const triggerBody = new Body({
    isTrigger: true,
    type: Body.STATIC,
    position: new Vec3(0, 1.5, -10),
    shape: new Box(new Vec3(4, 1, 2),)
})

// testBody.position.set(0, 5, -30)
// world.addBody(testBody)


function printTrigger(event) {
    console.log(event)
    console.log(triggerBody.world)
    bodiesToRemove.push(triggerBody)
    world.addBody(sphereBody)
    triggerBody.removeEventListener("collide", printTrigger)
}
triggerBody.addEventListener("collide", printTrigger)
const bodiesToRemove = []

const roads = []


const testMat = new MeshBasicMaterial({
    color: new Color(0x82898c)
})

const loader = new GLTFLoader()
loader.load(MODEL1, (gltf) => {
    const road = new Road(gltf, testMat)
    world.addBody(road.body)
    scene.add(road.mesh)
})
loader.load(MODEL2, (gltf) => {
    const road = new Road(gltf, testMat)
    world.addBody(road.body)
    scene.add(road.mesh)
})

// world.add(roads[0].body)
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
    sound.update();
    // camera.lookAt(scene.target.position);
    // boxRay = new Ray(boxBody.position.clone().vadd(new Vec3(0, 4, 0)), boxBody.position.clone().vadd(new Vec3(0, -4, 0)))

    // if (boxRay.result != null) console.log(boxRay.result)
    world.fixedStep();
    // draw new ray

    cannonDebugger.update();

    // smoke.rotation.z += 1; UNCOMMENT WHEN WE GET SMOKE WORKING
    // smoke.position.z += 1;
    
    

    if (bodiesToRemove.length > 0) {
        world.removeBody(bodiesToRemove[0])
    }
    // move all physics things and move their three visualizations along with them


    sphereMesh.position.copy(sphereBody.position)
    sphereMesh.quaternion.copy(sphereBody.quaternion)
    boxMesh.position.copy(boxBody.position)
    boxMesh.quaternion.copy(boxBody.quaternion)
    frustCull.update();
    renderer.render(scene, camera);
    scene.update && scene.update(boxBody.position);
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

// ADAPTED FROM THE FOLLOWING
// CITATION: https://solutiondesign.com/insights/webgl-and-three-js-particles/
function createParticleSystem(scene) {

    // The number of particles in a particle system is not easily changed.
    var particleCount = 2000;
   
    // Particles are just individual vertices in a geometry
    // Create the geometry that will hold all of the vertices

    const verts = [];
   // Create the vertices and add them to the particles geometry
    for (var p = 0; p < particleCount; p++) {
        // This will create all the vertices in a range of -200 to 200 in all directions
        var x = Math.random() * 400 - 200;
        var y = Math.random() * 400 - 200;
        var z = Math.random() * 400 - 200;
    
        // Create the vertex
        var particle = new Vector3(x, y, z);
    
        // Add the vertex to the geometry
        verts.push(particle);
    }
   
    let particles = new BufferGeometry().setFromPoints( verts )
   // Create the material that will be used to render each vertex of the geometry
    var particleMaterial = new PointsMaterial(
    {color: 0xffffff, 
    size: 4,
    map: smokeParticleTexture,
    blending: AdditiveBlending,
    transparent: false,
    });
   
    // Create the particle system
    const particleSystem = new Points(particles, particleMaterial);
   
   scene.add(particleSystem)
}
