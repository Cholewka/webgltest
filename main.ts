import {init} from "./src/drawing";

async function main() {
    const canvas = document.getElementById("webgl-canvas");
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        throw new Error("Cannot find WebGL canvas.");
    }
    const gl = canvas.getContext("webgl2");
    if (!gl) {
        throw new Error("WebGL2 is not supported in your browser.");
    }
    init(gl);
}

function showError(error: string) {
    console.error(error);
    const errorBox = document.getElementById("error-box");
    if (errorBox === null) {
        return;
    }
    const newErrorElement = document.createElement("p");
    newErrorElement.innerText = error;
    errorBox.appendChild(newErrorElement);
}

try {
    main();
} catch (error: unknown) {
    if (!(error instanceof Error)) {
        showError("Unhandled exception!");
    } else {
        showError(error.message);
        if (error.stack) {
            console.error(error.stack);
        }
    }
}