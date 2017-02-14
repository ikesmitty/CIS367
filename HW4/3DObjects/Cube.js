class Cube {
    constructor (gl, subDiv, col1, col2) {

        /* if colors are undefined, generate random colors */
        if (typeof col1 === "undefined") col1 = vec3.fromValues(Math.random(), Math.random(), Math.random());
        if (typeof col2 === "undefined") col2 = vec3.fromValues(Math.random(), Math.random(), Math.random());
        var randColor = vec3.create();
        this.vbuff = gl.createBuffer();

        this.cubeVerticesBuffer = gl.createBuffer();


        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVerticesBuffer);

        var vertices = [];
        // Front face
        vertices.push(-0.3, -0.3,  0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);
        vertices.push(0.3, -0.3,  0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);
        vertices.push(0.3,  0.3,  0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);
        vertices.push(-0.3,  0.3,  0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);

        // Back face
        vertices.push(-0.3, -0.3, -0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);
        vertices.push(-0.3,  0.3, -0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);
        vertices.push(0.3,  0.3, -0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);
        vertices.push(0.3, -0.3, -0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);

        // Top face
        vertices.push(-0.3,  0.3, -0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);
        vertices.push(-0.3,  0.3,  0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);
        vertices.push(0.3,  0.3,  0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);
        vertices.push(0.3,  0.3, -0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);

            // Bottom face
        vertices.push(-0.3, -0.3, -0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);
        vertices.push(0.3, -0.3, -0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);
        vertices.push(0.3, -0.3,  0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);
        vertices.push(-0.3, -0.3,  0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);

            // Right face
        vertices.push(0.3, -0.3, -0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);
        vertices.push(0.3,  0.3, -0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);
        vertices.push(0.3,  0.3,  0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);
        vertices.push(0.3, -0.3,  0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);

            // Left face
        vertices.push(-0.3, -0.3, -0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);
        vertices.push(-0.3, -0.3,  0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);
        vertices.push(-0.3,  0.3,  0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);
        vertices.push(-0.3,  0.3, -0.3);
        vec3.lerp (randColor, col1, col2, Math.random());
        vertices.push(randColor[0], randColor[1], randColor[2]);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuff);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        this.cubeVerticesIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVerticesIndexBuffer);

        var cubeVertexIndices = [
            0,  1,  2,      2, 0, 3,    // front
            9, 10, 8,     8,  11, 10,   // top
            18, 19, 16,   18, 17, 16,        // right
            7, 6, 5,       7, 4, 5,          // back
            23, 20, 22,     22, 21, 20,    // left
            12, 13, 14,     12, 15, 14   // bottom
        ];

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);

        this.indices = [
            {"primitive": gl.TRIANGLE_STRIP, "buffer": this.cubeVerticesIndexBuffer, "numPoints": cubeVertexIndices.length}
        ];
    }

    draw(vertexAttr, colorAttr, modelUniform, coordFrame) {
        gl.uniformMatrix4fv(modelUniform, false, coordFrame);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuff);
        gl.vertexAttribPointer(vertexAttr, 3, gl.FLOAT, false, 24, 0); /* (x,y,z) begins at offset 0 */
        gl.vertexAttribPointer(colorAttr, 3, gl.FLOAT, false, 24, 12); /* (r,g,b) begins at offset 12 */

        for (var k = 0; k < this.indices.length; k++) {
            var obj = this.indices[k];
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.buffer);
            gl.drawElements(obj.primitive, obj.numPoints, gl.UNSIGNED_SHORT, 0);
        }

    }
}
