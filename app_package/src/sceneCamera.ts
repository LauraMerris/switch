import { Camera, ArcRotateCamera, Scene, Vector3 } from "@babylonjs/core";

export class sceneCamera extends ArcRotateCamera {
    constructor(scene: Scene) {
        super("Camera", 0, Math.PI/4, 7, new Vector3(0,0,0), scene);

        this.allowUpsideDown = true;
        this.angularSensibilityX = 2000;
        this.angularSensibilityY = 2000;
        this.wheelPrecision = 10;
        this.lowerRadiusLimit = 3;
        this.upperRadiusLimit = 10;

    }
}