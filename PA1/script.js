onload = function () {
    canvas = document.getElementById("webgl-canvas");
    canvas.width = 2000;
    canvas.height = 2000;

    textures = [wood, stone, lava]
    setup = async function () {
        const [vertices, faces, averagedNormals] = await calculateVertices();

        const [shaderProgram, vertexBuffer, facesBuffer, normalsBuffer] = await initProgram(vertices, faces, averagedNormals);

        tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        var image = new Image();

        image.src = textures[currentTexture];
        image.onload = async () => {
            shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "u_Sampler");
            gl.uniform1i(shaderProgram.samplerUniform, 0);

            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

            await drawAnaglyphModel(shaderProgram, vertexBuffer, facesBuffer, faces, normalsBuffer);
        }
    }
    setup();
    processEvents(setup);

    document.getElementById("switch-button").addEventListener("click", function () {
        var div1 = document.getElementById("figure-settings");
        var div2 = document.getElementById("stereo-settings");
        var button = document.getElementById("switch-button");

        if (div1.style.display === "none") {
            div1.style.display = "flex";
            div2.style.display = "none";
            button.textContent = "3D";
        } else {
            div1.style.display = "none";
            div2.style.display = "flex";
            button.textContent = "Фігура";
        }
    });
}