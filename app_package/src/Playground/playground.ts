import * as BABYLON from "@babylonjs/core";
import * as GUI from '@babylonjs/gui';
import "@babylonjs/loaders";
import { ArcRotateCameraKeyboardMoveInput, Color3, Vector3, Viewport } from "babylonjs";
import { showWorldAxis} from '../axes.js';
import * as earcut from "earcut";
import { sceneCamera } from "../sceneCamera.js";
import { originMarker } from "../utils/originMarker.js";
import { sceneLight } from "../sceneLight.js";

class Playground {
    public static CreateScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement): BABYLON.Scene {
        // This creates a basic Babylon Scene object (non-mesh)
        var scene = new BABYLON.Scene(engine);

        showWorldAxis(scene,1,new Vector3(0,0,0));

        // This creates and positions a free camera (non-mesh)
        //var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

        // camera and light
        //let camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI/4, 7, BABYLON.Vector3.Zero(), scene);

        //camera.allowUpsideDown = true;
        //camera.lowerBetaLimit = null;
        //camera.upperBetaLimit = null;
       

        let camera = new sceneCamera(scene);
        camera.attachControl(canvas, true);

        //camera.angularSensibilityX = 2000;
        //camera.angularSensibilityY = 2000;
        //camera.wheelPrecision = 10;
        //camera.lowerRadiusLimit = 3;
        //camera.upperRadiusLimit = 10;

        //camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");
        //camera.inputs.removeByType("ArcRotateCameraMouseWheelInput");

        const light = new sceneLight("hemiLight", new BABYLON.Vector3(10, 10, -10), scene);
        const light2 = new sceneLight("hemiLight2", new BABYLON.Vector3(-10, -10, -10), scene);

        //const light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(10, 10, -10),scene);
        //const light2 = new BABYLON.HemisphericLight("hemiLight2", new BABYLON.Vector3(-10, -10, -10),scene);
        //light.intensity = 0.7;

        // Marker for the origin
        //const origin = BABYLON.MeshBuilder.CreateSphere("origin",{diameter:0.1},scene);
        //const originMat = new BABYLON.StandardMaterial("originMat", scene);
        //originMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
        //origin.material = originMat;

        let origin = new originMarker(scene);

        // standard button color
        const buttonMat = new BABYLON.StandardMaterial("buttonMat", scene);
        buttonMat.diffuseColor = new BABYLON.Color3(0, 0, 0);

        // joycon colour
        const joyconMat = new BABYLON.StandardMaterial("joyconMat", scene);
        joyconMat.diffuseColor = new BABYLON.Color3(0, 1, 0);

        // secondary button colour (home, share, bumpers)
        const buttonSecondaryMat = new BABYLON.StandardMaterial("buttonSecondaryMat", scene);
        buttonSecondaryMat.diffuseColor = new BABYLON.Color3(0 ,0 ,0);

        // thumb cap color
        const thumbCapMat = new BABYLON.StandardMaterial("thumbCapMat", scene);
        thumbCapMat.diffuseColor = new BABYLON.Color3(0 ,0 ,0);

        // build right joycon
        let outline = [
            new BABYLON.Vector3(0,0,0),
            new BABYLON.Vector3(3,0,0),
            new BABYLON.Vector3(3,0,0.5)
        ];
        
        //curved front
        for (let i = 0; i < 20; i++) {
            outline.push(new BABYLON.Vector3((0.5 * Math.cos(i * Math.PI / 40)) + 2.5, 0, 0.5 * Math.sin(i * Math.PI / 40) + 0.5));
        }
    
        outline.push(new BABYLON.Vector3(0.5,0,1));

        for (let i = 20; i > 0; i--) {
            outline.push(new BABYLON.Vector3((-0.5 * Math.cos(i * Math.PI / 40)) + 0.5, 0, 0.5 * Math.sin(i * Math.PI / 40) + 0.5));
        }
        
        const joycon = BABYLON.MeshBuilder.ExtrudePolygon("joycon", {shape: outline, depth: 0.3, sideOrientation:2, wrap:true}, scene, earcut.default);

        joycon.material = joyconMat;
        // end build right joycon

        camera.setTarget(joycon,true,true);

        // plus button
        let outlinePlus = [
            new BABYLON.Vector3(0.05,0,0),
            new BABYLON.Vector3(0.1,0,0),
            new BABYLON.Vector3(0.1,0,0.05),
            new BABYLON.Vector3(0.15,0,0.05),
            new BABYLON.Vector3(0.15,0,0.1),
            new BABYLON.Vector3(0.1,0,0.1),
            new BABYLON.Vector3(0.1,0,0.15),
            new BABYLON.Vector3(0.05,0,0.15),
            new BABYLON.Vector3(0.05,0,0.1),
            new BABYLON.Vector3(0,0,0.1),
            new BABYLON.Vector3(0,0,0.05),
            new BABYLON.Vector3(0.05,0,0.05),
        ];

        const plus = BABYLON.MeshBuilder.ExtrudePolygon("plus",{shape: outlinePlus, depth:0.1}, scene, earcut.default);
        plus.material = buttonSecondaryMat;
        plus.position = new BABYLON.Vector3(0.2,0.05,0.1);

        // A,B,X,Y buttons
        
        // parent to easily position the buttons as one
        
        let buttons = new BABYLON.TransformNode("buttons",scene);

        const button = BABYLON.MeshBuilder.CreateCylinder("button",{diameter:0.24,height:0.1},scene);
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

        buttons.position = new BABYLON.Vector3(0.55,0,0.5);

        buttonHome.position = new BABYLON.Vector3(2.2,0,0.325)

        /* stick */
        
        //this will be the optional cap
        //const thumbCap = BABYLON.MeshBuilder.CreateCylinder("analogueRight",{diameter:0.4,height:0.15},scene);
        //thumbCap.material = thumbCapMat;
        const analogueRight = BABYLON.MeshBuilder.CreateCylinder("analogueRight",{diameter:0.35,height:0.08},scene);
        const analogueRightStalk = BABYLON.MeshBuilder.CreateCylinder("analogueRightStalk",{diameter:0.1,height:0.3},scene);

        analogueRightStalk.position = new BABYLON.Vector3(1.65,0,0.5);
        analogueRight.position = new BABYLON.Vector3(1.65,0.15,0.5);
        analogueRight.material = buttonSecondaryMat;
        analogueRightStalk.material = buttonSecondaryMat;

        /* bumpers */
        let outlineBumper = [
            new BABYLON.Vector3(0,0,0),
            new BABYLON.Vector3(0.5,0,0),
            new BABYLON.Vector3(0.5,0,0.5)
        ]

        for (let i = 20; i > 0; i--) {
            outlineBumper.push(new BABYLON.Vector3((-0.5 * Math.cos(i * Math.PI / 40)) + 0.5, 0, 0.5 * Math.sin(i * Math.PI / 40)));
        }

        const bumper = BABYLON.MeshBuilder.ExtrudePolygon("bumper", {shape: outlineBumper, depth: 0.1, sideOrientation:2, wrap:true}, scene, earcut.default);

        bumper.material = buttonSecondaryMat;
        bumper.position = new BABYLON.Vector3(-0.05, -0.05,0.55);

        // mechanism
        const mechanism = BABYLON.MeshBuilder.CreateBox("mechanism",{width:2.5,height:0.2,depth:0.1});
        mechanism.material = buttonSecondaryMat;
        mechanism.position = new BABYLON.Vector3(1.5,-0.15,-0.02);

        const pill1 = BABYLON.MeshBuilder.CreateBox("pill1", {width:0.25,height:0.07,depth:0.15});
        pill1.material = joyconMat;
        pill1.position = new BABYLON.Vector3(0.75,-0.15,-0.02);

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

        
        // start GUI panel
        /*
        var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI",true,scene);

        var panelBackground = new GUI.Rectangle();
        panelBackground.width = "340px";
        panelBackground.cornerRadius = 20;
        panelBackground.background = "#fcfcf7";
        panelBackground.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panelBackground.thickness = 0;
        panelBackground.color = "#e8e8e8";
        panelBackground.paddingTop = "50px";
        panelBackground.paddingLeft = "50px";
        panelBackground.paddingBottom = "50px";
        advancedTexture.addControl(panelBackground);

        var panel = new GUI.StackPanel();
        panel.width = "300px";
        panel.isVertical = true;
        panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        panelBackground.addControl(panel);

        var textBlock = new GUI.TextBlock();
        textBlock.text = "Joycon colour:";
        textBlock.color = "#333";
        textBlock.height = "60px";
        textBlock.fontSize = 30;
        textBlock.paddingTop = "10px";
        panel.addControl(textBlock);     

        var picker = new GUI.ColorPicker();
        picker.value = joyconMat.diffuseColor;
        picker.height = "150px";
        picker.width = "150px";
        picker.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        picker.onValueChangedObservable.add(function(value) { // value is a color3
            joyconMat.diffuseColor.copyFrom(value);
        });
        panel.addControl(picker);

        var buttonColorHeading = new GUI.TextBlock();
        buttonColorHeading.text = "Button colour:";
        buttonColorHeading.color = "#333";
        buttonColorHeading.height = "60px";
        buttonColorHeading.fontSize = 30;
        buttonColorHeading.paddingTop = "10px";
        panel.addControl(buttonColorHeading);     

        var buttonColorPicker = new GUI.ColorPicker();
        buttonColorPicker.value = joyconMat.diffuseColor;
        buttonColorPicker.height = "150px";
        buttonColorPicker.width = "150px";
        buttonColorPicker.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        buttonColorPicker.onValueChangedObservable.add(function(value) { // value is a color3
            buttonMat.diffuseColor.copyFrom(value);
        });
        panel.addControl(buttonColorPicker);
        
        var secondaryHeading = new GUI.TextBlock();
        secondaryHeading.text = "Thumb grip:";
        secondaryHeading.color = "#333";
        secondaryHeading.height = "60px";
        secondaryHeading.fontSize = 30;
        secondaryHeading.paddingTop = "10px";
        panel.addControl(secondaryHeading);     

        var secondaryColorPicker = new GUI.ColorPicker();
        secondaryColorPicker.value = joyconMat.diffuseColor;
        secondaryColorPicker.height = "150px";
        secondaryColorPicker.width = "150px";
        secondaryColorPicker.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        secondaryColorPicker.onValueChangedObservable.add(function(value) { // value is a color3
            buttonSecondaryMat.diffuseColor.copyFrom(value);
        });
        panel.addControl(secondaryColorPicker);
        // end GUI panel
        */

        //let panel = document.createElement("div");
        //panel.className = "UI";

        //document.body.appendChild(panel);

        // listeners for color changing

        //joyconMat
        //buttonMat
        //buttonSecondaryMat
        //thumbCapMat

        function changeJoyconColor(){
            joyconMat.diffuseColor.copyFrom(new BABYLON.Color3(1,1,1));
        }

        let trigger = document.getElementById("joyconColorSelect");
        trigger?.addEventListener("click", changeJoyconColor);
        return scene;
    }
}

export function CreatePlaygroundScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement): BABYLON.Scene {
    return Playground.CreateScene(engine, canvas);
}
