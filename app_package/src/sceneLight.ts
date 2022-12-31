import { HemisphericLight, Scene, Vector3 } from "@babylonjs/core";

export class sceneLight extends HemisphericLight {
    constructor(name: string, position: Vector3, scene: Scene) {
        super(name, position, scene);
    }
}