import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Flower, Land, Text } from 'objects';
import { BasicLights } from 'lights';

class SeedScene extends Scene {
    constructor(direction) {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
            direction: direction,
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        const land = new Land();
        const flower = new Flower(this);
        const lights = new BasicLights();
        const text = new Text(this, direction, 4);
        this.add(land, flower, lights, text);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp, cameraQuaternion) {
        const { rotationSpeed, updateList } = this.state;
        //this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp, cameraQuaternion);
        }
    }
}

export default SeedScene;
