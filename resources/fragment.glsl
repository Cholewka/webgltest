#version 300 es
precision mediump float;

out vec4 outputColor;

in vec3 ourColor;
in vec2 TexCoord;

uniform sampler2D ourTexture;

void main() {
    outputColor = texture(ourTexture, TexCoord);
}