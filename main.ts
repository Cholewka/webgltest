import Shader from "./src/shader";

let gl: WebGL2RenderingContext;

async function main() {
    const canvas = document.getElementById("webgl-canvas");
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        throw new Error("Cannot find WebGL canvas.");
    }
    const tempGL = canvas.getContext("webgl2");
    if (!tempGL) {
        throw new Error("WebGL2 is not supported in your browser.");
    }
    gl = tempGL;

    const vertices = new Float32Array([
        // 2 for positions, 3 for color
        0.0, 0.5, 1.0, 0.0, 0.0,  // top middle
        0.5, -0.5, 0.0, 1.0, 0.0,  // bottom right
        -0.5, -0.5, 0.0, 0.0, 1.0,  // bottom left
    ]);

    const vbo = gl.createBuffer();
    if (!vbo) {
        throw new Error("Cannot allocate memory for a vertex buffer object.");
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const vao = gl.createVertexArray();
    if (!vao) {
        throw new Error("Cannot allocate memory for a vertex array object.");
    }
    gl.bindVertexArray(vao);

    const shader = new Shader(gl, "vertex.glsl", "fragment.glsl");
    const program = await shader.use();
    gl.useProgram(program);

    // Positions
    const vertexPositionLocation = gl.getAttribLocation(program, "vertexPosition");
    if (vertexPositionLocation < 0) {
        throw new Error("Cannot find attribute location for vertexPosition.");
    }
    gl.vertexAttribPointer(vertexPositionLocation, 2, gl.FLOAT, false, 20, 0);
    gl.enableVertexAttribArray(vertexPositionLocation);

    // Colors
    const vertexColorLocation = gl.getAttribLocation(program, "vertexColor");
    if (vertexColorLocation < 0) {
        throw new Error("Cannot find attribute location for vertexColor.");
    }
    gl.vertexAttribPointer(vertexColorLocation, 3, gl.FLOAT, false, 20, 8);
    gl.enableVertexAttribArray(vertexColorLocation);

    const ebo = gl.createBuffer();
    if (!ebo) {
        throw new Error("Cannot allocate memory for an element buffer object.");
    }

    const indices = new Uint32Array([
        0, 1, 2, // first triangle
    ]);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    let lastFrameTime = performance.now();
    const frame = function () {
        const thisFrameTime = performance.now();
        const deltaTime = (thisFrameTime - lastFrameTime) / 1000;
        lastFrameTime = thisFrameTime;

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_INT, 0);

        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
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