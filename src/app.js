/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, SphereGeometry, MeshNormalMaterial, Group, Mesh, BoxGeometry, Color, PlaneGeometry, TextureLoader, sRGBEncoding, MeshLambertMaterial} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FogExp2 } from 'three/src/scenes/FogExp2.js'
// import { SeedScene } from 'scenes';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

import { InputControl } from './components/input';
import { SceneCustom, TestScene} from './components/scenes';
import { World, Vec3, Body, Sphere, Plane, Box, Material, Cylinder } from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger';


// Initialize core ThreeJS components
// const scene = new SeedScene();
const scene = new SceneCustom();
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

scene.fog = new FogExp2(new Color(0x1b2e4d), .02);

// SMOKE TEXTURE
// adapted from: https://www.youtube.com/watch?v=otavCmIuEhY
const smokeTextureLocation = require("./components/textures/Smoke15Frames.png").default;
const smokeTexture = new TextureLoader().load(smokeTextureLocation);
smokeTexture.encoding = sRGBEncoding; // default is linear
const smokeGeometry = new PlaneGeometry(100, 100);

// LambertMaterial for nonshiny surfaces
const smokeMaterial = new MeshLambertMaterial( {
    color: 0xffffff, // white for debugging
    map: smokeTexture,
    emissive: 0x222222,
    opacity: .15,
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
controls.maxDistance = 100;
controls.update();

// physics
const world = new World(
    {
        gravity: new Vec3(0, -9.82 * 1.5 , 0),
    }
)

const cannonDebugger = new CannonDebugger(scene, world);

const radius = 2
const sphereBody = new Body({
    mass: 5,
    shape: new Sphere(radius),
    angularDamping: 0.4,
    
})
sphereBody.position.set(2, 5, 20)
world.addBody(sphereBody)
const boxBody = new Body({
    shape: new Box(new Vec3(.5, .5, 1)),
    mass: 100,
    linearDamping: 0.8,
    angularDamping: 0.8,
    material: new Material({
        friction: 0
    })
})
boxBody.position.set(0, 15.5, -20)


const inputControl = new InputControl(camera, scene, boxBody);
console.log(boxBody.position)

const geometry = new SphereGeometry(radius)
const material = new MeshNormalMaterial()
const sphereMesh = new Mesh(geometry, material)
const box_geo = new BoxGeometry(1, 1, 2);
const boxMesh = new Mesh(box_geo, material);
scene.add(boxMesh, sphereMesh)
const groundBody = new Body({
    type: Body.STATIC,
    shape: new Plane(),
    material: new Material({
        friction: 0
    })
  })
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
world.addBody(groundBody)
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
angledGroundBody2.quaternion.setFromEuler(-  2 * Math.PI  , 0, 0) 
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
world.addBody(angledGroundBody)
world.addBody(angledGroundBody2)
world.addBody(angledGroundBody3)
world.addBody(angledGroundBody4)
// world.addBody(sphereBody);
world.addBody(boxBody)

const bump = new Body({
    type: Body.STATIC,
    shape: new Box(new Vec3(1, 5, 5)),
    material: new Material({
        friction: 0
    })
})
bump.position.set(0, -0.5, 15)
bump.quaternion.setFromEuler(- Math.PI / 6, 0, Math.PI / 2)
const bump2 = new Body({
    type: Body.STATIC,
    shape: new Box(new Vec3(1, 5, 5)),
    material: new Material({
        friction: 0
    })
})
bump2.position.set(0, -0.5, 30)
bump2.quaternion.setFromEuler(Math.PI / 6, 0, Math.PI / 2)
world.addBody(bump2)
world.addBody(bump)

const testBody = new Body({
    type: Body.STATIC,
    shape: new Cylinder(10, 20, 10, 20),
    material: new Material({
        friction: 0
    })
})
testBody.position.set(0, 5, -30)
world.addBody(testBody)
//window.addEventListener('keydown', testMove);
// document.body.style.cursor = 'none';
// Render loop
const onAnimationFrameHandler = (timeStamp) => {

    controls.update();
    inputControl.update();
    // camera.lookAt(scene.target.position);
    world.fixedStep();
    cannonDebugger.update();
    smoke.rotation.z += 1;
    smoke.position.z += 1;
    
    
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

function testMouseStuff(event){
    console.log(event.movementX, event.movementY)
    camera.rotateY(- event.movementX * 0.001)
    camera.rotateX(- event.movementY * 0.001)
}

