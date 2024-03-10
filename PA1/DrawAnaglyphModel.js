function drawAnaglyphModel(shaderProgram, vertexBuffer, facesBuffer, faces, normalsBuffer) {
    gl.useProgram(shaderProgram);

    var u_Pmatrix = gl.getUniformLocation(shaderProgram, 'u_Pmatrix');
    var u_Mmatrix = gl.getUniformLocation(shaderProgram, 'u_Mmatrix');
    var u_Vmatrix = gl.getUniformLocation(shaderProgram, 'u_Vmatrix');

    const distance = viewPosition[2];
    var PROJMATRIX = mat4.ortho(-distance, distance, -distance, distance, 0.1, 1000);

    var VIEWMATRIX = mat4.create();
    var MODELMATRIX = mat4.create();

    currentX += swipeDelta[0]
    currentY += swipeDelta[1]

    mat4.identity(VIEWMATRIX);
    mat4.identity(MODELMATRIX);

    mat4.translate(VIEWMATRIX, viewPosition);

    mat4.rotateX(MODELMATRIX, -sensivity * currentY);
    mat4.rotateY(MODELMATRIX, sensivity * currentX);
    mat4.scale(MODELMATRIX, scale);

    gl.uniformMatrix4fv(u_Pmatrix, false, PROJMATRIX);
    gl.uniformMatrix4fv(u_Mmatrix, false, MODELMATRIX);
    gl.uniformMatrix4fv(u_Vmatrix, false, VIEWMATRIX);

    const u_LightDirection = gl.getUniformLocation(shaderProgram, 'u_LightDirection');
    const u_LightColor = gl.getUniformLocation(shaderProgram, 'u_LightColor');
    const u_LightIntensity = gl.getUniformLocation(shaderProgram, 'u_LightIntensity');
    gl.uniform3f(u_LightDirection, lightDirection[0], lightDirection[1], lightDirection[2]);
    gl.uniform4f(u_LightColor, lightColor[0], lightColor[1], lightColor[2], 1.0);
    gl.uniform1f(u_LightIntensity, lightIntensity);

    const u_AmbientColor = gl.getUniformLocation(shaderProgram, 'u_AmbientColor');
    const u_ViewPosition = gl.getUniformLocation(shaderProgram, 'u_ViewPosition');
    const u_Shininess = gl.getUniformLocation(shaderProgram, 'u_Shininess');
    gl.uniform4f(u_AmbientColor, ambientColor[0], ambientColor[1], ambientColor[2], 1.0);
    gl.uniform3f(u_ViewPosition, viewPosition[0], viewPosition[1], viewPosition[2]);
    gl.uniform1f(u_Shininess, shininess);

    const u_Parallax = gl.getUniformLocation(shaderProgram, 'u_Parallax');
    gl.uniform1f(u_Parallax, parallax);

    const a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
    const a_Color = gl.getAttribLocation(shaderProgram, 'a_Color');
    const a_Normal = gl.getAttribLocation(shaderProgram, 'a_Normal');

    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Color);
    gl.enableVertexAttribArray(a_Normal);

    gl.clearColor(0.06, 0.02, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    cam = new StereoCamera(
        convergence,
        eyeSeparation,
        1,
        fov,
        nearClipping,
        20000.0);

    cam.applyLeftFrustum(gl, MODELMATRIX, u_Mmatrix, PROJMATRIX, u_Pmatrix);

    gl.colorMask(true, false, false, false);
    drawSurface(vertexBuffer, normalsBuffer, facesBuffer, a_Position, a_Normal, a_Color, faces);

    gl.clear(gl.DEPTH_BUFFER_BIT);

    cam.applyRightFrustum(gl, MODELMATRIX, u_Mmatrix, PROJMATRIX, u_Pmatrix);
    gl.colorMask(false, true, true, false);
    drawSurface(vertexBuffer, normalsBuffer, facesBuffer, a_Position, a_Normal, a_Color, faces);

    gl.colorMask(true, true, true, true);
}


function drawSurface(vertexBuffer, normalsBuffer, facesBuffer, a_Position, a_Normal, a_Color, faces) {
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);

    const byteCount = 4;

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, byteCount * (3 + 3 + 2), 0);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, byteCount * (3 + 3 + 2), 3 * byteCount);

    gl.enable(gl.DEPTH_TEST);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, facesBuffer);
    gl.drawElements(gl.TRIANGLES, faces.length, gl.UNSIGNED_SHORT, 0);
}