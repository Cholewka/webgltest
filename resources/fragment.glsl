#version 300 es
precision mediump float;

out vec4 outputColor;

in vec3 ourColor;

void main() {
    outputColor = vec4(ourColor.xyz, 1.0);
}