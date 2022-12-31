import { Scene, MeshBuilder, StandardMaterial, Color3 } from "@babylonjs/core";

export class originMarker {

    constructor(scene:Scene){
        // Marker for the origin
        const origin = MeshBuilder.CreateSphere("origin",{diameter:0.1},scene);
        const originMat = new StandardMaterial("originMat", scene);
        originMat.diffuseColor = new Color3(1, 0, 0);
        origin.material = originMat;
    }

}