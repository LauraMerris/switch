import * as BABYLON from "@babylonjs/core";
import * as GUI from '@babylonjs/gui';
import "@babylonjs/loaders";

import * as earcut from "earcut";

class Playground {
    public static CreateScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement): BABYLON.Scene {
        // This creates a basic Babylon Scene object (non-mesh)
        var scene = new BABYLON.Scene(engine);

        // This creates and positions a free camera (non-mesh)
        //var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

        // camera and light
        let camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI /2, Math.PI / 3, 10, BABYLON.Vector3.Zero(), scene);

        camera.allowUpsideDown = true;
        camera.lowerBetaLimit = null;
        camera.upperBetaLimit = null;

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        // Marker for the origin
        const origin = BABYLON.MeshBuilder.CreateSphere("origin",{diameter:0.1},scene);
        const originMat = new BABYLON.StandardMaterial("originMat", scene);
        originMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
        origin.material = originMat;

        // standard button color
        const buttonMat = new BABYLON.StandardMaterial("buttonMat", scene);
        buttonMat.diffuseColor = new BABYLON.Color3(0, 0, 0);

        // joycon colour
        const joyconMat = new BABYLON.StandardMaterial("joyconMat", scene);
        joyconMat.diffuseColor = new BABYLON.Color3(0, 1, 0);

        // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
        //var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

        let outline = [
            new BABYLON.Vector3(0,0,0),
            new BABYLON.Vector3(3,0,0),
            new BABYLON.Vector3(3,0,0.75)
        ];
        
        //curved front
        for (let i = 0; i < 20; i++) {
            outline.push(new BABYLON.Vector3((0.25 * Math.cos(i * Math.PI / 40)) + 2.75, 0, 0.25 * Math.sin(i * Math.PI / 40) + 0.75));
        }

        //outline.push(new BABYLON.Vector3(2.75,0,1));       
        outline.push(new BABYLON.Vector3(0.25,0,1));

        for (let i = 20; i > 0; i--) {
            outline.push(new BABYLON.Vector3((-0.25 * Math.cos(i * Math.PI / 40)) + 0.25, 0, 0.25 * Math.sin(i * Math.PI / 40) + 0.75));
        }

        outline.push(new BABYLON.Vector3(0,0,0.75));

        
        const joycon = BABYLON.MeshBuilder.ExtrudePolygon("joycon", {shape: outline, depth: 0.3}, scene, earcut.default);
        //joycon.position.y = 2;
        joycon.material = joyconMat;

        camera.setTarget(joycon,true,false);

        // plus button
        let outlinePlus = [
            new BABYLON.Vector3(0,0,0),
            new BABYLON.Vector3(0.15,0,0),
            new BABYLON.Vector3(0.15,0,0.15),
            new BABYLON.Vector3(0,0,0.15)
        ];

        const plus = BABYLON.MeshBuilder.ExtrudePolygon("plus",{shape: outlinePlus, depth:0.1}, scene, earcut.default);
        plus.material = buttonMat;
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

        button.parent = buttons;
        buttonB.parent = buttons;
        buttonY.parent = buttons;
        buttonA.parent = buttons;

        buttons.position = new BABYLON.Vector3(0.55,0,0.5);

        buttonHome.position = new BABYLON.Vector3(2.2,0,0.325)

        /* stick */
        
        const analogueRight = BABYLON.MeshBuilder.CreateCylinder("analogueRight",{diameter:0.4,height:0.1},scene);
        button.material = buttonMat;

        analogueRight.position = new BABYLON.Vector3(1.65,0,0.5);
        analogueRight.material = buttonMat;

        
     // GUI
    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI",true,scene);

    var panel = new GUI.StackPanel();
    panel.width = "200px";
    panel.isVertical = true;
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(panel);

    var textBlock = new GUI.TextBlock();
    textBlock.text = "Color:";
    textBlock.color = "#fff";
    textBlock.height = "30px";
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

        return scene;
    }
}

export function CreatePlaygroundScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement): BABYLON.Scene {
    return Playground.CreateScene(engine, canvas);
}
