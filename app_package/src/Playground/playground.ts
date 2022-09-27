import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

import * as earcut from "earcut";

class Playground {
    public static CreateScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement): BABYLON.Scene {
        // This creates a basic Babylon Scene object (non-mesh)
        var scene = new BABYLON.Scene(engine);

        // This creates and positions a free camera (non-mesh)
        //var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

        // camera and light
        let camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI /2, Math.PI / 3, 20, BABYLON.Vector3.Zero(), scene);

        // This targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

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
        joycon.position.y = 2;

        // plus button


        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        //var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
        
        //let groundMat = new BABYLON.StandardMaterial("materialGround", scene);
        //groundMat.diffuseColor = new BABYLON.Color3(0,1,0);
        //ground.material = groundMat;
        
        return scene;
    }
}

export function CreatePlaygroundScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement): BABYLON.Scene {
    return Playground.CreateScene(engine, canvas);
}
