/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 * It loads all of the meshes and collision bodies.
 */

import { WebGLRenderer, PerspectiveCamera, Vector3, SphereGeometry, MeshNormalMaterial, Points, OrthographicCamera, ShaderMaterial, PointsMaterial, AdditiveBlending, Mesh, BoxGeometry, TextureLoader, sRGBEncoding, PlaneGeometry, MeshLambertMaterial, Group, Scene, BufferGeometry, MeshBasicMaterial, Color, ConvexGeometry, DoubleSide, FogExp2 } from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { SeedScene } from 'scenes';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { MakeAudio } from './components/audio';
import { InputControl, PlayerVehicle } from './components/input';


import { GamePhysicsScene,  FrustumCulling, GameScene, SceneCustom, TestScene } from './components/scenes';
import { World, Vec3, Body, Sphere, Plane, Box, Material, Cylinder, Ray, Trimesh, Quaternion, ConvexPolyhedron, RigidVehicle } from 'cannon-es'

import CannonDebugger from 'cannon-es-debugger';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Road from './components/objects/Road/Road';
import {Menu} from './components/objects/Menu';


// load in shaders
const vertexShaderText   = require("./components/shaders/vertexShader.vert").default;
const fragmentShaderText = require("./components/shaders/fragmentShader.frag").default;
console.log(vertexShaderText);
console.log(fragmentShaderText);


// Initialize core ThreeJS components
// const scene = new SeedScene();



const scene = new GameScene();

const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });


let miniMap = false;
let inMenu = true;

const frustCull = new FrustumCulling(scene, camera);
const sound = new MakeAudio(camera);


// Set up camera
camera.position.set(0, 300, -100);
camera.lookAt(new Vector3(0, 0, 0));

// set up overhead camera
const overheadCamera = new OrthographicCamera();
overheadCamera.position.set(0, 10, 100);
overheadCamera.lookAt(new Vector3(0, 0, 0));
overheadCamera.zoom = 0.2;
overheadCamera.updateProjectionMatrix();
overheadCamera.up.set(0,-1,0);

/* CITATION: https://stackoverflow.com/questions/63872740/three-js-scaling-a-plane-to-full-screen 
*/
const menuCamera = new OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
//menuCamera.position.set(0, 300, -100);
//camera.lookAt(new Vector3(0, 0, 0));
 

// the menu is just a scene
//const menu = new Menu(window.innerWidth, window.innerHeight, camera.quaternion);
const menu = new Menu(2, 2, menuCamera.quaternion);
camera.zoom = 0.4;
camera.updateProjectionMatrix();

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);




// scene.fog = new FogExp2(new Color(0x1b2e4d), .02);

scene.fog = new FogExp2(new Color(0x1b2e4d), .006);


const smokeParticleLocation = require("./components/textures/particlesmoke.png").default;
const smokeParticleTexture = new TextureLoader().load(smokeParticleLocation);
console.log(smokeParticleTexture);


const particleCount = 1000;

const particleSystem = createParticleSystem(particleCount);
scene.add(particleSystem);

// gives each particle a slight initial velocity in x/z directions
const particleVelocities = [];
for (let i = 0; i < particleCount; i++) {
    particleVelocities[i] = [(Math.random() - .5) / 4, (Math.random() - .5) / 4];  
}


// COLLISION TO END GAME

const smokeBody = new Body({
    isTrigger: true,
    type: Body.STATIC,
    position: new Vec3(0, 0, 0),
    shape: new Box(new Vector3(100, 1, 100))
})

function printTrigger(event) {
    console.log(event)
    console.log(triggerBody.world)
    //bodiesToRemove.push(triggerBody) ??
    smokeBody.removeEventListener("collide", printTrigger)
}
smokeBody.addEventListener("collide", printTrigger)



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

var controls;


// physics
const world = new World(
    {
        gravity: new Vec3(0, -9.82 * 1.5, 0),
    }
)


const player = new PlayerVehicle(world, [3.1,16, 90]);

/*
const boxBody = new Body({
    shape: new Sphere(1),
    mass: 100,
    linearDamping: 0.8,
    angularDamping: 0.8,
    material: new Material({
        friction: 0.5
    }),
    fixedRotation: true

})*/
const boxBody = player.chassis;
boxBody.quaternion.setFromEuler(-Math.PI/2, Math.PI/2, 0);
console.log(boxBody.position)


