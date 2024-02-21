import Shader from './shader';
import {loadImage} from "./resources";

export async function init(gl: WebGL2RenderingContext) {
    const vertices = new Float32Array([
        // position (8 bytes)   // texture coordinates (8 bytes)
         0.5,  0.5,             1.0, 1.0,
         0.5, -0.5,             1.0, 0.0,
        -0.5, -0.5,             0.0, 0.0,
        -0.5,  0.5,             0.0, 1.0,        
    ]);

    const indices = new Uint32Array([
        0, 1, 3,    // first triangle
        1, 2, 3,    // second triangle
    ])
    
    // Vertex Buffer Object
    const vertexBufferObject = gl.createBuffer();
    if (!vertexBufferObject) {
        throw new Error("Cannot allocate memory for a vertex buffer object.");
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Vertex Array Object
    const vertexArrayObject = gl.createVertexArray();
    if (!vertexArrayObject) {
        throw new Error("Cannot allocate memory for a vertex array object.");
    }
    gl.bindVertexArray(vertexArrayObject);

    // Load program
    const program = await new Shader(gl, "vertex.glsl", "fragment.glsl").use();
    gl.useProgram(program);

    // Set Attribute Pointers
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(0);

    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
    gl.enableVertexAttribArray(1);

    // Element Buffer Object
    const ebo = gl.createBuffer();
    if (!ebo) {
        throw new Error("Cannot allocate memory for an element buffer object.");
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    // Create Texture
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    /// Box
    const boxImage = await loadImage("../resources/texture.jpg");
    const box = newTexture(gl, boxImage);
    
    /// Awesome Face
    const faceImage = await loadImage("../resources/awesomeface.png");
    const face = newTexture(gl, faceImage);

    /// Setup Shader
    gl.uniform1i(gl.getUniformLocation(program, "texture1"), 0);
    gl.uniform1i(gl.getUniformLocation(program, "texture2"), 1);

    // Draw Call
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindVertexArray(vertexArrayObject);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, box);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, face);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
}

function newTexture(gl: WebGL2RenderingContext, source: HTMLImageElement) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, source.width, source.height, 0, gl.RGB, gl.UNSIGNED_BYTE, source);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    gl.generateMipmap(gl.TEXTURE_2D);
    return texture;
}