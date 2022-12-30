import { initializeBabylonApp } from "app_package";
import "./style.css";

// this is changing the display size of the canvas
const div = document.createElement("div");
div.className = "model";
//div.style.margin = "2rem auto 0 auto";
//div.style.aspectRatio = "16 / 9";
document.body.appendChild(div);


const canvas = document.createElement("canvas");
canvas.id = "renderCanvas";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.display = "block";
div.appendChild(canvas);


//control panel
let panel = document.createElement("div");
panel.className = "UI";
let button = document.createElement("button");
button.className = "UIButton";
button.setAttribute("id","joyconColorSelect");
button.type = "button";
button.textContent = "change colour";
button.value = "red";

panel.appendChild(button);
div.appendChild(panel);


let assetsHostUrl;
if (DEV_BUILD) {
    assetsHostUrl = "http://127.0.0.1:8181/";
} else {
    assetsHostUrl = "https://nonlocal-assets-host-url/";
}
initializeBabylonApp({ canvas: canvas, assetsHostUrl: assetsHostUrl });