const material = new MeshNormalMaterial()
const box_geo = new BoxGeometry(1, 1, 2);
const boxMesh = new Mesh(box_geo, material);

// scene.add(boxMesh, sphereMesh)
const inputControl = new InputControl(camera, scene, player, boxMesh, sound);

scene.add(boxMesh)
// testing the trigger
// const triggerBody = new Body({
//     isTrigger: true,
//     type: Body.STATIC,
//     position: new Vec3(0, 1.5, -10),
//     shape: new Box(new Vec3(4, 1, 2),)
// })

// function printTrigger(event) {
//     console.log(event)
//     console.log(triggerBody.world)
//     bodiesToRemove.push(triggerBody)
//     triggerBody.removeEventListener("collide", printTrigger)
// }
// triggerBody.addEventListener("collide", printTrigger)
// const bodiesToRemove = []

const testMat = new MeshBasicMaterial({
    color: new Color(0x82898c),
    side: DoubleSide
})
const mountainMat = new MeshBasicMaterial({
    color: new Color(0x00898c),
    side: DoubleSide
})
// load in the road models from the scene file list
const models = scene.models;

const loader = new GLTFLoader()
loadRoads(models)

function loadRoads(roadModelsToLoad){
    for (let i = 0; i < roadModelsToLoad.length; i++) {
        loader.load(roadModelsToLoad[i], (gltf) => {
            let mat;
            if (i == 1){
                mat = mountainMat;
            } else mat = testMat;
            const road = new Road(gltf, mat);
            world.addBody(road.body);
            scene.add(road.mesh);
            if (i == 1) road.translate(0, 0, -10)
            scene.roads.push(road);
        })
    }
}


// world.addBody(roads[1].body)
// scene.add(roads[1].mesh)
// roads[1].rotate(0, Math.PI, 0)
var sceneR = menu;

const cannonDebugger = new CannonDebugger(scene, world);

