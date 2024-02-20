#version 300 es
precision mediump float;

in vec2 vertexPosition;
in vec3 vertexColor;

out vec3 ourColor;

void main() {
    gl_Position = vec4(vertexPosition.xy, 0.0, 1.0);
    ourColor = vertexColor;
}