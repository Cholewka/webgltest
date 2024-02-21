#version 300 es
precision mediump float;

layout (location = 0) in vec3 vertexPosition;
layout (location = 1) in vec2 textureCoordinates;

out vec2 TexCoord;

void main() {
    gl_Position = vec4(vertexPosition.xy, 0.0, 1.0);
    TexCoord = textureCoordinates;
}