const onAnimationFrameHandler = (timeStamp) => {

    //controls.update();
    inputControl.update();
    sound.update();
    world.fixedStep();

    cannonDebugger.update();

    // smoke.rotation.z += 1; UNCOMMENT WHEN WE GET SMOKE WORKING
    // smoke.position.z += 1;

    // particleSystem.position.y += 0.1;
    updateParticleSystem(particleSystem);
    smokeBody.position.copy(particleSystem.position);

    // if (bodiesToRemove.length > 0) {
    //     world.removeBody(bodiesToRemove[0])
    // } 


    // move all physics things and move their three visualizations along with them
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
    
    if(!inMenu){
        renderer.render(sceneR, camera );
    } else {
        renderer.render(sceneR, menuCamera);
    }


    if(miniMap){    
        renderer.setClearColor( 0x333333 );
        
        renderer.clearDepth();
        
        renderer.setScissorTest( true );
        const VIEW_X = 16;
        const VIEW_Y = 16;
        const VIEW_WIDTH = window.innerHeight / 4;
        const VIEW_HEIGHT = window.innerHeight / 4;
        renderer.setScissor( VIEW_X, VIEW_Y, VIEW_WIDTH, VIEW_HEIGHT );
        renderer.setViewport( VIEW_X, VIEW_Y, VIEW_WIDTH, VIEW_HEIGHT );
    
        renderer.render( sceneR, overheadCamera );
        
        renderer.setScissorTest( false );
    }

    
    // end citation
    
   
    //scene.update && scene.update(timeStamp);

    frustCull.update();

    //renderer.render(sceneR, camera);



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

window.addEventListener('keydown', (event) => {
    if (event.key == 'p') {
        console.log(sceneR);
        sceneR = scene;
        console.log(sceneR);
        
        controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.minDistance = 4;
        controls.maxDistance = 1000;
        controls.update();
        camera.zoom = 1;
        camera.updateProjectionMatrix();
        miniMap = true;
        inMenu = false;
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
function createParticleSystem(particleCount) {
   
    // Particles are just individual vertices in a geometry
    // Create the geometry that will hold all of the vertices

    const verts = [];
   // Create the vertices and add them to the particles geometry
    for (var p = 0; p < particleCount; p++) {
        // This will create all the vertices in a range of -50 to 50 in xy
        var x = Math.random() * 100 - 50;
        var y = 0;
        var z = Math.random() * 100 - 50;
    
        // Create the vertex
        var particle = new Vector3(x, y, z);
    
        // Add the vertex to the geometry
        verts.push(particle);
    }
   
    let particles = new BufferGeometry().setFromPoints( verts )
    // Create the material that will be used to render each vertex of the geometry
    var particleMaterial = new PointsMaterial(
    {color: 0xffffff, 
    size: 6,
    map: smokeParticleTexture,
    blending: AdditiveBlending,
    transparent: true,
    depthTest: true
    });
    /* i give up this doesn't work
    /////////////////////////
    // CITATION, ADAPTED FROM http://stemkoski.github.io/Three.js/ParticleSystem-Attributes.html
    // values that are constant for all particles during a draw call
	var customUniforms = 
	{
		pointTexture:   { value: smokeParticleTexture },
        color: { value: new Color( 0xffffff ) }
	};
	
	// // properties that may vary from particle to particle. only accessible in vertex shaders!
	// //	(can pass color info to fragment shader via vColor.)
	// var customAttributes = 
	// {
	// 	customColor:   { type: "c", value: [] },
    //     customSize:    { type: "c", value: []}
	// };

	// // assign values to attributes, one for each vertex of the geometry
	// for( var v = 0; v < particleCount; v++ ) 
	// {
    //     const l = Math.random() * .5; // luminance
	// 	customAttributes.customColor.value[ v ] = new Color(l, l, l);
    //     customAttributes.customSize.value[  v ] = 2 + Math.random() * 8; 
	// }

    var shaderMaterial = new ShaderMaterial( 
        {
            uniforms: 		customUniforms,
            // attributes:		customAttributes, DEPRECATED ???
            vertexShader:   vertexShaderText,
            fragmentShader: fragmentShaderText,
            blending: AdditiveBlending,
            depthTest: false,
            transparent: true
        });

    // END CITATION 
    ////////////////////
    */

    // Create the particle system
    return new Points(particles, particleMaterial);
     
}


// END OF CITATION
///////////////////////

// Updates particle system at each time step based on current velocity,
// adjusting velocity once bounding box is hit and interacting with 
// a random selection of other particles
function updateParticleSystem(particleSystem) {

    let vertices = particleSystem.geometry.attributes.position.array;
    const numVertices = particleSystem.geometry.attributes.position.count;

    const pull = .00001; // tweak as necessary
    

    // updates particle positions based on velocity
    for (let i = 0; i < numVertices; i++) {
        vertices[ i * 3 + 0 ] += particleVelocities[i][0];

        if (Math.abs(vertices[i * 3 + 0]) > 70) {
            // reverses with slight nudge of randomness
            particleVelocities[i][0] *= -1;
            particleVelocities[i][0] += (Math.random() - .5) / 8;
        }
        vertices[ i * 3 + 1 ] += .001; // y
        vertices[ i * 3 + 2 ] += particleVelocities[i][1];
        if (Math.abs(vertices[i * 3 + 2]) > 70) {
            // reverses with slight nudge of randomness
            particleVelocities[i][1] *= -1;
            particleVelocities[i][1] += (Math.random() - .5) / 8;
        }
    }
    // updates particle velocities through interactions with 
    // random subset of neighbors
    for (let i  = 0; i < numVertices; i++) {
        const x = vertices[ i * 3 + 0 ];
        const z = vertices[ i * 3 + 2 ];
        for (let j = 0; j < 3; j++) {
            const v2 = Math.floor(Math.random() * particleCount);
            if (v2 == i) continue;
            const x1 = vertices[ v2 * 3 + 0];
            const z1 = vertices[ v2 * 3 + 2];
            particleVelocities[i][0] += pull * (x1 - x);
            particleVelocities[i][1] += pull * (z1 - z);

            particleVelocities[v2][0] += pull * (x - x1);
            particleVelocities[v2][1] += pull * (z - z1);
        }

        if (Math.abs(particleVelocities[i][0]) > .25) particleVelocities[i][0] = (Math.random() - .5) / 4; // capping
        if (Math.abs(particleVelocities[i][1]) > .25) particleVelocities[i][1] = (Math.random() - .5) / 4; // capping
    }




    particleSystem.geometry.attributes.position.needsUpdate = true;
}