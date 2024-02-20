import { getFileContents } from "./resources";

enum ShaderType {
    VERTEX_SHADER = WebGL2RenderingContext.VERTEX_SHADER,
    FRAGMENT_SHADER = WebGL2RenderingContext.FRAGMENT_SHADER,
}

class Shader {
    private id: WebGLProgram;
    private gl: WebGL2RenderingContext;
    private ready: Promise<boolean>;

    public constructor(gl: WebGL2RenderingContext, vertexPath: string, fragmentPath: string) {
        this.gl = gl;

        const program = gl.createProgram();
        if (!program) {
            throw new Error("Cannot allocate memory for a program.");
        }

        // Read source files asynchronously
        this.ready = new Promise((resolve) => {
            this.getSourceFiles(vertexPath, fragmentPath).then(({ vertex, fragment }) => {
                this.gl.attachShader(program, this.compileShader(vertex, ShaderType.VERTEX_SHADER));
                this.gl.attachShader(program, this.compileShader(fragment, ShaderType.FRAGMENT_SHADER));
                this.gl.linkProgram(program);

                if (!gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
                    const infoLog = this.gl.getProgramInfoLog(program);
                    throw new Error(`Cannot compile a program:\n${infoLog}`);
                }
            }).finally(() => resolve(true));
        });

        this.id = program;
    }

    public async use(): Promise<WebGLProgram> {
        await this.ready;
        this.gl.useProgram(this.id);
        return this.id;
    }

    private compileShader(source: string, type: ShaderType): WebGLShader {
        const shader = this.gl.createShader(type);
        if (!shader) {
            throw new Error("Cannot allocate memory for a shader.");
        }
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            const infoLog = this.gl.getShaderInfoLog(shader);
            throw new Error(`Cannot compile ${type}:\n${infoLog}`);
        }
        return shader;
    }

    private async getSourceFiles(vertexPath: string, fragmentPath: string) {
        const vertexSource = await getFileContents(vertexPath);
        if (!vertexSource) {
            throw new Error("Cannot fetch shader source file " + vertexPath + ".");
        }
        const fragmentSource = await getFileContents(fragmentPath);
        if (!fragmentSource) {
            throw new Error("Cannot fetch shader source file " + fragmentPath + ".");
        }
        return { vertex: vertexSource, fragment: fragmentSource };
    }
}

export default Shader;