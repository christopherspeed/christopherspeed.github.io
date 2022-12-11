import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Flower, Land, CarInterior } from 'objects';
import { BasicLights } from 'lights';

class SeedScene extends Scene {
    constructor(camera) {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        const land = new Land();
        const flower = new Flower(this);
        const lights = new BasicLights();
        const carInterior = new CarInterior(this, camera);
        this.add(land, flower, carInterior, lights);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp, camera) {
        const { rotationSpeed, updateList } = this.state;
        // this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            // debugger;
            // i guess i don't need to modify the syntax of the function arguments, you can call update
            // of the flower with two arguments even tho it just has one
            obj.update(timeStamp, camera);
        }
   
    }
}

export default SeedScene;
