/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, SphereGeometry, MeshNormalMaterial, Mesh, BoxGeometry, OrthographicCamera, TextureLoader, WebGLRenderTarget, MeshBasicMaterial, Scene, Color, PlaneGeometry } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';

import { InputControl } from './components/input';
import { SceneCustom, TestScene } from './components/scenes';
import { World, Vec3, Body, Sphere, Plane, Box, Material, Cylinder } from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger';


// Initialize core ThreeJS components
// const scene = new SeedScene();
const scene = new SceneCustom();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

const scene2 = new SceneCustom();
// Set up camera
camera.position.set(0, 300, -100);
camera.lookAt(new Vector3(0, 0, 0));

// set up overhead camera
const overheadCamera = new OrthographicCamera();
overheadCamera.position.set(0, 10, 100);
overheadCamera.lookAt(new Vector3(0, 0, 0));
overheadCamera.zoom = 0.1;
overheadCamera.updateProjectionMatrix();
overheadCamera.up.set(0,-1,0);

 

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
testBody.position.set(0, 5, -20)
world.addBody(testBody)


// testing the trigger
const triggerBody = new Body({
    isTrigger: true,
    type: Body.STATIC,
    position: new Vec3(0, 11, -10),
    shape: new Box(new Vec3(4, 1, 2),)
})

function printTrigger(event){
    console.log(event)
    console.log(triggerBody.world)
    bodiesToRemove.push(triggerBody)
    world.addBody(sphereBody)
    triggerBody.removeEventListener("collide", printTrigger)
}
triggerBody.addEventListener("collide", printTrigger)
const bodiesToRemove = []
world.addBody(triggerBody)
//window.addEventListener('keydown', testMove);
// document.body.style.cursor = 'none';
// Render loop
let bodyToRemove = 0
const testScene = new Scene();
testScene.background = new Color(0xff0000);

const onAnimationFrameHandler = (timeStamp) => {

    controls.update();
    inputControl.update();
    // camera.lookAt(scene.target.position);
    world.fixedStep();
    cannonDebugger.update();
    if (bodiesToRemove.length > 0){
        world.removeBody(bodiesToRemove[0])
    }
    // move all physics things and move their three visualizations along with them
    
    sphereMesh.position.copy(sphereBody.position)
    sphereMesh.quaternion.copy(sphereBody.quaternion)
    boxMesh.position.copy(boxBody.position)
    boxMesh.quaternion.copy(boxBody.quaternion)
    
    overheadCamera.position.set(boxBody.position.x, boxBody.position.y+200, boxBody.position.z);
    overheadCamera.lookAt(new Vector3(boxBody.position.x, boxBody.position.y+100, boxBody.position.z));


    // renderer.setRenderTarget(null);
    // renderer.clear();
    // renderer.render(scene, camera);
    
    // renderer.setRenderTarget(newBufferTexture);
    // renderer.render(scene, camera, newBufferTexture);
    // oldBufferTexture.copy(newBufferTexture);

    // CITATION: adapted from https://jsfiddle.net/f2Lommf5/11653/
    renderer.setClearColor( 0x000000 );
  
    renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
    
    renderer.render( scene, camera );
    
    renderer.setClearColor( 0x333333 );
    
    renderer.clearDepth();
    
    renderer.setScissorTest( true );
    const VIEW_X = 16;
    const VIEW_Y = 16;
    const VIEW_WIDTH = window.innerHeight / 4;
    const VIEW_HEIGHT = window.innerHeight / 4;
    renderer.setScissor( VIEW_X, VIEW_Y, VIEW_WIDTH, VIEW_HEIGHT );
    renderer.setViewport( VIEW_X, VIEW_Y, VIEW_WIDTH, VIEW_HEIGHT );
  
    renderer.render( scene, overheadCamera );
      
    renderer.setScissorTest( false );
    // end citation
    
   
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

