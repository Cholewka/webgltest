#version 300 es
precision mediump float;

layout (location = 0) in vec3 vertexPosition;
layout (location = 1) in vec3 vertexColor;
layout (location = 2) in vec2 textureCoordinates;

out vec3 ourColor;
out vec2 TexCoord;

void main() {
    gl_Position = vec4(vertexPosition.xyz, 1.0);
    ourColor = vertexColor;
    TexCoord = textureCoordinates;
}