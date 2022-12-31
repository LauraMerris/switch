import {Scene, Vector3, Engine, StandardMaterial, Color3, MeshBuilder, TransformNode} from "@babylonjs/core";
import "@babylonjs/loaders";
import { showWorldAxis } from "./axes.js";
import * as earcut from "earcut";
import { sceneCamera } from "./sceneCamera.js";
import { originMarker } from "./utils/originMarker.js";
import { sceneLight } from "./sceneLight.js";

export class switchBuilderScene extends Scene {

    // private variables here like camera and objects
    // getters and setters

    // constructor in which you initialise the variables

    // private methods, such as handlers for observables

    private _devOrigin : originMarker;
    // private _devCoords : directionCoordinates;
    private _camera : sceneCamera;
    private _lights : Array<sceneLight>;
    private _joyconMaterial : StandardMaterial;

    constructor(engine: Engine, canvas: HTMLCanvasElement){
        super(engine);

        showWorldAxis(this,1,new Vector3(0,0,0));

        this._camera = new sceneCamera(this);
        this._camera.attachControl(canvas, true);

        this._lights = new Array<sceneLight>(
            new sceneLight("hemiLight", new Vector3(10, 10, -10), this),
            new sceneLight("hemiLight2", new Vector3(-10, -10, -10), this)
        );

        this._devOrigin = new originMarker(this);

        // standard button color
        const buttonMat = new StandardMaterial("buttonMat", this);
        buttonMat.diffuseColor = new Color3(0, 0, 0);

        // joycon colour
        //const joyconMat = new StandardMaterial("joyconMat", this);
        //joyconMat.diffuseColor = new Color3(0, 1, 0);

        this._joyconMaterial = new StandardMaterial("joyconMat", this);
        this._joyconMaterial.diffuseColor = new Color3(0,1,0);

        // secondary button colour (home, share, bumpers)
        const buttonSecondaryMat = new StandardMaterial("buttonSecondaryMat", this);
        buttonSecondaryMat.diffuseColor = new Color3(0 ,0 ,0);

        // thumb cap color
        const thumbCapMat = new StandardMaterial("thumbCapMat", this);
        thumbCapMat.diffuseColor = new Color3(0 ,0 ,0);

        // build right joycon
        let outline = [
            new Vector3(0,0,0),
            new Vector3(3,0,0),
            new Vector3(3,0,0.5)
        ];
        
        //curved front
        for (let i = 0; i < 20; i++) {
            outline.push(new Vector3((0.5 * Math.cos(i * Math.PI / 40)) + 2.5, 0, 0.5 * Math.sin(i * Math.PI / 40) + 0.5));
        }
    
        outline.push(new Vector3(0.5,0,1));

        for (let i = 20; i > 0; i--) {
            outline.push(new Vector3((-0.5 * Math.cos(i * Math.PI / 40)) + 0.5, 0, 0.5 * Math.sin(i * Math.PI / 40) + 0.5));
        }
        
        const joycon = MeshBuilder.ExtrudePolygon("joycon", {shape: outline, depth: 0.3, sideOrientation:2, wrap:true}, this, earcut.default);

        joycon.material = this._joyconMaterial;
        // end build right joycon

        this._camera.setTarget(joycon,true,true);

        // plus button
        let outlinePlus = [
            new Vector3(0.05,0,0),
            new Vector3(0.1,0,0),
            new Vector3(0.1,0,0.05),
            new Vector3(0.15,0,0.05),
            new Vector3(0.15,0,0.1),
            new Vector3(0.1,0,0.1),
            new Vector3(0.1,0,0.15),
            new Vector3(0.05,0,0.15),
            new Vector3(0.05,0,0.1),
            new Vector3(0,0,0.1),
            new Vector3(0,0,0.05),
            new Vector3(0.05,0,0.05),
        ];

        const plus = MeshBuilder.ExtrudePolygon("plus",{shape: outlinePlus, depth:0.1}, this, earcut.default);
        plus.material = buttonSecondaryMat;
        plus.position = new Vector3(0.2,0.05,0.1);

        // A,B,X,Y buttons
        
        // parent to easily position the buttons as one
        
        let buttons = new TransformNode("buttons",this);

        const button = MeshBuilder.CreateCylinder("button",{diameter:0.24,height:0.1},this);
        button.material = buttonMat;

        const buttonB = button.clone("buttonB");
        buttonB.skeleton = null;
        buttonB.position.x += 0.5;

        const buttonY = button.clone("buttonY");
        buttonY.skeleton = null;
        buttonY.position.x += 0.25;
        buttonY.position.z -= 0.25;

        const buttonA = button.clone("buttonA");
        buttonA.skeleton = null;
        buttonA.position.x += 0.25;
        buttonA.position.z += 0.25;

        const buttonHome = button.clone("home");
        buttonHome.skeleton = null;
        buttonHome.material = buttonSecondaryMat;

        button.parent = buttons;
        buttonB.parent = buttons;
        buttonY.parent = buttons;
        buttonA.parent = buttons;

        buttons.position = new Vector3(0.55,0,0.5);

        buttonHome.position = new Vector3(2.2,0,0.325)

        /* stick */
        
        //this will be the optional cap
        //const thumbCap = BABYLON.MeshBuilder.CreateCylinder("analogueRight",{diameter:0.4,height:0.15},scene);
        //thumbCap.material = thumbCapMat;
        const analogueRight = MeshBuilder.CreateCylinder("analogueRight",{diameter:0.35,height:0.08},this);
        const analogueRightStalk = MeshBuilder.CreateCylinder("analogueRightStalk",{diameter:0.1,height:0.3},this);

        analogueRightStalk.position = new Vector3(1.65,0,0.5);
        analogueRight.position = new Vector3(1.65,0.15,0.5);
        analogueRight.material = buttonSecondaryMat;
        analogueRightStalk.material = buttonSecondaryMat;

        /* bumpers */
        let outlineBumper = [
            new Vector3(0,0,0),
            new Vector3(0.5,0,0),
            new Vector3(0.5,0,0.5)
        ]

        for (let i = 20; i > 0; i--) {
            outlineBumper.push(new Vector3((-0.5 * Math.cos(i * Math.PI / 40)) + 0.5, 0, 0.5 * Math.sin(i * Math.PI / 40)));
        }

        const bumper = MeshBuilder.ExtrudePolygon("bumper", {shape: outlineBumper, depth: 0.1, sideOrientation:2, wrap:true}, this, earcut.default);

        bumper.material = buttonSecondaryMat;
        bumper.position = new Vector3(-0.05, -0.05,0.55);

        // mechanism
        const mechanism = MeshBuilder.CreateBox("mechanism",{width:2.5,height:0.2,depth:0.1});
        mechanism.material = buttonSecondaryMat;
        mechanism.position = new Vector3(1.5,-0.15,-0.02);

        const pill1 = MeshBuilder.CreateBox("pill1", {width:0.25,height:0.07,depth:0.15});
        pill1.material = this._joyconMaterial;
        pill1.position = new Vector3(0.75,-0.15,-0.02);

        const pill2 = pill1.clone("pill2");
        pill2.skeleton = null;
        pill2.position.x += 1.5;

        // parent all elements to joycon
        buttons.parent = joycon;
        analogueRight.parent = joycon;
        analogueRightStalk.parent = joycon;
        plus.parent = joycon;
        buttonHome.parent = joycon;
        mechanism.parent = joycon;
        pill1.parent = joycon;

        let trigger = document.getElementById("joyconColorSelect");
        trigger?.addEventListener("click", () => this._changeJoyconColor());

    }


    private _changeJoyconColor(){
        this._joyconMaterial.diffuseColor = new Color3(1,1,1);
    }

}



